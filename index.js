
module.exports = {
  name: 'ncc-ecommerce',
  alias: 'ecommerce',
  label: 'Ecommerce',
  extend: 'apostrophe-pieces',

  moogBundle: {
    modules: ['ncc-ecommerce-pages', 'ncc-ecommerce-widgets'],
    directory: 'lib/modules'
  },

  beforeConstruct: function(self, options) {
    // Insert code here
  },

  construct: function(self, options) {
    // Insert code here
    self.ok = function() {
      console.log("OK");
    }
  }
  self.ok2 = function() {
    console.log("OK");
  }
};
