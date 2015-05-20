app.controller('ProfileCtrl', function($scope, $location, session, api, validate, messages) {
  if (! session.is_logged_in())
    $location.path('/login');

  $scope.reset = function() {
    $scope.form = {
      name : session.profile.firstName,
      email: session.profile.email
    }

    $scope.status = {
      name : 'valid',
      email: 'valid'
    };
  }

  $scope.reset();
  $scope.error = "";

  $scope.hasChanges = function() {
    return $scope.form.name !== session.profile.firstName || $scope.form.email !== session.profile.email;
  }

  $scope.isValid = function() {
    if (! $scope.hasChanges())
      return false;

    return $scope.status.name === 'valid' && $scope.status.email === 'valid';
  }

  $scope.undo = function() {
    $scope.form = {
      name : session.profile.firstName,
      email: session.profile.email
    };
  }

  $scope.validate = function() {
    $scope.status.name  = validate.name($scope.form.name);
    $scope.status.email = validate.email($scope.form.email);
  }

  $scope.update = function() {
    $scope.loading = true;

    var form = angular.merge(session.profile, {
      firstName: $scope.form.name,
      email    : $scope.form.email
    });

    api.user.update(form)
      .then(function() { delete $scope.error; })

      .catch(function(error) {
        if (error.meta.code)
          $scope.error = messages.fromApi(error.meta.code);

      }).finally(function(){ $scope.loading = false })
    ;
  }

  $scope.formatCreditCard = formatCreditCard;

  $scope.logout = function() {
    api.user.logout();
  }

  api.order.all().then(function(orders) {
    return orders.filter(function(order) {
      return order.status != 'unconfirmed';
    })
  }).thenSet($scope, 'orders');


  // $scope.$watch('session', function() {
  //   angular.extend($scope.form, $scope.session.profile)
  //
  //   if (! session.is_logged_in())
  //     $location.path('/login');
  // }, true)
});
