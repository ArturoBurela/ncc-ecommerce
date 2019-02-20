module.exports = {
  extend: 'apostrophe-module',
  name: 'ncc-orders',
  label: 'Orders Module',

  beforeConstruct: function (self, options) {
    // Insert code here
  },

  construct: function (self, options) {
    self.apos.adminBar.add(self.__meta.name, 'Orders', null, {
      href: '/orders'
    });

    self.apos.app.get('/orders', function (req, res) {
      const find = {};
      // Not admin users can see only their orders
      if (!req.user._permissions.admin) {
        find.userId = req.user._id;
      }
      self.apos.db.collection('nccorders').find(find).toArray(function(err, orders) {
        if (err) {
          console.log(err);
          req.aposError = err;
        }
        return self.sendPage(req, self.renderer('orders'), { orders });
      });
    });

  }

};
