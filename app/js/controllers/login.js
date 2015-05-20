app.controller('LoginCtrl', function($scope, api, m) {
  $scope.form = {
    email   : null,
    password: null,

    showEmailError   : false,
    showPasswordError: false,
  };

  $scope.error = null;
  $scope.disableSubmit = true;
  $scope.loading = false;

  function validatePassword(password) {
    password = password || '';

    var alphanum  = password.length == 0 || (/^[a-z0-9]+$/i).test(password);
    var too_long  = (password.length > 15);
    var too_short = (password.length < 8);

    return {
      showError    : (! alphanum || too_long),
      disableSubmit: (! alphanum || too_short || too_long)
    };
  }

  function validateEmail(email) {
    // E-mail validation should be permissive
    var is_atrocity =
          email.match(/[\"\^\&\*\=\?\!]/)
      || (email.match(/@/g) || []).length > 1
    ;

    return {
      showError    : is_atrocity,
      disableSubmit: is_atrocity || !email
    }
  }

  $scope.validate = function() {
    var vemail    = validateEmail($scope.form.email)
    var vpassword = validatePassword($scope.form.password);

    $scope.form.showEmailError    = vemail.showError;
    $scope.form.showPasswordError = vpassword.showError;

    $scope.disableSubmit = vemail.disableSubmit || vpassword.disableSubmit;
  }

  $scope.submit = function() {
    $scope.loading = true;
    $scope.error   = null;

    credentials = {
      username: $scope.form.email,
      password: $scope.form.password,
    }

    api.user.login(credentials)
      .then(function() { delete $scope.error; })

      .catch(function(error) {
        if (error.meta.code) {
          $scope.error = m.fromApi(error.meta.code);
        }

      }).finally(function(){ $scope.loading = false })
    ;
  }
});
