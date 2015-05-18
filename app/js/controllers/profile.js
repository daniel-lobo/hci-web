app.controller('ProfileCtrl', function($scope, $location, session, api) {
  if (! session.is_logged_in())
    $location.path('/login');

  $scope.form = {};

  $scope.update = function() {
    $scope.loading = true;

    api.user.update($scope.form)
      .then(function() { delete $scope.error; })
      .catchSet($scope, 'error')
      .finally(function(){ $scope.loading = false })
    ;
  }

  $scope.logout = function() {
    api.user.logout();
  }

  $scope.$watch('session', function() {
    angular.extend($scope.form, $scope.session.profile)

    if (! session.is_logged_in())
      $location.path('/login');
  }, true)
});
