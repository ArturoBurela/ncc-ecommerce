module.exports = {
  label: 'Twitter',
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
    if (false){//1!options.consumerKey) {
      console.error('WARNING: you must configure the consumerKey, consumerSecret, accessToken and accessTokenSecret options to use the Twitter widget.');
    }
    self.getSum = function() {
      return options.num1 + options.num2;
    };
  }
};
