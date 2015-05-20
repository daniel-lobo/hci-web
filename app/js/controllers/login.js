app.controller('LoginCtrl', function($scope, $location, session, api, messages, validate) {
  if (session.is_logged_in())
    return $location.path('/profile');

  $scope.form = {
    email   : null,
    password: null,
  };

  $scope.status = {
    email   : 'invalid',
    password: 'invalid'
  };

  $scope.error   = "";
  $scope.loading = false;

  $scope.isValid = function() {
    return $scope.status.email === 'valid' && $scope.status.password === 'valid';
  }

  $scope.validate = function() {
    $scope.status.email    = validate.email($scope.form.email)
    $scope.status.password = validate.password($scope.form.password);
  }

  $scope.submit = function() {
    $scope.loading = true;
    $scope.error   = null;

    credentials = {
      username: $scope.form.email,
      password: $scope.form.password,
    }

    api.user.login(credentials)
      .then(function() {
        delete $scope.error;
        $location.path('/');
        console.log('here')

      }).catch(function(error) {
        if (error.meta.code)
          $scope.error = messages.fromApi(error.meta.code);

      }).finally(function(){ $scope.loading = false })
    ;
  }
});
