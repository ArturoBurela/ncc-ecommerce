module.exports = {
  extend: 'apostrophe-pieces',
  name: 'ncc-category',
  label: 'Category',
  pluralLabel: 'Categories',
  contextual: true,
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
