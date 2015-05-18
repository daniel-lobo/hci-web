app.controller('SignupFormCtrl', function($scope, api) {
  $scope.form    = {};
  $scope.loading = false;

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

    console.log('before', profile)

    api.user.signup(profile)
      .then(function() { delete $scope.error; })
      .catchSet($scope, 'error')
      .finally(function(){ $scope.loading = false })
    ;
  }
});

app.directive('signupForm', function () {
  return {
    restrict   : 'A',
    replace    : true,
    // scope   : true,
    templateUrl: '/views/partials/signup.html',
    controller : 'SignupFormCtrl'
  }
});
