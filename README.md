# nnc-ecommerce

This bundle provides e-commerce functionality within [Apostrophe CMS](http://apostrophenow.org).

The bundle consists of three modules:

* `ncc-ecommerce`
* `ncc-ecommerce-pages`
* `ncc-ecommerce-widgets`

The `ncc-ecommerce` module provides the ability to create and edit products.

The `ncc-ecommerce-pages` module displays products on a page.

The `ncc-ecommerce-widgets` module provides an `apostrophe-blog` widget, which you can use to make products appear anywhere on your site.

### Prerequisites

A working Apostrophe CMS project.
Install apostrophe-headless (for pos): `npm install apostrophe-headless`

### Use and Configuration

Declare and configure modules

```
// in app.js
// We must declare the bundle!
bundles: [ 'ncc-ecommerce' ],
modules: {
  // Other modules
  // .....

  // ecommerce
  'apostrophe-headless': {},
  'apostrophe-admin-bar': {
    addGroups: [
      {
        label: 'Products',
        items: [
          'ncc-category',
          'ncc-subcategory',
          'ncc-product',
        ]
      }
    ]
  },
  'ncc-global': {},
  'ncc-category': {},
  'ncc-subcategory': {},
  'ncc-subcategory-widgets': {},
  'ncc-product': {},
  'ncc-products-pages': {},
  'ncc-cart': {},
  'ncc-orders': {},
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
  }

}
```

### Add subcategory menu widget
```
// in home.html, or where you want
  {# Ecommerce subcategory menu #}
  {{ apos.area(data.page, 'category', {
    widgets: {
      'ncc-subcategory': {}
    }
  }) }}
```

### Use Paypal
```
// in app.js add the module
  'ncc-paypal': {
    mode: process.env.PAYPAL_MODE, // sandbox or live
    secret: process.env.PAYPAL_SECRET,
    clientID: process.env.PAYPAL_CLIENTID,
  },
```
You must export the variable in your env, example:
```
export PAYPAL_MODE=sandbox
export PAYPAL_SECRET=MYSECRET
export PAYPAL_CLIENTID=MYCLIENTID
```

### Edit Globals
As admin set globals varialbes

### User signup
https://github.com/apostrophecms/apostrophe-signup

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/ArturoBurela/ncc-ecommerce/tags).

## Authors

* **Arturo Burela** - *Initial work* - [NoteCode Company](http://notecode.mx/)
* **Andrea Di Mario** - *Contributor* - [Github Profile](https://github.com/anddimario)

See also the list of [contributors](https://github.com/ArturoBurela/ncc-ecommerce/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
