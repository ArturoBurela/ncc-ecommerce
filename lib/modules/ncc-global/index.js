module.exports = {
  improve: 'apostrophe-global',
  addFields: [
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
