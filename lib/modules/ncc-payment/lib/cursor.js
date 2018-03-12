module.exports = {
  construct: function(self, options) {
    self.addFilter('own', {
      def: false,
      launder: function(value) {
        return self.apos.launder.string(value);
      },
      safeFor: 'public',
      finalize: function(callback) {
        var userId = self.get('own');
        if (!userId) {
          return setImmediate(callback);
        }
        // Get the request object to pass to `find`
        var req = self.get('req');
        return self.apos.docs.getManager('apostrophe-user').find(req, {
          _id: userId
        }, {
          _id: 1
        }).toObject(function(err, user) {
          if (err) {
            return callback(err);
          }
          self.and({ userId: user._id });
          return callback(null);
        });
      }
    });
  }
};
