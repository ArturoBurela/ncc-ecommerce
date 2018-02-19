module.exports = {
  name: 'ncc-ecommerce-page',
  label: 'Ecommerce Page',
  extend: 'apostrophe-custom-pages',
  construct: function(self, options) {
    self.apos.app.use('/carrito', function (req, res, next) {
      console.log(JSON.stringify(req.data.page));
      console.log('Request Type:', req.method);
      if (req.session.cart == null){
        //Set data to something to show empty
        console.log('Cart is empty');
      } else {
        //Set cart to data
        console.log(req.session.cart);
      }
      next();
    });
    // Helper to display all products in cart
    self.addHelpers({
      clap: function(s) {
        // Replace spaces with claps
        return s.replace(/ /g, '👏');
      }
    });

  }
};
