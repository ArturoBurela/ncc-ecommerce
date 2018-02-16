module.exports = {
  extend: 'apostrophe-pieces',
  name: 'ncc-product',
  label: 'Product',
  pluralLabel: 'Products',
  addFields: [
    {
      name: 'title',
      label: 'Name',
      type: 'string',
      required: true
    },
    {
      name: 'brand',
      label: 'Brand',
      type: 'string',
      required: true
    },
    {
      name: 'description',
      label: 'Description',
      type: 'area',
      required: true,
      options: {
        widgets: {
          'apostrophe-rich-text': {
            toolbar: [ 'Bold', 'Italic', 'Link', 'Unlink' ]
          }
        }
      }
    },
    {
      name: 'serial',
      label: 'Serial number',
      type: 'integer',
      required: true
    },
    {
      name: 'price',
      label: 'Price',
      type: 'float',
      required: true
    },
    {
      name: 'discount',
      label: 'Discount %',
      type: 'integer',
      required: false
    },
    {
      name: 'total',
      label: 'Total',
      type: 'float',
      required: false,
      contextual: true
    },
    {
      name: 'image',
      label: 'Image',
      type: 'singleton',
      required: false,
      widgetType: 'apostrophe-images',
      options: {
        limit: 1,
        minSize: [ 200, 200 ],
        aspectRatio: [ 1, 1 ]
      }
    },
    {
      name: 'pdfs',
      label: 'Files',
      type: 'singleton',
      widgetType: 'apostrophe-files',
      options: {
        limit:3,
        extensions: [ 'pdf' ],
        extensionMaps: {},
        image: false
      },
      required: false
    },
    {
      name: '_subcategories',
      // Must match the `name` option given when configuring `fabric` as a subclass of pieces.
      // You could skip this since the name of the join matches the name of the other type.
      withType: 'ncc-subcategory',
      type: 'joinByOne',
      filters: {
        // Fetch just enough information
        projection: {
          title: 1,
          slug: 1,
          type: 1,
          tags: 1
        }
      }
    }
  ],
  construct: function(self, options) {
    self.beforeSave = function(req, piece, options, callback) {
      // Calculate total
      piece.total = piece.discount ? piece.price * (1 - (piece.discount/100))  : piece.price;
      return callback();
    };
  }
};
