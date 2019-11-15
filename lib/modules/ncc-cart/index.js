module.exports = {
  name: 'ncc-cart',
  alias: 'Cart',
  label: 'Cart',
  extend: 'apostrophe-module',

  beforeConstruct: function (self, options) {
    // Insert code here
  },

  construct: function (self, options) {
    self.pushAsset('script', 'user', { when: 'user' });

    // Manages cart quantities
    const checkCart = function (req, productId, add, quantity, serial) {
      const id = `${productId}-${serial}`;
      const i = req.session.cart.indexOf(id);
      // Element in cart
      if (i > -1) {
        if (add) {
          req.session.cartTotals[i] += quantity;
        } else {
          req.session.cart.splice(i, 1);
          req.session.cartTotals.splice(i, 1);
        }
        // If not in cart but we want to add
      } else if (add) {
        req.session.cart.push(id);
        req.session.cartTotals.push(quantity);
      }
    };

    // Returns true or false if product is found by id
    const findProduct = async function (req, productId) {
      // Use docs manager
      const products = await self.apos.docs.getManager('ncc-product').find(req,
        {
          _id: productId
        }
      ).sort({ updatedAt: -1 })
        .toArray();
      return products.length > 0;
    };

    // Return products data
    const getProducts = async function (req) {
      const ids = [];
      for (const id of req.session.cart) {
        ids.push(id.split('-')[0]);
      }
      // Use docs manager
      const products = await self.apos.docs.getManager('ncc-product').find(req,
        {
          _id: { $in: ids }
        }
      ).toArray();
      return products.length === 0 ? false : products;
    };

    // Add product to cart
    self.apos.app.post('/cart/add', function (req, res, next) {
      const productId = req.body.productId;
      const serial = req.body.serial;
      const quantity = +req.body.quantity;
      // Return if amount is not a number
      if (isNaN(quantity)) {
        res.json(false);
        return;
      }
      if (req.session.cart) {
        const found = findProduct(req, productId);
        if (found) {
          checkCart(req, productId, true, quantity, serial);
          res.json(true);
        } else {
          res.json(true);
        }
      } else {
        req.session.cart = [];
        req.session.cartTotals = [];
        const found = findProduct(req, productId);
        if (found) {
          checkCart(req, productId, true, quantity, serial);
          res.json(true);
        } else {
          res.json(true);
        }
      }
    });

    // Delete product from cart
    self.apos.app.post('/cart/delete', async function (req, res, next) {
      // Get product id
      const productId = req.body.productId;
      const serial = req.body.serial;
      if (req.session.cart) {
        const found = await findProduct(req, productId);
        if (found) {
          checkCart(req, productId, false, 0, serial);
          res.json(true);
        }
      } else {
        req.session.cart = [];
        req.session.cartTotals = [];
        res.json(true);
      }
    });

    // Clear cart
    self.apos.app.get('/cart/clear', function (req, res, next) {
      if (req.session.cart) {
        delete req.session.cart;
        delete req.session.cartTotals;
      }
      res.redirect('back');
    });

    // Returns cart for checkout
    self.apos.app.get('/cart', async function (req, res, next) {
      if (req.session.cart == null || req.session.cart.length === 0) {
        // Set data to something to show empty
        return self.sendPage(req, self.renderer('cart'));
      } else {
        const products = await getProducts(req);
        const cart = []; const items = [];
        let total = 0;
        for (var i = 0; i < products.length; i++) {
          const spliitedIds = req.session.cart[i].split('-');
          const serial = parseInt(spliitedIds[1]);
          const productId = spliitedIds[0];
          const value = {
            productId,
            serial,
            quantity: req.session.cartTotals[i],
            price: products[i].price,
            disocunt: products[i].disocunt,
            title: products[i].title,
            _url: products[i]._url,
            total: products[i].total
          };
          // get combination
          for (const combination of products[i].combinations) {
            if (combination.serial === serial) {
              value.combinationName = combination.name;
            }
          }
          cart.push(value);
          total += +products[i].total * req.session.cartTotals[i];
        }
        const pay = {
          total
        };
        req.session.cart.pay = pay;
        req.session.cart.items = items;
        return self.sendPage(req, self.renderer('cart'), { ...req.data, cart, pay });
      }
    });
  }
};
