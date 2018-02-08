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

### Use and Configuration

Declare and configure modules

```
// in app.js
// We must declare the bundle!
bundles: [ 'ncc-ecommerce' ],
modules: {
  'ncc-ecommerce': {},
  'ncc-ecommerce-pages': {},
  'ncc-ecommerce-widgets': {},
  'apostrophe-pages': {
    // We must list `ncc-ecommerce-page` as one of the available page types
    types: [
      {
        name: 'ncc-ecommerce-page',
        label: 'Blog'
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

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/ArturoBurela/ncc-ecommerce/tags).

## Authors

* **Arturo Burela** - *Initial work* - [NoteCode Company](http://notecode.mx/)

See also the list of [contributors](https://github.com/ArturoBurela/ncc-ecommerce/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
