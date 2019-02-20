const { each } = require('async');

module.exports = {
  extend: 'apostrophe-module',
  name: 'ncc-pos',
  label: 'POS Module',

  beforeConstruct: function (self, options) {
    // Insert code here
  },

  construct: function (self, options) {
    self.apos.adminBar.add(self.__meta.name, 'Pos', null, {
      href: '/pos'
    });
    self.pushAsset('script', 'user', { when: 'user' });

    self.apos.app.get('/pos', function (req, res) {
      // TODO: see permission access https://apostrophecms.org/docs/tutorials/intermediate/permissions.html
      return self.sendPage(req, self.renderer('pos'), {});
    });

    self.apos.app.post('/pos/complete', function (req, res, next) {
      console.log(req.body);
      const items = [], productIds = [];
      for (const product in req.body.cart) {
        productIds.push(product);
      }
      let totalPay = 0;
      self.apos.docs.getManager('ncc-product').find(req,
        {
          _id: { $in: productIds }
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
            title: products[i].title,
            quantity: cartQuantity
          });
        }
        const order = {
          employeeId: req.data.user._id,
          type: 'pos',
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
              if (err) cb(err);
              else cb();
            });
          }, err => {
            if (err) {
              return res.json(err);
            }

            res.json({success: true});
          });

        });
      });
    });

  }

};
