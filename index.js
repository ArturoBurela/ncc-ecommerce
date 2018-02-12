
module.exports = {
  name: 'ncc-ecommerce',
  alias: 'ecommerce',
  label: 'Ecommerce',
  extend: 'apostrophe-module',

  moogBundle: {
    modules: ['ncc-ecommerce-pages', 'ncc-ecommerce-widgets', 'ncc-product', 'ncc-products-pages'],
    directory: 'lib/modules'
  },

  beforeConstruct: function(self, options) {
    // Insert code here
  },

  construct: function(self, options) {
    // Insert code here
  }
};
