var extend = require('extend');

module.exports = {
  label: 'e-Commerce',
  extend: 'apostrophe-widgets',

  beforeConstruct: function(self, options) {
    options.addFields = [
      {
        type: 'string',
        name: 'account',
        label: 'Twitter Account'
        // required: true
      },
      {
        type: 'string',
        name: 'hashtag',
        label: 'Filter Tweets by Hashtag'
      },
      {
        type: 'integer',
        name: 'limit',
        label: 'Limit Number of Tweets',
        def: 3
      }
    ].concat(options.addFields || []);
  },

  construct: function(self, options) {
    // if (false){//1!options.consumerKey) {
    //   console.error('WARNING: you must configure the consumerKey, consumerSecret, accessToken and accessTokenSecret options to use the Twitter widget.');
    // }

    self.getSum = (num1, num2) => num1 + num2;


    self.logSelf = () => console.log(JSON.stringify(self));
  }
};
