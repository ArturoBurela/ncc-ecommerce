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
            toolbar: ['Bold', 'Italic', 'Link', 'Unlink']
          }
        }
      }
    },
    {
      name: 'combinations',
      label: 'Combinations',
      type: 'array',
      titleField: 'name',
      schema: [
        {
          type: 'string',
          name: 'name',
          label: 'Name'
        },
        {
          type: 'integer',
          name: 'quantity',
          label: 'Quantity'
        },
        {
          name: 'serial',
          label: 'Serial number',
          type: 'integer'
        }
      ],
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
      name: 'vat',
      label: 'VAT/Taxes % that overwrite global setting',
      type: 'integer',
      required: false
    },
    {
      name: 'total',
      label: 'Total price',
      type: 'float',
      required: true,
      contextual: true
    },
    {
      name: '_products',
      label: 'Products (for packages)',
      withType: 'ncc-product',
      type: 'joinByArray',
      idsField: 'productId',
      filters: {
        projection: {
          title: 1,
          slug: 1,
          combinations: 1
        }
      }
    },
    {
      name: 'image',
      label: 'Image',
      type: 'singleton',
      required: true,
      widgetType: 'apostrophe-images',
      options: {
        limit: 1,
        minSize: [200, 200],
        aspectRatio: [1, 1]
      }
    },
    {
      name: 'files',
      label: 'Files',
      type: 'singleton',
      widgetType: 'apostrophe-files',
      options: {
        limit: 3,
        extensions: ['pdf'],
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
  arrangeFields: [
    {
      name: 'info',
      label: 'Info',
      fields: ['description', 'brand', '_products', '_nccsubcategories']
    },
    {
      name: 'stock',
      label: 'Stock',
      fields: ['combinations', 'price', 'discount', 'total', 'vat']
    },
    {
      name: 'upload',
      label: 'Uploads',
      fields: ['files', 'image']
    }
  ],
  addFilters: [
    {
      name: 'tags',
      label: 'Tags'
    },
    {
      name: 'nccsubcategories',
      label: 'Subcategories'
    }
  ],
  construct: function (self, options) {
    // use always to show on all pages, if user, only if it's logged user
    self.pushAsset('stylesheet', 'skeleton', { when: 'always' });

    self.beforeSave = function (req, piece, options, callback) {
      // Check if products in package have the right quantity
      if (piece.productId && piece._products) {
        for (const product of piece._products) {
          // Get all combinations quantity
          let actual = 0;
          let connected = 0;
          for (const combination of product.combinations) {
            connected += combination.quantity;
          }
          for (const combination of piece.combinations) {
            actual += combination.quantity;
          }
          if (actual < connected) {
            return callback(`Error quantity for ${product.title}`);
          }
        }
      }
      piece.allSerials = [];
      // Create a field with serials for search
      for (const combination of piece.combinations) {
        piece.allSerials.push(combination.serial);
      }

      // Round price up to 2 digits
      piece.price = Number(piece.price).toFixed(2);
      // Add global or product vat
      if (piece.vat) {
        piece.price = piece.price * (1 + (piece.vat / 100));
      } else if (req.data.global.shopVat) {
        piece.price = piece.price * (1 + (req.data.global.shopVat / 100));
      }

      // Calculate total with discount
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
        }, { rating: 1, ratedUser: 1 }).toArray((err, product) => {
        if (err) {
          return res.json(false);
        }
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
