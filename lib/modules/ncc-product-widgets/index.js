module.exports = {
  extend: 'apostrophe-pieces-widgets',
  piecesModuleName: 'ncc-product',
  filters: {
    projection: {
      slug: 1,
      title: 1,
      image: 1,
      _url: 1,
      tags: 1
    }
  }
};
