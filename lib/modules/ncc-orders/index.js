const Promise = require('bluebird');

module.exports = {
  extend: 'apostrophe-pieces',
  name: 'ncc-orders',
  label: 'Order',
  addFields: [
    {
      name: 'method',
      type: 'string',
      label: 'Payment Form',
      required: true
    },
    {
      name: 'amount',
      type: 'float',
      label: 'Amount Paid',
      required: true
    },
    {
      name: 'discount',
      label: 'Discount %',
      type: 'integer',
      required: false
    },
    {
      name: 'items',
      label: 'Items',
      type: 'array',
      schema: [
        {
          name: '_product',
          label: 'Product Id',
          // Must match the `name` option given when configuring `fabric` as a subclass of pieces.
          // You could skip this since the name of the join matches the name of the other type.
          withType: 'ncc-product',
          type: 'joinByOne',
          idField: 'productId',
          filters: {
            // Fetch just enough information
            projection: {
              title: 1,
              slug: 1
            }
          }
        }, {
          name: 'quantity',
          type: 'integer'
        }, {
          name: 'price',
          type: 'float',
          label: 'Price'
        }
      ]
    }, {
      name: '_user',
      label: 'User',
      // Must match the `name` option given when configuring `fabric` as a subclass of pieces.
      // You could skip this since the name of the join matches the name of the other type.
      withType: 'apostrophe-user',
      type: 'joinByOne',
      idField: 'userId',
      filters: {
        // Fetch just enough information
        projection: {
          username: 1,
          title: 1,
          email: 1,
          _url: 1,
          _id: 1
        }
      }
    },
    {
      name: '_shipping',
      label: 'Shipping',
      // Must match the `name` option given when configuring `fabric` as a subclass of pieces.
      // You could skip this since the name of the join matches the name of the other type.
      withType: 'ncc-shippings',
      type: 'joinByOne',
      filters: {
        // Fetch just enough information
        projection: {
          title: 1,
          price: 1,
        }
      }
    },
    {
      name: 'address',
      type: 'string',
      label: 'Shipping Address' // Used for example for paypal info
    },
    {
      name: 'extras',
      type: 'string',
      label: 'Extra informations' // Used for example for paypal info
    },
    {
      name: 'start',
      label: 'Start',
      type: 'date'
    },
    {
      name: 'emd',
      label: 'End',
      type: 'date'
    },
    {
      name: 'status',
      label: 'Subscription status',
      type: 'select',
      choices: [
        {
          label: 'Active',
          value: 'active'
        },
        {
          label: 'Expired',
          value: 'expired'
        }
      ]
    }
  ],
  arrangeFields: [
    {
      name: 'info',
      label: 'Info',
      fields: ['address', 'extras', '_shipping', '_user']
    },
    {
      name: 'payment',
      label: 'Payment',
      fields: ['method', 'amount', 'discount']
    },
    {
      name: 'items',
      label: 'Items',
      fields: ['items']
    },
    {
      name: 'subscription',
      label: 'Subscription',
      fields: ['status', 'start', 'end']
    }
  ],
  permissionsFields: false,

  afterConstruct: function(self) {
    self.addRoutes();
  },

  construct: function(self, options) {
    self.beforeSave = function(req, piece, options, callback) {

      // Calculate total with discount
      piece.amount = piece.discount ? piece.amount * (1 - (piece.discount / 100)) : piece.amount;
      piece.amount = Number(piece.amount).toFixed(2);
      return callback();
    };

    self.addOrder = async function (req, info) {
      try {
        const now = Date.now();
        const productIds = [];
        const serials = [];
        const piece = self.newInstance();
        switch (info.method) {
          case 'paypal': {
            // get product id from cart 
            for (const ids of req.session.cart) {
              const splitted = ids.split('-');
              productIds.push(splitted[0]);
              serials.push(parseInt(splitted[1]));
            }
            break;
          }
          case 'pos':
            for (const ids in req.body.cart) {
              const splitted = ids.split('-');
              productIds.push(splitted[0]);
              serials.push(parseInt(splitted[1]));
            }
            break;
          default:
            throw 'Not allowed method';
        }

        const items = [];
        let totalPay = 0;
        const products = await self.apos.docs.getManager('ncc-product').find(req,
          {
            _id: { $in: productIds }
          }
        ).toArray();
        for (var i = 0; i < products.length; i++) {
          const serial = serials[i];
          let cartQuantity;
          if (info.method === 'paypal') {
            cartQuantity = req.session.cartTotals[i];
          }
          if (info.method === 'pos') {
            cartQuantity = req.body.cart[`${products[i]._id}-${serial}`];
          }

          // Get combination position
          let combinationPosition = 0;
          for (let c = 0; c < products[i].combinations.length; c++) {
            if (products[i].combinations[c].serial === serial) {
              combinationPosition = c;
            }
          }

          // Check quantity
          const quantityAfter = products[i].combinations[combinationPosition].quantity - cartQuantity;
          if (quantityAfter < 0) {
            const err = `Product ${products[i].title} - ${products[i].combinations[combinationPosition].name} quantity problem`;
            throw err;
          }
          console.log(req.body, products[i].total, cartQuantity)
          totalPay += +products[i].total * cartQuantity;
          items.push({
            productId: products[i]._id,
            quantity: cartQuantity,
            price: products[i].total,
            serial
          });
        }
        piece.items = items;
        piece.title = `${info.method} - ${now}`;
        piece.amount = totalPay;
        piece.method = info.method;
        piece.userId = req.data.user._id;
        piece.discount = info.discount ? info.discount : 0;

        // Calculate discount if exists
        piece.amount = piece.discount ? piece.amount * (1 - (piece.discount / 100)) : piece.amount;
        piece.amount = Number(piece.amount).toFixed(2);

        if (info.extras) {
          piece.extras = info.extras;
        }
        await self.insert(req, piece, { permissions: false });
        // Decrease quantity
        await Promise.map(items, (item) => {
          // Access a product from this other module
          return self.apos.docs.db.update({
            _id: item.productId,
            'combinations.serial': item.serial
          }, { $inc: { 'combinations.$.quantity': -item.quantity } });
        });
        return;
      } catch (e) {
        console.log(e);
        throw e;
      }
    };

    self.addRoutes = function() {

      self.apos.app.get('/orders', async function (req, res, next) {
        try {
          // User can see only their orders
          const find = {
            userId: req.user._id
          };
          const orders = await self.find(req, find).toArray();
          return self.sendPage(req, self.renderer('orders'), { orders });
        } catch (e) {
          console.log(e);
          next(e);
        }
      });

    };
  }
};
