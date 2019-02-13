const paypal = require('paypal-rest-sdk');

module.exports = {
  extend: 'apostrophe-module',
  name: 'ncc-paypal',
  label: 'Paypal Module',

  beforeConstruct: function (self, options) {
    // Insert code here
  },

  construct: function (self, options) {
    if (!options.clientID || !options.secret || !options.mode || !options.cancelUrl || !options.returnUrl) {
      console.error('WARNING: missing clientID, secret or mode in ncc-paypal module config');
    }
    // Paypal variables
    const clientID = options.clientID;
    const secret = options.secret;
    const mode = options.mode;
    const returnUrl = options.returnUrl;
    const cancelUrl = options.cancelUrl;

    paypal.configure({
      mode: mode, //sandbox or live
      client_id: clientID,
      client_secret: secret
    });

    self.apos.app.get('/paypal/purchase', function (req, res) {
      const items = [];
      let totalPay = 0;
      self.apos.docs.getManager('ncc-product').find(req,
        {
          _id: { $in: req.session.cart }
        }
      ).toArray((err, products) => {
        if (err) {
          console.log(JSON.stringify(err));
          req.aposError = err;
        }
        for (var i = 0; i < products.length; i++) {
          console.log(products[i]);
          totalPay += +products[i].total * req.session.cartTotals[i];
          items.push({
            sku: products[i].product_id,
            quantity: req.session.cartTotals[i],
            price: products[i].total,
            currency: req.data.global.currencyPaypal
          });
        }
        const create_payment_json = {
          intent: 'sale',
          payer: {
            payment_method: 'paypal'
          },
          redirect_urls: {
            return_url: returnUrl,
            cancel_url: cancelUrl
          },
          transactions: [{
            item_list: {
              items: items
            },
            amount: {
              currency: req.data.global.currencyPaypal,
              total: totalPay
            },
            description: 'This is the payment description.'
          }]
        };

        paypal.payment.create(create_payment_json, function (error, payment) {
          if (error) {
            console.log(error);
          } else {
            const order = {
              userId: req.data.user._id,
              paymentId: payment.id,
              paymentState: payment.state,
              items,
              totalPay
            };
            console.log(order);
            // Clear session
            delete req.session.cart;
            delete req.session.cartTotals;
            self.apos.db.collection('nccorders').insertOne(order, function(err, collection) {
              if (err) {
                req.aposError = err;
              }
              // TODO: manage errors
              res.redirect('back');
            });
          }
        });

      });
    });
  }
};
