var path = require('path');
var vendor = require('../');

vendor.base(path.join(__dirname, 'out/assets/vendor'));
vendor.default('base', '<%= name %>/<%= this.version %>');

vendor('jquery')
  .has('version', '2.1.4')
  .src('https://cdnjs.cloudflare.com/ajax/libs/jquery/<%= this.version %>/jquery.min.js')
  .provides('jquery.min.js').withCDN([
    '//cdnjs.cloudflare.com/ajax/libs/jquery/<%= this.version %>/jquery.min.js',
    '//code.jquery.com/jquery-<%= this.version %>.min.js',
    '//g.4gwz.com/libs/jquery/jquery-<%= this.version %>.min.js',
    '//ajax.googleapis.com/ajax/libs/jquery/<%= this.version %>/jquery.min.js'
  ]);

vendor('jquery-ui')
  .depends('jquery')
  .has('version', '1.11.4')
  .src('https://cdnjs.cloudflare.com/ajax/libs/jqueryui/<%= this.version %>/jquery-ui.min.js')
  .provides('jquery-ui.min.js').withCDN([
    '//cdnjs.cloudflare.com/ajax/libs/jqueryui/<%= this.version %>/jquery-ui.min.js',
    '//code.jquery.com/ui/<%= this.version %>/jquery-ui.min.js',
    '//ajax.googleapis.com/ajax/libs/jqueryui/<%= this.version %>/jquery-ui.min.js'
  ]);

vendor('react')
  .has('version', '0.13.3')
  .src('https://cdnjs.cloudflare.com/ajax/libs/react/<%= this.version %>/react.min.js')
  .provides('react.min.js').withCDN([
    '//cdnjs.cloudflare.com/ajax/libs/react/<%= this.version %>/react.min.js'
  ]);

vendor('react-router')
  .depends('react')
  .has('version', '0.13.3')
  .src('https://cdnjs.cloudflare.com/ajax/libs/react-router/<%= this.version %>/ReactRouter.min.js')
  .rename('ReactRouter.min.js', 'react-router.min.js')
  .provides('react-router.min.js').withCDN([
    '//cdnjs.cloudflare.com/ajax/libs/react-router/<%= this.version %>/ReactRouter.min.js',
    '//www.cdnjs.net/ajax/libs/react-router/<%= this.version %>/ReactRouter.min.js'
  ]);

vendor('ckeditor')
  .has('version', '4.5.0')
  .src('git://github.com/ckeditor/ckeditor-releases.git')
  .provides('ckeditor.js').withCDN([
    '//cdn.ckeditor.com/<%= this.version %>/standard/ckeditor.js',
    '//cdnjs.cloudflare.com/ajax/libs/ckeditor/4.4.5/ckeditor.js'
  ]);

vendor.up();
