app.controller('ProfileCtrl', function($scope, $location, session, api, validate, messages) {
  if (! session.is_logged_in())
    $location.path('/login');

  $scope.reset = function() {
    var profile = session.profile || {};

    $scope.form = {
      name : profile.firstName,
      email: profile.email
    }

    $scope.status = {
      name : 'valid',
      email: 'valid'
    };

    $scope.error = "";
  }

  $scope.reset();

  $scope.hasChanges = function() {
    if (! session.is_logged_in())
      return true; // ?? just to shut up angular about sesion.profile.firstName

    return $scope.form.name !== session.profile.firstName || $scope.form.email !== session.profile.email;
  }

  $scope.isValid = function() {
    if (! $scope.hasChanges())
      return false;

    return $scope.status.name === 'valid' && $scope.status.email === 'valid';
  }

  $scope.validate = function() {
    $scope.status.name  = validate.name($scope.form.name);
    $scope.status.email = validate.email($scope.form.email);
  }

  $scope.undo = function() {
    $scope.form = {
      name : session.profile.firstName,
      email: session.profile.email
    };
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


  $scope.$watch('session', function() {
    $scope.reset();

    if (! session.is_logged_in())
      $location.path('/login');
  }, true)
});


app.controller('ChangePasswordCtrl', function($scope, session, api, validate, messages) {
  $scope.reset = function() {
    $scope.form = {
      password : null,
      password2: null,
    };

    $scope.status = {
      password : 'invalid',
      password2: 'invalid',
    }

    $scope.error = "";
    $scope.success = "";
  }

  $scope.reset();

  $scope.isValid = function() {
    return $scope.status.password === 'valid' && $scope.status.password2 === 'valid';
  }

  $scope.validate = function() {
    $scope.status.password  = validate.password($scope.form.password);
    $scope.status.password2 = validate.password2($scope.form.password2, $scope.form.password);
  }

  $scope.submit = function() {
    api.user.changePassword($scope.form.password)
      .then(function() {
        delete $scope.error
        $scope.reset();
        $scope.success = messages.changed_password;

      }).catch(function(error) {
        if (error.meta.code)
          $scope.error = messages.fromApi(error.meta.code);

        $scope.success = "";

      }).finally(function() { $scope.loading = false })
    ;
  }
});
