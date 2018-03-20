let request = require('request');
module.exports = {
  extend: 'apostrophe-module',
  name: 'ncc-paypal',
  label: 'Paypal Module',

  afterConstruct: function(self) {
  },

  construct: function(self, options) {
    if (!options.clientID || !options.secret || !options.apiUrl) {
      console.error('WARNING: missing clientID, secret or apiUrl in ncc-paypal module config');
    }
    // Paypal variables
    let clientID = options.clientID;
    let secret = options.secret;
    let apiUrl = options.apiUrl;
    let base64 = Buffer.from(clientID+':'+secret).toString('base64');
    let oauthData;

    // Builds paypal payment object
    buildPaymentObject = function(req, cb) {
      let payment = {};
      payment.transactions = [];
      payment.transactions[0] = {
        amount: {
          total: req.session.pay.total,
          currency: 'MXN',
        },
        description: 'Pedido de Afer Plomería',
        item_list: {
          items: req.session.items,
          shipping_address: {
            recipient_name: req.user.username,
            line1: req.user.address || 'No address',
            //"line2": "Unit #34",
            city: req.user.city || 'No city',
            country_code: "MX",
            postal_code: req.user.zip || '11320',
            phone: req.user.phone || '+ 52 55 55 07 87 65',
            state: req.user.state || 'No state'
          }
        }
      }
      cb(payment);
    }

    // Request options objects
    let accessTokenOptions = {
      method: 'POST',
      url: apiUrl+'oauth2/token',
      headers: {
        'cache-control': 'no-cache',
        authorization: 'Basic ' + base64,
        'content-type': 'application/x-www-form-urlencoded'
      },
      form: { grant_type: 'client_credentials'}
    };
    let paymentOptions = {
      method: 'POST',
      url: apiUrl+'payments/payment',
      headers:{
        'cache-control': 'no-cache',
        'authorization': 'Bearer A21AAEIE7L-kgr8pCSDl-f4lKuwikT90O8kR-f_KvD8eR5yzHmzxcPpTJiBkkJMgl-Sty5AVA5-47EXSEiO8PAdxtzIbzgi9Q',
        'content-type': 'application/json'
      },
      body: {
        "intent": "sale",
        "payer": {
          "payment_method": "paypal"
        },
        "note_to_payer": "Contact us for any questions on your order.",
        "redirect_urls": {
          "return_url": "http://localhost:3000/paypal-authorized",
          "cancel_url": "http://localhost:3000/cart"
        }
      },
      json: true
    };

    // Functions
    self.payment = function (cart, cb) {
      paymentOptions.body.transactions = cart.transactions;
      console.log(paymentOptions.body);
      request(paymentOptions, function (error, response, body) {
        if (error) throw new Error(error);
        // Request new access_token if 401
        if (response.statusCode == 401) {
          self.getAccessToken(function () {
            self.payment(cart);
          });
        }
        console.log(body);
        cb(body);
      });
    }

    self.getAccessToken = function (cb) {
      request(accessTokenOptions, function (error, response, body) {
        if (error) throw new Error(error);
        oauthData = JSON.parse(body);
        //Update options
        paymentOptions.headers.authorization= 'Bearer ' + oauthData.access_token;
        cb();
      });
    }

    // Add route to process paypal payment
    self.apos.app.get('/purchase-paypal', function(req, res) {
      self.apos.modules['ncc-cart'].updatePayment(req,function () {
        buildPaymentObject(req, function (payment) {
          self.payment(payment, function (p) {
            // Redirect to paypal auth page
            res.redirect(p.links[1].href);
          });
        });
      });
    });

    // Called when paypal payment is done
    self.apos.app.get('/paypal-confirm', function(req, res) {
      res.redirect('/purchase');
    });

    // Get token when app inits
    self.getAccessToken(function () {});
  }
};
