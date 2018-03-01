module.exports = {
  construct: function(self, options) {
    self.addFilter('subcategory', {
      def: false,
      launder: function(value) {
        return self.apos.launder.string(value);
      },
      safeFor: 'public',
      finalize: function(callback) {
        var slug = self.get('subcategory');
        if (!slug) {
          return setImmediate(callback);
        }
        // Get the request object to pass to `find`
        var req = self.get('req');
        return self.apos.docs.getManager('ncc-subcategory').find(req, {
          slug: slug
        }, {
          _id: 1
        }).toObject(function(err, nccsubcategory) {
          if (err) {
            return callback(err);
          }
          self.and({ nccsubcategoryId: nccsubcategory._id });
          return callback(null);
        });
      }
    });
  }
};
