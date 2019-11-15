# nnc-ecommerce

This bundle provides e-commerce functionality within [Apostrophe CMS](http://apostrophecms.org).

### Features

- manage products, categories and subcategories
- manage orders
- subscriptions
- cart with paypal smart button for checkout
- single and multiple email
- shippings
- taxes
- pos
- rating and reviews for product
- menu and products' list widget
- easy multilanguage

### Prerequisites

A working Apostrophe CMS project.

### Use and Configuration

- Declare and configure modules (this configuration is for all modules, you can choose which module you want)
**NOTE** Modules' order is important, for example modules that use mail must be added after nodemailer definition

```javascript
// in app.js
// We must declare the bundle!
bundles: [ 'ncc-ecommerce' ],
modules: {
  // Other modules
  // .....

  // ecommerce
  'apostrophe-admin-bar': {
    addGroups: [
      {
        label: 'Ecommerce',
        items: [
          'ncc-category',
          'ncc-subcategory',
          'ncc-product',
          'ncc-orders',
          'ncc-shippings',
        ]
      },
    ]
  },
  'ncc-global': {},
  'ncc-category': {},
  'ncc-subcategory': {},
  'ncc-product': {},
  'ncc-products-pages': {},
  'ncc-shippings': {},
  'ncc-cart': {},
  'ncc-pos': {},
  'apostrophe-email': {
    nodemailer: {
      sendmail: true,
      newline: 'unix',
      path: '/usr/sbin/sendmail'
    }
  },
  'ncc-orders': {},
  'ncc-emails': {},
  'apostrophe-pages': {
    // We must list `ncc-ecommerce-page` as one of the available page types
    types: [
      {
        name: 'ncc-products-pages',
        label: 'Product'
      },
      {
        name: 'default',
        label: 'Default'
      },
      {
        name: 'home',
        label: 'Home'
      }
    ]
  },
}
```

- As admin set globals varialbes

### Subscriptions
Ther are special products, in combinations you can define subscription information, then set the product's subscription field as true.
Run the script for expired checks as cron ....

### Additional routes for user menu

- `/orders`: get all orders for the logged user
- `/products`: product list

### Add subcategory menu widget

In your `app.js`, after `ncc-subcategory`, add:
```
  'ncc-subcategory-widgets': {},
```
Then, in views/layout.html, or where you want:
```
  {# Ecommerce subcategory menu #}
  {{ apos.area(data.page, 'category', {
    widgets: {
      'ncc-subcategory': {}
    }
  }) }}
```
**NOTE**: After this you must add a page with `Product` template

### Add product widget

In your `app.js`, after `ncc-product`, add:

```javascript
  'ncc-product-widget': {},
```

Then, in home.html, or where you want:

```javascript
  {# Ecommerce products list #}
  {{ apos.area(data.page, 'products-list', {
    widgets: {
      'ncc-product': {}
    }
  }) }}
```

### Multiple language

In you `app.js` add:

```javascript
  'apostrophe-i18n':{
    locales: ['it', 'en'],
    defaultLocale: 'it',
    queryParameter: 'lang',
    cookie: 'ncc-ecommerce',
  },
  'ncc-misc': {},
```

Copy the json in `locales` directory in this project, into `locales` in your project root directory. Thanks to misc module there's a route `/lang/:selected` used to change language, for example with: `/lang/en` that you can use in your template.

Docs: https://docs.apostrophecms.org/apostrophe/advanced-topics/apostrophe-i18n-config


### Emails

You can send an email from pieces, or use the method to send mail where you want. It's used nodemailer, so you can configure it how you want, for example with [ses]( https://nodemailer.com/transports/ses/). For tests you can use [Maildev](https://github.com/djfarrelly/MailDev) with this config:

```javascript
  'apostrophe-email': {
    nodemailer: {
      host: 'localhost',
      port: 1025,
      secure: false,
      tls: {
        rejectUnauthorized: false
      }
    }
  },

```

### Use Paypal
With [Paypal smart button](https://developer.paypal.com/docs/checkout/)

```javascript
// in app.js add the module
  'ncc-paypal': {
    mode: process.env.PAYPAL_MODE, // sandbox or live
    secret: process.env.PAYPAL_SECRET,
    clientID: process.env.PAYPAL_CLIENTID,
  },
```

You must export the variable in your env, example:

```bash
export PAYPAL_MODE=sandbox
export PAYPAL_SECRET=MYSECRET
export PAYPAL_CLIENTID=MYCLIENTID
```

Then configure script location as `Global` variable.

### Disable selling

If you want disable selling from cart (for example if you want a showcase), you must remove from app.js the modules: `ncc-paypal` and `ncc-cart` and remove from `lib/modules/ncc-products-pages/views/show.html` the `Add to cart` button.

### Useful

- User signup: https://github.com/apostrophecms/apostrophe-signup
- Manage users: https://apostrophecms.org/docs/tutorials/intermediate/permissions.html

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/ArturoBurela/ncc-ecommerce/tags).

## Authors

* **Arturo Burela** - *Initial work* - [NoteCode Company](http://notecode.mx/)
* **Andrea Di Mario** - *Main Developer* - [Github Profile](https://github.com/anddimario)

See also the list of [contributors](https://github.com/ArturoBurela/ncc-ecommerce/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
