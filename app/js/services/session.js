app.factory('session', function($rootScope, $cookies) {
  var prototype = {
    extend: function(extras) { _.extend(this, extras) },
    merge : function(extras) { _.merge(this, extras) },
    clear : function() { clear(this) },

    is_logged_in: function() {
      return this.profile !== undefined;
    }
  };

  var session = Object.create(prototype)
  angular.extend(session, $cookies.getObject('session'));

  $rootScope.session = globalSession = session;

  $rootScope.$watch('session', function() {
    $cookies.putObject('session', session);
    $rootScope.$broadcast('session.change');
  }, true);


  return session;
})
