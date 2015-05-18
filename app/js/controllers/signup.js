app.directive('signupForm', function () {
  return {
    restrict   : 'A',
    replace    : true,
    // scope   : true,
    templateUrl: '/views/partials/signup.html',
    controller : 'SignupFormCtrl'
  }
});

app.controller('SignupFormCtrl', function($scope) {
  $scope.signup = function() {
    $scope.loading = true;

    api.user.signup($scope.form)
      .catchSet($scope, 'errors')
      .finally(function(){ $scope.loading = false })
    ;
  }
});
