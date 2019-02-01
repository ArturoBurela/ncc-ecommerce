
module.exports = {
  name: 'ncc-ecommerce',
  alias: 'ecommerce',
  label: 'Ecommerce',
  extend: 'apostrophe-module',

  moogBundle: {
    modules: ['ncc-ecommerce-page', 'ncc-ecommerce-widgets', 'ncc-product', 'ncc-category', 'ncc-subcategory', 'ncc-subcategory-widgets', 'ncc-products-pages', 'ncc-cart', 'ncc-payment', 'ncc-product-payment', 'ncc-payments-pages', 'ncc-paypal'],
    directory: 'lib/modules'
  },

  beforeConstruct: function(self, options) {
    // Insert code here
  },

  construct: function(self, options) {
    // Insert code here
  }
};
