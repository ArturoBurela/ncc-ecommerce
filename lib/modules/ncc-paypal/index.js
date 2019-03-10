const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');
const Promise = require('bluebird');

module.exports = {
  extend: 'apostrophe-module',
  name: 'ncc-paypal',
  label: 'Paypal Module',

  beforeConstruct: function (self, options) {
    // Insert code here
  },

  construct: function (self, options) {
    if (!options.clientID || !options.secret || !options.mode) {
      console.error('WARNING: missing clientID, secret or mode in ncc-paypal module config');
    }
    // Paypal variables
    const clientId = options.clientID;
    const clientSecret = options.secret;
    const mode = options.mode;

    let paypalEnv;
    if (mode === 'live') {
      paypalEnv = new checkoutNodeJssdk.core.LiveEnvironment(
        clientId, clientSecret
      );
    } else {
      paypalEnv = new checkoutNodeJssdk.core.SandboxEnvironment(
        clientId, clientSecret
      );
    }

    const client = new checkoutNodeJssdk.core.PayPalHttpClient(paypalEnv);

    self.sendEmailOrder = function(req, info, template, from, to, subject, callback) {
        console.log("ciao");
      return self.email(req, template, { info }, {
          // can also specify from and other
          // valid properties for nodemailer messages here
          to,
          from: from || req.data.global.defaultFromEmail,
          subject
        },
        callback
      );
    };

    self.apos.app.post('/paypal/complete', async function (req, res, next) {
      try {
        const info = {
          method: 'paypal',
          extras: `Paypal payerId: ${req.body.payerID}, orderId: ${req.body.orderID}`
        };
        await self.apos.docs.getManager('ncc-orders').addOrder(req, info);

        const sendEmailOrder = Promise.promisify(self.sendEmailOrder);
        await sendEmailOrder(req, info, 'orderCompleted', options.emailDefaultFrom, req.user.email, 'Order completed');

        // Clear session
        delete req.session.cart;
        delete req.session.cartTotals;

        return res.json({success: true});

      } catch (e) {
        console.log(e);
        return res.json(e);
      }
    });

  }
};
