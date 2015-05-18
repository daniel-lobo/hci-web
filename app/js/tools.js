var globalSession;

function raise(message) {
  if (typeof message === 'string') {
    error = new Error(message);

  } else {
    error = new Error(JSON.stringify(message, null, 2));
    error.meta = message
  }

  throw error
}

function getter(prop) {
  if (arguments.length < 2)
    return function(x) { return x[prop] };

  else
    var props = arguments;

    return function(x) {
      var object = {};

      for (var i = 0; i < props.length; i++)
        object[props[i]] = x[props[i]];

      return object;
    }
}

function mapper(f) {
  return function(l) { return l.map(f) };
}

function clear(object) {
  for (var prop in object) delete object[prop];
}

angular.module('promises', [])
.config(function ($provide) {
  $provide.decorator('$q', function ($delegate, $location) {
    // We'll monkey-patch the Promise prototype (yay!)

    var promise   = $delegate(function() {});
    var prototype = Object.getPrototypeOf(promise);

    prototype.thenSet = function(object, prop, overrideResult) {
      return this.then(function(result) {
        if (overrideResult) result = overrideResult;
        object[prop] = result;
        return result;
      })
    }

    prototype.get = function() {
      return this.then(getter.apply(null, arguments));
    }

    prototype.map = function(f) {
      return this.then(mapper(f));
    }

    prototype.mapGet = function() {
      return this.then(mapper(getter.apply(null, arguments)));
    }

    prototype.spread = function(f) {
      return this.then(function() {
        f.apply(null, arguments);
      })
    }

    prototype.thenExtend = function thenExtend(object, overrideResult) {
      return this.then(function(result) {
        if (overrideResult) result = overrideResult;
        angular.extend(object, result);
        return result;
      })
    }

    prototype.thenClear = function thenClear(object) {
      return this.then(function(result) {
        clear(object);
        return result;
      })
    }

    prototype.catchSet = function catchSet(object, prop) {
      return this.catch(function(error) {
        object[prop] = error;
      })
    }

    prototype.catchExtend = function catchExtend(object) {
      return this.catch(function(error) {
        angular.extend(object, error);
      })
    }

    return $delegate;
  });
});
