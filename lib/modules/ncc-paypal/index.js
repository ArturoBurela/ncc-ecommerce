const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');
const { each } = require('async');

module.exports = {
  extend: 'apostrophe-module',
  name: 'ncc-paypal',
  label: 'Paypal Module',

  beforeConstruct: function (self, options) {
    // Insert code here
  },

  construct: function (self, options) {
    if (!options.clientID || !options.secret || !options.mode) {
      console.error('WARNING: missing clientID, secret or mode in ncc-paypal module config');
    }
    // Paypal variables
    const clientId = options.clientID;
    const clientSecret = options.secret;
    const mode = options.mode;

    let paypalEnv;
    if (mode === 'live') {
      paypalEnv = new checkoutNodeJssdk.core.LiveEnvironment(
        clientId, clientSecret
      );
    } else {
      paypalEnv = new checkoutNodeJssdk.core.SandboxEnvironment(
        clientId, clientSecret
      );
    }

    const client = new checkoutNodeJssdk.core.PayPalHttpClient(paypalEnv);

    self.apos.app.post('/paypal/complete', function (req, res, next) {
      const items = [];
      let totalPay = 0;
      self.apos.docs.getManager('ncc-product').find(req,
        {
          _id: { $in: req.session.cart }
        }
      ).toArray((err, products) => {
        if (err) {
          console.log(JSON.stringify(err));
          return res.json(err);

        }
        for (var i = 0; i < products.length; i++) {
          const cartQuantity = req.session.cartTotals[i];
          // Check quantity
          const quantityAfter = products[i].quantity - cartQuantity;
          if (quantityAfter < 0) {
            const err = `Product ${products[i].title} quantity problem`;
            return res.json(err);
          }
          totalPay += +products[i].total * cartQuantity;
          items.push({
            id: products[i]._id,
            quantity: cartQuantity
          });
        }
        const order = {
          userId: req.data.user._id,
          payerId: req.body.payerID,
          orderId: req.body.orderID,
          items,
          totalPay
        };
        self.apos.db.collection('nccorders').insertOne(order, function(err, collection) {
          if (err) {
            return res.json(err);
          }
          // Decrease quantity
          each(items, (item, cb) => {
            // Access a product from this other module
            self.apos.docs.db.update({
              _id: item.id
            }, { $inc: { quantity: -item.quantity } }, (err) => {
              console.log(err);
              if (err) cb(err);
              else cb();
            });
          }, err => {
            if (err) {
              return res.json(err);
            }
            // Clear session
            delete req.session.cart;
            delete req.session.cartTotals;

            res.json({success: true});
          });

        });
      });
    });

  }
};
