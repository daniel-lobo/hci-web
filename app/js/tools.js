
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
  return function(x) { return x[prop] };
}

function mapper(f) {
  return function(l) { return l.map(f) };
}

angular.module('promises', [])
.config(function ($provide) {
  $provide.decorator('$q', function ($delegate, $location) {
    // We'll monkey-patch the Promise prototype (yay!)

    var promise   = $delegate(function() {});
    var prototype = Object.getPrototypeOf(promise);

    prototype.thenSet = function(object, prop) {
      return this.then(function(result) {
        object[prop] = result;
        return result;
      })
    }

    prototype.get = function(prop) {
      return this.then(getter(prop));
    }

    prototype.map = function(f) {
      return this.then(mapper(f));
    }

    prototype.mapGet = function(prop) {
      return this.then(mapper(getter(prop)));
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
        for (var prop in object)
            delete object[prop];

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
