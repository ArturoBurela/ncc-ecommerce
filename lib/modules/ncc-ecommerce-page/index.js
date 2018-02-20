module.exports = {
  name: 'ncc-ecommerce-page',
  label: 'Ecommerce Page',
  extend: 'apostrophe-custom-pages',

  construct: function(self, options) {

    /*self.apos.app.use('/carrito', function (req, res, next) {
      console.log(JSON.stringify(req.data.page));
      console.log('Request Type:', req.method);
      if (req.session.cart == null){
        //Set data to something to show empty
        console.log('Cart is empty');
        res.send({})
      } else {
        //Set cart to data
        console.log(req.session.cart);
      }
      next();
    });*/

    // Render cart page
    self.apos.app.get('/cart', function(req, res) {
      // Get some data first, then...
      let i = "El edgar me la pela";
      if (req.session.cart == null){
        req.session.cart = new Array();
        //Set data to something to show empty
        console.log('Cart is empty');
        return self.sendPage(req, self.renderer('index'), { perro: i});
      } else {
        //Set cart to data
        console.log(req.session.cart);
        return self.sendPage(req, self.renderer('index'), { perro: i});
      }
    });
  }
};
