module.exports = {
  extend: 'apostrophe-pieces',
  name: 'ncc-product',
  label: 'Product',
  pluralLabel: 'Products',
  restApi: {
    safeFilters: [ 'serial', 'tags' ]
  },
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
      name: 'quantity',
      label: 'Quantity',
      type: 'integer',
      required: true
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
      required: true,
      contextual: true
    },
    {
      name: 'image',
      label: 'Image',
      type: 'singleton',
      required: true,
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
        limit: 3,
        extensions: [ 'pdf' ],
        extensionMaps: {},
        image: false
      },
      required: false
    },
    {
      name: '_nccsubcategories',
      label: 'SubCategories',
      // Must match the `name` option given when configuring `fabric` as a subclass of pieces.
      // You could skip this since the name of the join matches the name of the other type.
      withType: 'ncc-subcategory',
      type: 'joinByArray',
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
  addFilters: [
    {
      name: 'serial',
      label: 'Serial'
    },
    {
      name: 'tags',
      label: 'Tags'
    },
    {
      name: 'nccsubcategories',
      label: 'Subcategories'
    }
  ],
  construct: function(self, options) {
    self.beforeSave = function(req, piece, options, callback) {
      // Round price up to 2 digits
      piece.price = Number(piece.price).toFixed(2);
      // Calculate total
      piece.total = piece.discount ? piece.price * (1 - (piece.discount / 100)) : piece.price;
      piece.total = Number(piece.total).toFixed(2);
      return callback();
    };

    // Add a review
    self.apos.app.post('/products/reviews', function (req, res, next) {
      const productId = req.body.productId;
      const review = {
        text: req.body.review,
        user: req.user.firstName
      };
      self.apos.docs.db.update({
        _id: productId
      }, { $addToSet: { reviews: review } }, (err) => {
        if (err) {
          return res.json(false);
        } else {
          return res.json(true);
        }
      });

    });

    // Add a ratings
    self.apos.app.post('/products/ratings', function (req, res, next) {
      const productId = req.body.productId;
      // Get product
      self.apos.docs.getManager('ncc-product').find(req,
        {
          _id: productId
        }, {rating: 1, ratedUser: 1}).toArray((err, product) => {
        if (err) {
          return res.json(false);
        }
        console.log(product);
        // See if user already add a rating
        if (product[0].ratedUser && product[0].ratedUser.includes(req.user._id)) {
          return res.json(false);
        }
        let rating;
        if (product[0].rating) {
          rating = (product[0].rating + req.body.rating) / 2;
        } else {
          rating = req.body.rating;
        }
        self.apos.docs.db.update({
          _id: productId
        }, { $addToSet: { ratedUser: req.user._id }, $set: { rating } }, (err) => {
          if (err) {
            return res.json(false);
          } else {
            return res.json(true);
          }
        });
      });

    });
  }
};
