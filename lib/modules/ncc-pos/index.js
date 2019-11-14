const Promise = require('bluebird');

module.exports = {
  extend: 'apostrophe-module',
  name: 'ncc-pos',
  label: 'POS Module',

  beforeConstruct: function (self, options) {
    // Insert code here
  },

  construct: function (self, options) {
    self.apos.adminBar.add(self.__meta.name, 'Pos', null, {
      href: '/pos'
    });
    self.pushAsset('script', 'user', { when: 'user' });

    self.apos.app.get('/pos', function (req, res) {
      // TODO: see access permissions  https://apostrophecms.org/docs/tutorials/intermediate/permissions.html
      return self.sendPage(req, self.renderer('pos'), {});
    });

    self.apos.app.get('/pos/search/:q', async function (req, res) {
      try {
        // TODO: see access permissions  https://apostrophecms.org/docs/tutorials/intermediate/permissions.html
        const product = await self.apos.docs.db.findOne({
          allSerials: parseInt(req.params.q),
          type: 'ncc-product'
        });

        return res.json({ product });
      } catch (e) {
        return res.json({ error: e });
      }
    });

    self.apos.app.post('/pos/complete', async function (req, res) {
      try {
        /* TODO: see access permissions  https://apostrophecms.org/docs/tutorials/intermediate/permissions.html or
         *       if (!req.user._permissions.admin) {
          find.userId = req.user._id;
        } */
        const info = {
          method: 'pos',
          extras: req.body.paymentType,
          discount: req.body.discount
        };
        await self.apos.docs.getManager('ncc-orders').addOrder(req, info);
        return res.json({ success: true });

      } catch (e) {
        console.log(e);
        return res.json({ error: e });
      }
    });

  }

};
