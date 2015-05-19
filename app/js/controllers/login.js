app.controller('LoginCtrl', function($scope, api) {
  $scope.form    = {};
  $scope.loading = false;

  $scope.submit = function() {
    $scope.loading = true;

    credentials = {
      username: $scope.form.email,
      password: $scope.form.password,
    }

    api.user.login(credentials)
      .then(function() { delete $scope.error; })
      .catchSet($scope, 'error')
      .finally(function(){ $scope.loading = false })
    ;
  }
});
