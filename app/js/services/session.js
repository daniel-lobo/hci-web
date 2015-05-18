app.factory('session', function($rootScope, $cookies) {
  var prototype = {
    extend: function(extras) { angular.extend(this, extras) },
    merge : function(extras) { angular.merge(this, extras) },
    clear : function() { clear(this) },

    is_logged_in: function() {
      return this.profile !== undefined;
    }
  };

  var storage = $rootScope.session = Object.create(prototype)

  angular.extend(storage, $cookies.session);
  console.log

  $rootScope.$watch('session', function() {
    $cookies.session = storage;
    console.log('saved')
  }, true);

  return storage;
})
