module.exports = {
  name: 'ncc-cart',
  alias: 'Cart',
  label: 'Cart',
  extends: 'apostrophe-module',

  beforeConstruct: function (self, options) {
    // Insert code here
  },

  construct: function (self, options) {
    self.pushAsset('script', 'user', { when: 'user' });

    // Manages cart quantities
    checkCart = function (req, product_id, add, quantity, cb) {
      const i = req.session.cart.indexOf(product_id);
      // Element in cart
      if (i > -1) {
        if (add) {
          req.session.cartTotals[i] += quantity;
        } else {
          req.session.cart.splice(i, 1);
          req.session.cartTotals.splice(i, 1);
        }
        //If not in cart but we want to add
      } else if (add) {
        req.session.cart.push(product_id);
        req.session.cartTotals.push(quantity);
      }
      cb();
    };

    // Returns true or false if product is found by id
    const findProduct = function (req, product_id, cb) {
      // Use docs manager
      self.apos.docs.getManager('ncc-product').find(req,
        {
          _id: product_id
        }
      ).sort({ updatedAt: -1 })
        .toArray(function (err, profiles) {
          profiles.length == 0 ? cb(false) : cb(true);
          if (err) { console.log(JSON.stringify(err)); }
        });
    };

    // Return products data
    const getProducts = function (req, cb) {
      // Use docs manager
      self.apos.docs.getManager('ncc-product').find(req,
        {
          _id: { $in: req.session.cart }
        }
      ).toArray(function (err, products) {
        products.length == 0 ? cb(false) : cb(products);
        if (err) { console.log(JSON.stringify(err)); }
      });
    };

    // Add product to cart
    self.apos.app.post('/cart/add', function (req, res, next) {
      const product_id = req.body.productId;
      const quantity = +req.body.quantity;
      // Return if amount is not a number
      if (isNaN(quantity)) {
        res.json(false);
        return;
      }
      if (req.session.cart) {
        findProduct(req, product_id, function (found) {
          if (found) {
            checkCart(req, product_id, true, quantity, function () {
              res.json(true);
            });
          } else {
            res.json(true);
          }
        });
      } else {
        req.session.cart = new Array();
        req.session.cartTotals = new Array();
        findProduct(req, product_id, function (found) {
          if (found) {
            checkCart(req, product_id, true, quantity, function () {
              res.json(true);
            });
          } else {
            res.json(true);
          }
        });
      }
    });

    // Delete product from cart
    self.apos.app.post('/cart/delete', function (req, res, next) {
      // Get product id
      const product_id = req.body.productId;
      if (req.session.cart) {
        findProduct(req, product_id, function (found) {
          if (found) {
            checkCart(req, product_id, false, 0, function () {
              res.json(true);
            });
          }
        });
      } else {
        req.session.cart = new Array();
        req.session.cartTotals = new Array();
        res.json(true);
      }
    });

    // Clear cart
    self.apos.app.get('/cart/clear', function (req, res, next) {
      if (req.session.cart) {
        delete req.session.cart;
        delete req.session.cartTotals;
      }
      res.redirect('back');
    });

    // Returns cart for checkout
    self.apos.app.get('/cart', function (req, res, next) {
      if (req.session.cart == null || req.session.cart.length == 0) {
        //Set data to something to show empty
        return self.sendPage(req, self.renderer('cart'));
      } else {
        getProducts(req, function (products) {
          products.reverse();
          const cart = [], items = [];
          let total = 0;
          for (var i = 0; i < products.length; i++) {
            cart.push({ product_id: req.session.cart[i], product_data: products[i], quantity: req.session.cartTotals[i] });
            total += +products[i].total * req.session.cartTotals[i];
          }
          const pay = {
            total
          };
          req.session.cart.pay = pay;
          req.session.cart.items = items;
          return self.sendPage(req, self.renderer('cart'), { ...req.data, cart, pay });

        });
      }
    });
  }
};
