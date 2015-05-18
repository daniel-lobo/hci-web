app.controller('MainCtrl', function($scope, api) {
    api.product.find({ is_new: true, page_size: 8 }).thenSet($scope, 'products');

    $scope.carrouselSlides = [
      {title:"", image:"assets/img1.jpg", link:"", active:"true"},
      {title:"", image:"assets/img2.jpg", link:"", active:"false"}
    ];
});


app.controller('ProductCtrl', function($scope, $routeParams, api, $rootScope) {
  api.product.get($routeParams.productId).thenSet($scope, 'product');

  $scope.addToCart = function() {

  }
});

app.controller('ProductListCtrl', function($scope, api) {});

app.controller('UserCtrl', function($scope, api) {
  $scope.errors = {};

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
    angular.extend($scope.update_form, $scope.session.profile)
  }, true)
});

app.controller('FaqCtrl', function($scope){

  $scope.alerts = [
   { type: '', msg: 'Esta seccion contiene importante información sobre nuestro sitio web y nuestra tienda Neon. En caso de que no pueda encontrar la respuesta que está buscando, por favor no dude en contactarnos.' }
  ];

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

   $scope.groups = [
        {title: "¿Como comprar?", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent luctus dui et nulla congue, a molestie leo efficitur. Pellentesque quis pretium velit." },
        {title: "Plazos de Entrega", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent luctus dui et nulla congue, a molestie leo efficitur. Pellentesque quis pretium velit." },
        {title: "Politica de cambios", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent luctus dui et nulla congue, a molestie leo efficitur. Pellentesque quis pretium velit." },
        {title: "Terminos y condiciones", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent luctus dui et nulla congue, a molestie leo efficitur. Pellentesque quis pretium velit." }
   ];
});

app.controller('CheckoutCtrl', function($scope, api){
  $scope.newAddressInputField = "";
  $scope.addressSelection = 'address-existing';
  $scope.cardSelection = 'card-existing';

  $scope.alertMessagesForLogIn = [
    {type:"", message:"Debe iniciar sesión para realizar la compra."}
  ];

  $scope.closeAlert = function(index) {
    $scope.alertMessagesForLogIn.splice(index, 1);
  };

  $scope.existingAddresses = [
    'Carlos Gardel 3523, Olivos',
    'Eduardo Madero 399, Capital Federal'
  ];

  $scope.existingCreditCards = [
    'AMEX ************3766',
    'VISA ***********2345'
  ];

  $scope.onAddAddressClick = function() {

    var address = $scope.newAddressInputField;

    $scope.isUserLoggedIn = api.user.is_logged_in();

    api.address.add(address).then(function() {
      $scope.existingAddresses.push(address);
      $scope.addressSelection = 'address-existing';

    }).catchSet($scope, 'error').catch(function(error) {

    });

    api.address.add(address).thenSet($scope, 'lastAdddedAddress');
    api.address.add(address)
  }

});
