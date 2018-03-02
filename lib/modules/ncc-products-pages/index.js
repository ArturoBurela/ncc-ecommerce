module.exports = {
  name: 'ncc-products-page',
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
