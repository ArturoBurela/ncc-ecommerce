module.exports = {
  extend: 'apostrophe-pieces',
  name: 'ncc-product-payment',
  label: 'Product-Payment',
  pluralLabel: 'ProductPayments',
  addFields: [
    {
        name: 'quantity',
        type: 'integer',
        label: 'Amount Paid',
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
      required: false,
      contextual: true
    },
    {
        name: '_product',
        label: 'Product',
        // Must match the `name` option given when configuring `fabric` as a subclass of pieces.
        // You could skip this since the name of the join matches the name of the other type.
        withType: 'ncc-product',
        idField: 'productId',
        type: 'joinByOne',
        filters: {
            // Fetch just enough information
            projection: {
                title: 1,
                slug: 1
            }
        }
    }
  ],
  construct: function(self, options) {

    function functionName() {

    }

    self.addProductPayment = function (req, callback) {
      let productPaymentsIds = [];
      let piece;
      let i = req.session.pay.items.length;
      req.session.productsPayments = [];
      for (let item of req.session.pay.items) {
        console.log(JSON.stringify(item));
        piece = self.newInstance();
        piece.title = item.name;
        piece.quantity = item.quantity;
        piece.price = item.price;
        piece.discount = item.discount;
        piece.total = item.total;
        piece.productId = item.sku;
        self.insert(req, piece, {permissions: false}, function (err, p) {
          productPaymentsIds.push(p);
          req.session.productsPayments.push(p._id);
          i--;
          // Quick hack, better verify promises
          if (!i) {
            callback(productPaymentsIds);
          }
        });
      }
    }
  }
};
