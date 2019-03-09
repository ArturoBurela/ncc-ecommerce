
module.exports = {
  name: 'ncc-ecommerce',
  alias: 'ecommerce',
  label: 'Ecommerce',
  extend: 'apostrophe-module',

  moogBundle: {
    modules: ['ncc-global', 'ncc-product', 'ncc-category', 'ncc-subcategory', 'ncc-subcategory-widgets', 'ncc-products-pages', 'ncc-cart', 'ncc-paypal', 'ncc-orders', 'ncc-pos', 'ncc-emails', 'ncc-shippings'],
    directory: 'lib/modules'
  },

  beforeConstruct: function(self, options) {
    // Insert code here
  },

  construct: function(self, options) {
    // Insert code here
  }
};
