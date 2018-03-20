module.exports = {
  name: 'ncc-ecommerce-page',
  label: 'Ecommerce Page',
  extend: 'apostrophe-custom-pages',

  construct: function(self, options) {
    //Push Cart script assets
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
      self.apos.modules['ncc-cart'].updatePayment(req,function () {
        return self.sendPage(req, self.renderer('index'), {cart: req.session.cart2, title: 'Shopping Cart', pay: req.session.pay});
      });
    });

    //Render puschase page
    self.apos.app.get('/purchase', function(req, res) {
      self.apos.modules['ncc-cart'].processPayment(req, function () {
        return self.sendPage(req, self.renderer('purchase'), {cart: false, title: 'Purchase Completed'});
      });
    });

    //
    self.apos.app.get('/paypal-authorized', function(req, res) {
      return self.sendPage(req, self.renderer('paypal-authorized'), {cart: req.session.cart2, title: 'Confirmar compra', pay: req.session.pay});
    });

    self.apos.app.get('/pedidos', function(req, res) {
      self.apos.modules['ncc-payment'].getPayments(req, function (pedidos) {
        return self.sendPage(req, self.renderer('payments'), {title: 'Pedidos', payments: pedidos});
      });
    });

  }
};
