var fs = require('fs');
var path = require('path');
var glob = require('glob');
var $ = require('shelljs');
var Engines = require('./engines');

var inArray = function(item, array) {
  return array.indexOf(item) >= 0;
};

var VendorUp = function() {
  var configs = {
    base: path.join(process.cwd(), 'vendor')
  };
  var vendors = {};
  var defaults = [];

  var vendorup = function(name) {
    var vendor;
    var configs = {
      src: {
        uri: null,
        options: {}
      },
      base: '<%= name %>',
      maps: [],
      meta: {},
      entries: [],
      preScripts: [],
      postScripts: [],
      dependencies: []
    };

    var tmpl = function(str) {
      if (Object.prototype.toString.call(str) !== '[object String]') {
        throw new Error('Expect String');
      }
      var newStr;
      while(true) {
        newStr = str.replace(/<%=(.*?)%>/, function(match, p1) {
          var f = new Function('name', 'vendor', 'configs', 'vendors',
            'return (' + p1 + ');'
          );
          return f.call(configs.meta, name, vendor, configs, vendors);
        });
        if (newStr === str)
          break;
        else str = newStr;
      }
      return newStr;
    };

    vendor = {
      base: function(value) {
        if (arguments.length < 1 || typeof arguments[0] === 'undefined') {
          throw new Error('Expect argument');
        }
        if (Object.prototype.toString.call(value) === '[object String]') {
          configs.base = value;
        } else {
          throw new Error('Expect String');
        }
        return vendor;
      },
      src: function(uri, options) {
        if (arguments.length < 1 || typeof arguments[0] === 'undefined') {
          throw new Error('Expect argument');
        }
        if (Object.prototype.toString.call(uri) === '[object String]') {
          configs.src.uri = uri;
          if (typeof options !== 'undefined'
            && Object.prototype.toString.call(uri) === '[object Object]') {
            for (var key in options) {
              if (options.hasOwnProperty(key)) {
                configs.src.options[key] = options[key];
              }
            }
          }
        } else {
          throw new Error('Expect String');
        }
        return vendor;
      },
      has: function(key, value) {
        if (arguments.length < 1 || typeof arguments[0] === 'undefined') {
          throw new Error('Expect arguments');
        }
        switch (Object.prototype.toString.call(key)) {
          case '[object Object]':
            for (var k in key) {
              if (key.hasOwnProperty(k)) {
                configs.meta[k] = key[k];
              }
            }
            break;
          case '[object String]':
            configs.meta[key] = value;
            break;
          default:
            throw new Error('Invalid arguments type, expect Object or String pair');
        }
        return vendor;
      },
      depends: function() {
        if (arguments.length < 1 || typeof arguments[0] === 'undefined') {
          throw new Error('Expect arguments');
        }
        for (var i = 0; i < arguments.length; i++) {
          var deps = [].concat(arguments[i]);
          for (var j in deps) {
            var dep = deps[j];
            if (configs.dependencies.indexOf(dep) < 0) {
              configs.dependencies.push(dep);
            }
          }
        }
        return vendor;
      },
      provides: function() {
        if (arguments.length < 1 || typeof arguments[0] === 'undefined') {
          throw new Error('Expect arguments');
        }
        for (var i = 0; i < arguments.length; i++) {
          var arg = arguments[i];
          switch (Object.prototype.toString.call(arg)) {
            case '[object Array]':
              for (var j in arg) {
                configs.entries.push({file: arg[j]});
              }
              break;
            case '[object String]':
              configs.entries.push({file: arg});
              break;
            case '[object Object]':
              for (var file in arg) {
                if (arg.hasOwnProperty(file)) {
                  var entry = {};
                  for (var k in arg[file]) {
                    if (arg[file].hasOwnProperty(k)) {
                      entry[k] = arg[file][k];
                    }
                  }
                  configs.entries.push(entry);
                }
              }
              break;
            default:
              throw new Error('Invalid arguments type, expect Object, String or Array');
          }
        }
        return vendor;
      },
      withCDN: function(cdns) {
        if (arguments.length < 1 || typeof arguments[0] === 'undefined') {
          throw new Error('Expect argument');
        }
        if (configs.entries.length < 1) {
          throw new Error('Have not provide any entries yet');
        }
        var entry = configs.entries[configs.entries.length - 1];
        if (!(entry.cdns && Object.prototype.toString.call(entry.cdns) == '[object Array]')) {
          entry.cdns = [];
        }
        for (var i = 0; i < arguments.length; i++) {
          var arg = arguments[i];
          switch (Object.prototype.toString.call(arg)) {
            case '[object Array]':
              for (var j in arg) {
                entry.cdns.push(arg[j]);
              }
              break;
            case '[object String]':
              entry.cdns.push(arg);
              break;
            default:
              throw new Error('Invalid arguments type, expect String or Array');
          }
        }
        return vendor;
      },
      rename: function() {
        if (arguments.length < 1 || typeof arguments[0] === 'undefined') {
          throw new Error('Expect arguments');
        }
        for (var i = 0; i < arguments.length; i++) {
          var arg = arguments[i];
          switch (Object.prototype.toString.call(arg)) {
            case '[object Array]':
              this.rename.apply(this, arg);
              break;
            case '[object String]':
              if (++i === arguments.length) {
                throw new Error('Expect even pairs of String arguments');
              }
              if (typeof arguments[i] !== 'string') {
                throw new Error('Expect String map argument');
              }
              configs.maps.push({test: arg, map: arguments[i]});
              break;
            default:
              throw new Error('Invalid arguments type, expect String or Array');
          }
        }
        return vendor;
      },
      preScripts: function() {
        if (arguments.length < 1 || typeof arguments[0] === 'undefined') {
          throw new Error('Expect arguments');
        }
        for (var i = 0; i < arguments.length; i++) {
          var arg = arguments[i];
          switch (Object.prototype.toString.call(arg)) {
            case '[object Array]':
              this.preScripts.apply(this, arg);
              break;
            case '[object String]':
              configs.preScripts.push(arg);
              break;
            default:
              throw new Error('Invalid arguments type, expect String or Array');
          }
        }
        return vendor;
      },
      postScripts: function() {
        if (arguments.length < 1 || typeof arguments[0] === 'undefined') {
          throw new Error('Expect arguments');
        }
        for (var i = 0; i < arguments.length; i++) {
          var arg = arguments[i];
          switch (Object.prototype.toString.call(arg)) {
            case '[object Array]':
              this.postScripts.apply(this, arg);
              break;
            case '[object String]':
              configs.postScripts.push(arg);
              break;
            default:
              throw new Error('Invalid arguments type, expect String or Array');
          }
        }
        return vendor;
      }
    }

    vendors[name] = {
      tmpl: tmpl,
      configs: configs,
      __proto__: vendor
    };

    for (var i in defaults) {
      vendor[defaults[i][0]].apply(vendor, defaults[i][1]);
    }

    return vendor;
  };

  vendorup.base = function(value) {
    if (arguments.length < 1 || typeof arguments[0] === 'undefined') {
      throw new Error('Expect argument');
    }
    if (Object.prototype.toString.call(value) === '[object String]') {
      configs.base = value;
    } else {
      throw new Error('Expect String');
    }
    return vendorup;
  };

  vendorup.default =
  vendorup.defaults = function() {
    if (arguments.length < 1 || typeof arguments[0] === 'undefined') {
      throw new Error('Expect arguments');
    } else if (Object.prototype.toString.call(arguments[0]) === '[object Object]') {
      for (var method in arguments[0]) {
        defaults.push([method, arguments[0][method]]);
      }
    } else if (Object.prototype.toString.call(arguments[0]) === '[object String]') {
      var args = [];
      for (var i in arguments) {
        args.push(arguments[i]);
      }
      defaults.push([args[0], args.slice(1)]);
    } else {
      throw new Error('Expect String or Object');
    }
    return vendorup;
  };

  vendorup.new = function() {
    return VendorUp();
  };

  vendorup.engines = Engines();
  vendorup.vendors = vendors;

  vendorup.resolver = function(uri) {
    if (uri.match(/^https?:\/\/.*\.git$/)) {
      return 'git';
    }
    var matches;
    if (matches = uri.match(/^([\w-]+):\/\/(.*)$/)) {
      switch(matches[1]) {
        case 'git':
          return 'git';
        case 'http':
          return 'http';
        case 'https':
          return 'https';
        case 'npm':
          return 'npm';
        case 'bower':
          return 'bower';
      }
    }
    return null;
  };

  vendorup.up = function() {
    var order = [];
    var pending = [];

    var add = function(name) {
      if (inArray(name, order)) {
        return;
      }
      if (inArray(name, pending)) {
        throw new Error('Circular denepndency:', name);
      }
      pending.push(name);
      var vendor = vendors[name];
      if (typeof vendor.dependencies !== 'undefined'
        && Object.prototype.toString.call(vendor.dependencies) === '[object Array]'
        && vendor.dependencies.length > 0) {
        for (var i in vendor.dependencies) {
          add(vendor.dependencies[i]);
        }
      }
      order.push(name);
      pending.pop();
    };

    for (var name in vendors) {
      if (vendors.hasOwnProperty(name)) {
        add(name);
      }
    }

    for (var i in order) {
      var name = order[i];
      if (vendors.hasOwnProperty(name)) {
        var vendor = vendors[name];
        var tmpl = vendor.tmpl;
        if (!vendor.configs.src.options.engine) {
          vendor.configs.src.options.engine = vendorup.resolver(tmpl(vendor.configs.src.uri));
        }
        var vendorBase = path.resolve(configs.base, tmpl(vendor.configs.base));
        var originalPwd = $.pwd();
        try {
          fs.statSync(vendorBase);
          $.rm('-rf', vendorBase);
        } catch(e) {
          if (e.code === 'ENOENT' && e.errno === -2) { } else {
            throw new Error('File system error');
          }
        }
        $.mkdir('-p', vendorBase);
        $.cd(vendorBase);
        var engine = vendor.configs.src.options.engine;
        switch(typeof engine) {
          case 'string':
            if (vendorup.engines.hasOwnProperty(engine)) {
              engine = vendorup.engines[engine];
            } else {
              throw new Error('Cannot find engine ' + engine);
            }
            break;
          case 'function':
            break;
          default:
            throw new Error('Unsupported engine type');
        }
        console.log('Getting', name);
        engine(tmpl(vendor.configs.src.uri), vendorBase, vendor.configs.src.options);
        for(var i in vendor.configs.maps) {
          var map = vendor.configs.maps[i];
          try {
            fs.statSync(map.test);
            $.mv(map.test, map.map);
          } catch(e) {
            if (e.code === 'ENOENT' && e.errno === -2) {
              console.log('File not found:', map.test);
            }
          }
        }
        $.cd(originalPwd);
      }
    }
  };

  return vendorup;
};

module.exports = VendorUp();
