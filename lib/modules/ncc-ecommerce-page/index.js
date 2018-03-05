module.exports = {
  name: 'ncc-ecommerce-page',
  label: 'Ecommerce Page',
  extend: 'apostrophe-custom-pages',

  construct: function(self, options) {
    //Push Paypal script assets
    self.pushAsset('script', 'paypal', { when: 'user' });
    self.pushAsset('script', 'cart', { when: 'user' });

    // Creates payment piece
    addPayment = function(req, cb) {
      //Add new Payment
      self.apos.docs.getManager('ncc-payment').addPayment(req, function () {
        console.log("insert done");
      });
    };

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
          let pay = {};
          let total = 0.00;
          let items = [];
          let price = 0;
          for (var p of cart) {
            total += p.product_data.total * p.amount;
            items.push({
              sku: p.product_id,
              name: p.product_data.title,
              description: 'p.product_data.description',
              quantity: p.amount,
              price: p.product_data.total,
              currency: "MXN"
            });
          }
          pay.total = total;
          pay.items = items;
          req.session.pay = pay;
          req.session.cart2 = cart;
          return self.sendPage(req, self.renderer('index'), {cart: cart, title: 'Shopping Cart', pay: pay});
        });
      }
    });

    //Render puschase page
    self.apos.app.get('/purchase', function(req, res) {
      addPayment(req, function (products) {
        console.log(JSON.stringify(products));
      });
      return self.sendPage(req, self.renderer('purchase'), {cart: false, title: 'Purchase Completed'});
    });
  }
};
