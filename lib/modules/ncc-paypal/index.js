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
    let accessToken = '';
    let oauthData;
    // Builds paypal payment object
    buildPaymentObject = function() {
      let payment = {};
      return payment;
    }
    // Request options objects
    let accessTokenOptions = {
      method: 'POST',
      url: apiUrl+'oauth2/token',
      headers: {
        'cache-control': 'no-cache',
        authorization: 'Basic ' + base64,
        'content-type': 'application/x-www-form-urlencoded' },
        form: { grant_type: 'client_credentials'}
    };
    let paymentOptions = {
      method: 'POST',
      url: apiUrl+'payments/payment',
      headers:
      {
        'cache-control': 'no-cache',
        authorization: 'Bearer ' + accessToken,
        'content-type': 'application/json'
      },
      body: {
        intent: 'sale',
        payer: { payment_method: 'paypal' },
        transactions:[ { amount:
      { total: '30.11',
      currency: 'USD',
      details:
      { subtotal: '30.00',
      tax: '0.07',
      shipping: '0.03',
      handling_fee: '1.00',
      shipping_discount: '-1.00',
      insurance: '0.01' } },
      description: 'The payment transaction description.',
      custom: 'EBAY_EMS_90048630024435',
      invoice_number: '48787589673',
      soft_descriptor: 'ECHI5786786',
      item_list:
      { items:
        [ { name: 'hat',
        description: 'Brown hat.',
        quantity: '5',
        price: '3',
        tax: '0.01',
        sku: '1',
        currency: 'USD' },
        { name: 'handbag',
        description: 'Black handbag.',
        quantity: '1',
        price: '15',
        tax: '0.02',
        sku: 'product34',
        currency: 'USD' } ],
        shipping_address:
        { recipient_name: 'Brian Robinson',
        line1: '4th Floor',
        line2: 'Unit #34',
        city: 'San Jose',
        country_code: 'US',
        postal_code: '95131',
        phone: '011862212345678',
        state: 'CA' } } } ],
        note_to_payer: 'Contact us for any questions on your order.',
        redirect_urls:
        { return_url: 'https://example.com/return',
        cancel_url: 'https://example.com/cancel' } },
        json: true };
        // Functions
        self.payment = function () {
          request(paymentOptions, function (error, response, body) {
            if (error) throw new Error(error);
            console.log(body);
          });
        }
        self.getAccessToken = function (cb) {
          request(accessTokenOptions, function (error, response, body) {
            if (error) throw new Error(error);
            oauthData = JSON.parse(body);
            accessToken = oauthData.access_token;
            console.log(oauthData);
            cb();
          });
        }
        // Get token when app inits
        self.getAccessToken(function () {
          self.payment();
        });
      }
    };
