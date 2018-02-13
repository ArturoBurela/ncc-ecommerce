module.exports = {
  name: 'ncc-cart',
  alias: 'Cart',
  label: 'Cart',
  extends: 'apostrophe-module',

  beforeConstruct: function(self, options) {
    // Insert code here
  },

  construct: function(self, options) {


    // Save product to cart
    self.apos.app.get('/addtocart/:id', function(req, res, next) {
      // Get product id
      var product_id = req.params.id;
      if (req.session.cart) {
        if (product_id) {
          req.session.cart.push(product_id);
        }
        res.end();
      } else {
        req.session.cart = new Array();
        if (product_id) {
          req.session.cart.push(product_id);
        }
        res.end();
      }
    });

    // Delete product from cart
    self.apos.app.get('/deletefromcart/:id', function(req, res, next) {
      // Get product id
      var product_id = req.params.id;
      var index = array.indexOf(product_id);
      if (req.session.cart) {
        req.session.cart.splice(index, 1);
        res.end();
      } else {
        req.session.cart = new Array();
        req.session.cart.push(product_id);
        res.end();
      }
    });

    // Clear cart
    self.apos.app.get('/clearcart', function(req, res, next) {
      if (req.session.cart) {
        req.session.cart.splice(0,req.session.cart.length);
      }
      res.end();
    });
  }
};
