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
    self.addProductPayment = function (req, data, callback) {
      console.log("DATA Object:");
      console.log(JSON.stringify(data));
      var piece = self.newInstance();
      piece.title = 'Product Payment';
      piece.quantity = data.quantity;
      piece.price = data.price;
      piece.discount = data.discount;
      piece.total = data.total;
      piece.productId = data.productId;
      return self.insert(req, piece, callback);
    }
  }
};
