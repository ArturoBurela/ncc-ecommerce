module.exports = {
  name: 'ncc-cart',
  alias: 'Cart',
  label: 'Cart',
  extends: 'apostrophe-module',

  beforeConstruct: function(self, options) {
    // Insert code here
  },

  construct: function(self, options) {

    //set cart to empty values
    resetCart = function (req, cb) {
      req.session.okCart = {
        items: [],
        subtotal: 0,
        discounts: 0,
        total: 0,
      };
      cb();
    };

    //checks if cart is set
    setCart = function (req, cb) {
      if (!req.session.okCart) {
        resetCart(function () {
          cb();
        });
      } else {
        cb();
      }
    };

    //Add or delete a product, calculates totals
    updateCart = function (req, op, product, amount, cb) {
      // Get index of product in cart
      let i = req.session.okCart.items.map(function(e) { return e.product_id; }).indexOf(product._id);
      // If product in cart
      if (i > -1) {
        if(add){
          req.session.okCart.items.push({
            product_id: product_id,
            amount: amount
          });
        } else {
          req.session.cart.splice(i, 1);
          req.session.cartTotals.splice(i, 1);
        }
        //If not in cart but we want to add
      } else if (add) {
        req.session.cart.push(product_id);
        req.session.cartTotals.push(amount);
      }
      cb();
    };

    // Logs cart content
    logCart = function(req, cb){
      console.log(JSON.stringify(req.session.cart));
      console.log(JSON.stringify(req.session.cartTotals));
      cb();
    };

    // Logs all producst, useful for dev
    logProducts = function(req, cb) {
      // Use docs manager
      self.apos.docs.getManager('ncc-product').find(req,
        {
        }
      ).sort({ updatedAt: -1 })
      .toArray(function(err, products) {
        console.log(JSON.stringify(products));
        cb();
        if (err) console.log(JSON.stringify(err));
      });
    };

    // Manages cart quantities
    checkCart = function(req, product_id, add, amount, cb) {
      let i = req.session.cart.indexOf(product_id);
      // Element in cart
      if (i > -1) {
        if(add){
          req.session.cartTotals[i] += amount;
        } else {
          req.session.cart.splice(i, 1);
          req.session.cartTotals.splice(i, 1);
        }
        //If not in cart but we want to add
      } else if (add) {
        req.session.cart.push(product_id);
        req.session.cartTotals.push(amount);
      }
      cb();
    };

    // Updates payment object, amount, etc.
    self.updatePayment = function(req, cb) {
      if (req.session.cart == null || req.session.cart.length == 0){
        cb();
      } else {
        getProducts(req, function (products) {
          if (products) {
            products.reverse();
            let cart = [];
            for (var i = 0; i < products.length; i++) {
              cart.push({product_id: req.session.cart[i], product_data: products[i], amount: req.session.cartTotals[i]});
            }
            let pay = {};
            let total = 0.00;
            let items = [];
            let price = 0;
            for (var p of cart) {
              total += p.product_data.total * p.amount;
              items.push({
                sku: p.product_id,
                name: p.product_data.title,
                description: 'p.product_data.description',
                quantity: p.amount,
                price: p.product_data.total,
                currency: "MXN"
              });
            }
            pay.total = total;
            pay.items = items;
            req.session.pay = pay;
            req.session.items = items;
            req.session.cart2 = cart;
          }
          cb();
        });
      }
    }

    //Process Payment
    self.processPayment = function(req, cb) {
      // Create new payment-product pieces
      self.apos.docs.getManager('ncc-product-payment').addProductPayment(req, function (productsPayments) {
        // Create new payment and link payment-products
        self.apos.docs.getManager('ncc-payment').addPayment(req, function (payment, toher) {
          delete req.session.cart;
          delete req.session.cartTotals;
          delete req.session.pay;
          delete req.session.items;
          delete req.session.cart2;
          delete req.session.total;
          console.log("Payment done");
          cb();
        });
      });
    }

    // Returns true or false if product is found by id
    findProduct = function(req, product_id, cb) {
      // Use docs manager
      self.apos.docs.getManager('ncc-product').find(req,
        {
          _id: product_id
        }
      ).sort({ updatedAt: -1 })
      .toArray(function(err, profiles) {
        profiles.length == 0 ? cb(false) : cb(true);
        if (err) console.log(JSON.stringify(err));
      });
    };

    // Return products data
    getProducts = function(req, cb) {
      // Use docs manager
      self.apos.docs.getManager('ncc-product').find(req,
        {
          _id: {$in:req.session.cart}
        }
      ).toArray(function(err, products) {
        products.length == 0 ? cb(false) : cb(products);
        if (err) console.log(JSON.stringify(err));
      });
    };

    // Add product to cart
    self.apos.app.post('/addtocart', function(req, res, next) {
      let product_id = req.body.id;
      let amount = req.body.amount;
      // Return if amount is not a number
      if (isNaN(amount)){
        res.json(false);
        return;
      }
      amount = Number(amount);
      if (req.session.cart) {
        findProduct(req, product_id, function (found) {
          if (found) {
            checkCart(req, product_id, true, amount, function () {
              logCart(req, function () {
                res.json(true);
              });
            });
          } else {
            res.json(true);
          }
        });
      } else {
        req.session.cart = new Array();
        req.session.cartTotals = new Array();
        findProduct(req, product_id, function (found) {
          if (found) {
            checkCart(req, product_id, true, amount, function () {
              logCart(req, function () {
                res.json(true);
              });
            });
          } else {
            res.json(true);
          }
        });
      }
    });

    // Delete product from cart
    self.apos.app.post('/deletefromcart', function(req, res, next) {
      // Get product id
      let product_id = req.body.id;
      if (req.session.cart) {
        findProduct(req, product_id, function (found) {
          if (found) {
            checkCart(req, product_id, false, 0, function () {
              logCart(req, function () {
                res.json(true);
              });
            });
          }
        });
      } else {
        req.session.cart = new Array();
        req.session.cartTotals = new Array();
        res.json(true);
      }
    });

    // Clear cart
    self.apos.app.get('/clearcart', function(req, res, next) {
      logProducts(req, function () {
      });
      if (req.session.cart) {
        req.session.cart.splice(0,req.session.cart.length);
        req.session.cartTotals.splice(0,req.session.cartTotals.length);
      }
      res.json(true);
    });

    // Returns cart for checkout
    self.apos.app.get('/getcart', function(req, res, next) {
      if (req.session.cart == null || req.session.cart.length == 0){
        //Set data to something to show empty
        console.log('Cart is empty');
        res.json(false);
      } else {
        getProducts(req, function (products) {
          products.reverse();
          let cart = [];
          for (var i = 0; i < products.length; ++i) {
            cart.push({product_id: req.session.cart[i], product_data: products[i], amount: req.session.cartTotals[i]});
          }
          res.json(req.session.cart ? cart : false);
        });
      }
    });
  }
};
