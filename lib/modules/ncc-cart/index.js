module.exports = {
  name: 'ncc-cart',
  alias: 'Cart',
  label: 'Cart',
  extends: 'apostrophe-module',

  beforeConstruct: function(self, options) {
    // Insert code here
  },

  construct: function(self, options) {

    // Logs cart content
    logCart = function(req, cb){
      console.log(JSON.stringify(req.session.cart));
      console.log(JSON.stringify(req.session.cartTotals));
      cb();
    };

    // Manages cart quantities
    checkCart = function(req, product_id, add, amount, cb) {
      let i = req.session.cart.indexOf(product_id);
      // Element in cart
      if (i > -1) {
        if(add){
          req.session.cartTotals[i] += amount;
        } else {
          req.session.cartTotals[i] = 0;
        }
        //If not in cart but we want to add
      } else if (add) {
        req.session.cart.push(product_id);
        req.session.cartTotals.push(amount);
      }
      cb();
    };

    // Returns true or false if product is found by id
    findProduct = function(req, product_id, cb) {
      // Use docs manager
      self.apos.docs.getManager('ncc-product').find(req,
        {
          _id: product_id
        }
      ).sort({ updatedAt: -1 })
      .toArray(function(err, profiles) {
        profiles.length == 0 ? cb(false) : cb(true);
        if (err) console.log(JSON.stringify(err));
      });
    };

    // Add product to cart
    self.apos.app.get('/addtocart/:id/:amount', function(req, res, next) {
      let product_id = req.params.id;
      let amount = req.params.amount;
      if (isNaN(amount)){
        res.end();
        return;
      }
      if (req.session.cart) {
        findProduct(req, product_id, function (found) {
          if (found) {
            checkCart(req, product_id, true, amount, function () {
              logCart(req, function () {
                res.end();
              });
            });
          }
        });
      } else {
        req.session.cart = new Array();
        req.session.cartTotals = new Array();
        findProduct(req, product_id, function (found) {
          if (found) {
            checkCart(req, product_id, true, amount, function () {
              logCart(req, function () {
                res.end();
              });
            });
          }
        });
        res.end();
      }
    });

    // Delete product from cart
    self.apos.app.get('/deletefromcart/:id', function(req, res, next) {
      // Get product id
      let product_id = req.params.id;
      if (req.session.cart) {
        findProduct(req, product_id, function (found) {
          if (found) {
            checkCart(req, product_id, false, 0, function () {
              logCart(req, function () {
                res.end();
              });
            });
          }
        });
      } else {
        req.session.cart = new Array();
        req.session.cartTotals = new Array();
        res.end();
      }
    });

    // Clear cart
    self.apos.app.get('/clearcart', function(req, res, next) {
      if (req.session.cart) {
        req.session.cart.splice(0,req.session.cart.length);
        req.session.cartTotals.splice(0,req.session.cartTotals.length);
      }
      res.end();
    });

    // Returns cart for checkout
    self.apos.app.get('/getcart', function(req, res, next) {
      let cart = {
        cart: req.session.cart,
        totals: req.session.cartTotals
      };
      res.json(req.session.cart ? cart : false);
    });
  }
};
