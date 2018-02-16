
module.exports = {
  name: 'ncc-ecommerce',
  alias: 'ecommerce',
  label: 'Ecommerce',
  extend: 'apostrophe-module',

  moogBundle: {
    modules: ['ncc-ecommerce-pages', 'ncc-ecommerce-widgets', 'ncc-product', 'ncc-category', 'ncc-subcategory', 'ncc-products-pages', 'ncc-cart'],
    directory: 'lib/modules'
  },

  beforeConstruct: function(self, options) {
    // Insert code here
  },

  construct: function(self, options) {
    // Insert code here
  }
};
