module.exports = {
  name: 'ncc-ecommerce-page',
  label: 'Ecommerce Page',
  extend: 'apostrophe-custom-pages',

  construct: function(self, options) {

    // Return products data
    getProducts = function(req, cb) {
      // Use docs manager
      self.apos.docs.getManager('ncc-product').find(req,
        {
          _id: {$in:req.session.cart}
        }
      ).toArray(function(err, products) {
        products.length == 0 ? cb(false) : cb(products);
        if (err) console.log(JSON.stringify(err));
      });
    };

    // Render cart page
    self.apos.app.get('/cart', function(req, res) {

      self.apos.docs.getManager('ncc-product').find(req,
        {

        }
      ).toArray(function(err, profiles) {
        console.log(JSON.stringify(profiles));
        if (err) console.log(JSON.stringify(err));
      });

      if (req.session.cart == null){
        //Set data to something to show empty
        console.log('Cart is empty');
        return self.sendPage(req, self.renderer('index'), { perro: req.session.cart});
      } else {
        //Set cart to data
        console.log(req.session.cart);
        getProducts(req, function (products) {
          let cart = [];
          for (var product in products) {
            //cart.push();
          }
          return self.sendPage(req, self.renderer('index'), { quantities: req.session.cartTotals, products: products});
        });
      }
    });
  }
};
