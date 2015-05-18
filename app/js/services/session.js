app.factory('session', function($rootScope) {
  var prototype = {
    extend: function(extras) { angular.extend(this, extras) },
    merge : function(extras) { angular.merge(this, extras) },
    clear : function() { clear(this) },

    is_logged_in: function() {
      return this.profile !== undefined;
    }
  };

  var storage = Object.create(prototype)

  $rootScope.session = storage;

  return storage;
})
