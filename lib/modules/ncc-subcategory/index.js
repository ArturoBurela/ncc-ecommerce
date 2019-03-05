module.exports = {
  extend: 'apostrophe-pieces',
  name: 'ncc-subcategory',
  label: 'SubCategory',
  pluralLabel: 'SubCategories',
  addFields: [
    {
      name: 'title',
      label: 'Name',
      type: 'string',
      required: true
    },
    {
      name: '_category',
      // Must match the `name` option given when configuring `fabric` as a subclass of pieces.
      // You could skip this since the name of the join matches the name of the other type.
      withType: 'ncc-category',
      type: 'joinByOne',
      filters: {
        // Fetch just enough information
        projection: {
          title: 1,
          slug: 1,
          type: 1,
          tags: 1
        }
      },
      required: true
    }
  ],
  construct: function(self, options) {
  }
};
