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
      type: 'float',
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
      label: 'Discount',
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
    }
  ],
  construct: function(self, options) {
    self.beforeSave = function(req, piece, options, callback) {
      // Calculate total
      piece.total -= piece.price * piece.discount;
      return callback();
    };
  }
};
