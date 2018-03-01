module.exports = {
  name: 'ncc-ecommerce-page',
  label: 'Ecommerce Page',
  extend: 'apostrophe-custom-pages',

  construct: function(self, options) {
    //Push Paypal script assets
    self.pushAsset('script', 'paypal', { when: 'user' });
    self.pushAsset('script', 'cart', { when: 'user' });

    // Return products data
    getProducts = function(req, cb) {
      // Use docs manager
      self.apos.docs.getManager('ncc-product').find(req,
        {
          _id: {$in:req.session.cart}
        }
      ).toArray(function(err, products) {
        console.log(JSON.stringify(products));
        products.length == 0 ? cb(false) : cb(products);
        if (err) console.log(JSON.stringify(err));
      });
    };

    // Render cart page
    self.apos.app.get('/cart', function(req, res) {
      if (req.session.cart == null || req.session.cart.length == 0){
        //Set data to something to show empty
        console.log('Cart is empty');
        return self.sendPage(req, self.renderer('index'), { cart: false});
      } else {
        getProducts(req, function (products) {
          products.reverse();
          let cart = [];
          for (var i = 0; i < products.length; i++) {
            cart.push({product_id: req.session.cart[i], product_data: products[i], amount: req.session.cartTotals[i]});
          }
          return self.sendPage(req, self.renderer('index'), {cart: cart, title: 'Shopping Cart'});
        });
      }
    });

    //Render puschase page
    self.apos.app.get('/purchase', function(req, res) {
      getProducts(req, function (products) {
        let cart = [];
        for (var i = 0; i < products.length; i++) {
          cart.push({product_id: req.session.cart[i], product_data: products[i], amount: req.session.cartTotals[i]});
        }
        return self.sendPage(req, self.renderer('purchase'), {cart: cart, title: 'Purchase Completed'});
      });
    });
  }
};
