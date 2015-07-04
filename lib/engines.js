var $ = require('shelljs');
var path = require('path');

var escapePath = function(p) {
  return '"' + p.replace(/"/g, '\\"') + '"';
};

var Engines = function() {
  var git = function(uri, base, options) {
    if (!$.which('git')) {
      throw new Error('git is required');
    }
    $.exec('git clone --depth=1 ' + escapePath(uri) + ' ' + escapePath(base));
  };
  var npm = function(uri, base, options) {
    uri = uri.replace(/^npm:\/\//, '');
    if (!$.which('npm')) {
      throw new Error('npm is required');
    }
    var cache = path.join(base, '.cache');
    $.mkdir('-p', cache);
    $.cd(cache);
    $.exec('npm install ' + uri);
    $.mv(path.join(cache, 'node_modules/' + uri + '/*'),
         path.join(cache, 'node_modules/' + uri + '/.*'), base);
    $.rm('-rf', cache);
  };
  var http = function(uri, base, options) {
    if (!$.which('curl')) {
      throw new Error('curl is required');
    }
    $.cd(base);
    $.exec('curl -L -J '
      + (options.filename ? '-o ' + options.filename : '-O')
      + ' ' + escapePath(uri));
  };
  var bower = function(uri, base, options) {
    uri = uri.replace(/^bower:\/\//, '');
    if (!$.which('bower')) {
      throw new Error('bower is required');
    }
    $.cd(base);
    $.exec('bower install ' + uri);
    $.mv(path.join(base, 'bower_components/' + uri + '/*'),
         path.join(base, 'bower_components/' + uri + '/.*'), base);
    $.rm('-rf', path.join(base, 'bower_components'));
  };
  return {
    git: git,
    npm: npm,
    http: http,
    https: http,
    bower: bower
  };
};

module.exports = Engines;
