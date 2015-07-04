# VendorUp
**The vendor assets manager**

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url]

## Sample `vendorfile.js`

```js
var vendorup = require('vendorup');

vendorup('jquery')
  .has('version', '2.1.4')
  .src('https://cdnjs.cloudflare.com/ajax/libs/jquery/<%= this.version %>/jquery.min.js')
  .provides('jquery.min.js').withCDN([
    '//cdnjs.cloudflare.com/ajax/libs/jquery/<%= this.version %>/jquery.min.js',
    '//code.jquery.com/jquery-<%= this.version %>.min.js',
    '//g.4gwz.com/libs/jquery/jquery-<%= this.version %>.min.js',
    '//ajax.googleapis.com/ajax/libs/jquery/<%= this.version %>/jquery.min.js'
  ]);

vendorup('jquery-ui')
  .depends('jquery')
  .has('version', '1.11.4')
  .src('https://cdnjs.cloudflare.com/ajax/libs/jqueryui/<%= this.version %>/jquery-ui.min.js')
  .provides('jquery-ui.min.js').withCDN([
    '//cdnjs.cloudflare.com/ajax/libs/jqueryui/<%= this.version %>/jquery-ui.min.js',
    '//code.jquery.com/ui/<%= this.version %>/jquery-ui.min.js',
    '//ajax.googleapis.com/ajax/libs/jqueryui/<%= this.version %>/jquery-ui.min.js'
  ]);
```

[downloads-image]: http://img.shields.io/npm/dm/vendorup.svg
[npm-url]: https://npmjs.org/package/vendorup
[npm-image]: http://img.shields.io/npm/v/vendorup.svg

[travis-url]: https://travis-ci.org/rixtox/vendorup
[travis-image]: http://img.shields.io/travis/rixtox/vendorup.svg

[coveralls-url]: https://coveralls.io/r/rixtox/vendorup
[coveralls-image]: http://img.shields.io/coveralls/rixtox/vendorup/master.svg