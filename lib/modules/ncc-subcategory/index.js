module.exports = {
  extend: 'apostrophe-pieces',
  name: 'ncc-subcategory',
  label: 'Product SubCategory',
  pluralLabel: 'Product SubCategories',
  addFields: [
    {
      name: 'title',
      label: 'Name',
      type: 'string',
      required: true
    }
  ],
  construct: function(self, options) {
  }
};
