var dateFilter = require('nunjucks-date-filter');
module.exports = {
  name: 'ncc-payments-pages',
  piecesModuleName: 'ncc-payment',
  label: 'Payments Pages',
  extend: 'apostrophe-pieces-pages',

  construct: function(self, options) {
    // Add date filter
    self.apos.templates.addFilter(dateFilter);
    // Add filter by default
    var superIndexCursor = self.indexCursor;
    self.indexCursor = function(req) {
      return superIndexCursor(req).own(req.session.passport.user);
    };
  }
};
