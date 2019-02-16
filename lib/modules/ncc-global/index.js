module.exports = {
  improve: 'apostrophe-global',
  addFields: [
    {
      type: 'string',
      name: 'paypalClientUrl',
      label: 'Paypal client Id, ex sandbox: https://www.sandbox.paypal.com/sdk/js?client-id=sb'
    },
    {
      type: 'string',
      name: 'currencyPaypal',
      label: 'Paypal currency (like USD etc)',
      def: 'EUR'
    },
    {
      type: 'select',
      name: 'currency',
      label: 'Currency',
      choices: [
        {
          label: '€',
          value: '€',
        },
        {
          label: '$',
          value: '$'
        },
        {
          label: '£',
          value: '£'
        }
      ],
      def: '€',
      required: true
    },

  ]
};
