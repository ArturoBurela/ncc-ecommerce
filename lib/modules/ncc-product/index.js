module.exports = {
  extend: 'apostrophe-pieces',
  name: 'product',
  label: 'Producto',
  pluralLabel: 'Productos',
  addFields: [
    {
      name: 'cost',
      label: 'Cost',
      type: 'float',
      required: true
    },
    {
      name: 'available',
      label: 'Available',
      type: 'integer',
      required: true
    },
    {
      name: 'description',
      label: 'Description',
      type: 'area',
      options: {
        widgets: {
          'apostrophe-rich-text': {
            toolbar: [ 'Bold', 'Italic', 'Link', 'Unlink' ]
          },
          'apostrophe-images': {}
        }
      }
    },
    {
      name: 'thumbnail',
      label: 'Thumbnail',
      type: 'singleton',
      widgetType: 'apostrophe-images',
      options: {
        limit: 1,
        minSize: [ 200, 200 ],
        aspectRatio: [ 1, 1 ]
      }
    }
  ]
};
