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
    }
  ],
  permissionsFields: false,

  afterConstruct: function(self) {
    self.addRoutes();
  },

  construct: function(self, options) {

    self.addOrder = async function (req, info) {
      try {
        const now = Date.now();
        let productIds = [];
        const piece = self.newInstance();
        switch (info.method) {
          case 'paypal':
            productIds = req.session.cart;
            break;
          case 'pos':
            for (const product in req.body.cart) {
              productIds.push(product);
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
          let cartQuantity;
          if (info.method === 'paypal') {
            cartQuantity = req.session.cartTotals[i];
          }
          if (info.method === 'pos') {
            cartQuantity = req.body.cart[products[i]._id];
          }

          // Check quantity
          const quantityAfter = products[i].quantity - cartQuantity;
          if (quantityAfter < 0) {
            const err = `Product ${products[i].title} quantity problem`;
            throw err;
          }
          totalPay += +products[i].total * cartQuantity;
          items.push({
            productId: products[i]._id,
            quantity: cartQuantity,
            price: products[i].total
          });
        }
        piece.items = items;
        piece.title = `${info.method} - ${now}`;
        piece.amount = totalPay;
        piece.method = info.method;
        piece.userId = req.data.user._id;
        if (info.extras) {
          piece.extras = info.extras;
        }
        await self.insert(req, piece, { permissions: false });
        // Decrease quantity
        await Promise.map(items, (item) => {
          // Access a product from this other module
          return self.apos.docs.db.update({
            _id: item.productId
          }, { $inc: { quantity: -item.quantity } });
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
