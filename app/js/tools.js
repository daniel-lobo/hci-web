var globalSession;
var globalCart;

Array.prototype.sum = function() {
  var total = 0;
  for (var i = 0; i < this.length; i++)
    total += this[i];
  return total;
}

angular.defaults = function(object, defaults) {
  for (var key in defaults)
    if (! Object.hasOwnProperty(object, key))
      object[key] = defaults[key];
}

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

function range(start, stop) {
  var r = [];
  for (var i = start; i < stop; i++) r.push(i);
  return r;
}

function formatDate(date) {
  return date.toString();
}

function isCreditCardValid(card) {
  return formatCreditCard(card) !== null;
}

function formatCreditCard(card) {
  var string  = "";
  var snumber = card.number.toString();

  if ((snumber.startsWith('34') || snumber.startsWith('37')) && snumber.length == 15)
    string += "American Express";
  else
  if (snumber.startsWith('36') && snumber.length == 16)
    string += "Diners";
  else
  if ((snumber.startsWith('51') || snumber.startsWith('52') || snumber.startsWith('53')) && snumber.length == 16)
    string += "Mastercard";
  else
  if (snumber.startsWith('4') && snumber.length == 13 || snumber.length == 16)
    string += "Visa";
  else
    return null;

  string += " " + card.number;

  if (card.expirationDate)
    string += " (" + card.expirationDate + ")";

  return string;
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
        console.log('spread', arguments)
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

    prototype.finallySet = function(object, prop, overrideResult) {
      return this.finally(function(result) {
        if (overrideResult) result = overrideResult;
        object[prop] = result;
        return result;
      })
    }

    return $delegate;
  });
});
