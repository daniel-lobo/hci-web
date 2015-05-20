app.controller('SignupCtrl', function($scope, $location, api, messages, validate) {
  $scope.form = {
    name     : null,
    email    : null,
    dni      : null,
    password : null,
    password2: null,
  };

  $scope.status = {
    name     : 'invalid',
    email    : 'invalid',
    dni      : 'invalid',
    password : 'invalid',
    password2: 'invalid',
  }

  $scope.loading = false;

  $scope.isValid = function() {
    return Object.keys($scope.status).every(function(field) {
      return $scope.status[field] === 'valid';
    });
  }

  $scope.validate = function() {
    $scope.status.name      = validate.name($scope.form.name);
    $scope.status.email     = validate.email($scope.form.email)
    $scope.status.dni       = validate.dni($scope.form.dni);
    $scope.status.password  = validate.password($scope.form.password);
    $scope.status.password2 = validate.password2($scope.form.password2, $scope.form.password);

    console.log($scope.status);
  }

  $scope.submit = function() {
    $scope.loading = true;

    profile = {
      username    : $scope.form.email,
      password    : $scope.form.password,
      firstName   : $scope.form.name,
      lastName    : "Von Blitzcrank",
      gender      : 'F',
      identityCard: $scope.form.dni.replace(/[^0-9]/g, ''),
      email       : $scope.form.email,
      birthDate   : "1970-01-02"
    }

    api.user.signup(profile)
      .then(function() {
        delete $scope.error;
        $location.path('/');

      }).catch(function(error) {
        if (error.meta.code) {
          $scope.error = messages.fromApi(error.meta.code);
        }

      }).finally(function() { $scope.loading = false })
    ;
  }
});
