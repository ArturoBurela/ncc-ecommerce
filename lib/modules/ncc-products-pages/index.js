module.exports = {
  name: 'ncc-products-pages',
  piecesModuleName: 'ncc-product',
  label: 'Product Page',
  extend: 'apostrophe-pieces-pages',
  piecesFilters: [
    {
      name: 'tags'
    },
    {
      name: 'nccsubcategories'
    },
  ],

  construct: function(self, options) {
  }
};
