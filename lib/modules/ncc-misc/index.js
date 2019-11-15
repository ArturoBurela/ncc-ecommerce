// Additional features

module.exports = {
  extend: 'apostrophe-module',
  name: 'ncc-misc',
  label: 'Misc utility Module',

  construct: function (self, options) {

    self.apos.app.get('/lang/:selected', async function (req, res, next) {
      res.cookie('ncc-ecommerce', req.params.selected, { maxAge: 900000, httpOnly: true });
      return res.redirect('back');
    });

  }
};
