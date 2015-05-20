app.controller('SignupCtrl', function($scope, api, messages, validate) {
  $scope.form    = {};
  $scope.loading = false;

  $scope.validate = function() {
    return validate.join();
  }

  $scope.submit = function() {
    $scope.loading = true;

    profile = {
      username    : $scope.form.email,
      password    : $scope.form.password,
      firstName   : $scope.form.name,
      lastName    : "Von Blitzcrank",
      gender      : 'F',
      identityCard: $scope.form.number,
      email       : $scope.form.email,
      birthDate   : "1970-01-02"
    }

    api.user.signup(profile)
      .then(function() { delete $scope.error; })

      .catch(function(error) {
        if (error.meta.code) {
          $scope.error = messages.fromApi(error.meta.code);
        }

      }).finally(function() { $scope.loading = false })
    ;
  }
});
