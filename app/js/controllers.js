
app.controller('UserCtrl', function($scope, api) {
  $scope.session      = api.session;
  $scope.is_logged_in = api.user.is_logged_in;
  $scope.errors       = {};

  $scope.login_form = { username: 'testuser3', password: 'asdf1234' };
  $scope.login_form_loading = false;

  $scope.update_form = {};
  $scope.update_form_loading = false;

  $scope.login = function() {
    $scope.login_form_loading = true;

    api.user.login($scope.login_form)
      .catchSet($scope, 'errors')
      .finally(function(){ $scope.login_form_loading = false })
    ;
  }

  $scope.update = function() {
    $scope.update_form_loading = true;

    api.user.update($scope.update_form)
      .catchSet($scope, 'errors')
      .finally(function(){ $scope.update_form_loading = false })
    ;
  }

  $scope.logout = function() {
    api.user.logout();
  }

  $scope.$watch('session', function() {
    angular.extend($scope.update_form, $scope.session)
  }, true)
})
