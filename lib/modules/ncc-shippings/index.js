module.exports = {
  extend: 'apostrophe-pieces',
  name: 'ncc-shippings',
  label: 'Shipping',
  pluralLabel: 'Shippings',
  addFields: [
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
      name: 'price',
      label: 'Price',
      type: 'float',
      required: true
    },
  ]
};
