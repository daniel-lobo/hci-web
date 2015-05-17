var app = angular.module('neonApp', ['ngRoute', 'ngMessages', 'ui.bootstrap', 'promises']);

app.config(['$routeProvider', function ($routeProvider/*, $locationProvider*/) {
  $routeProvider
    .when('/', {
      templateUrl : 'views/main.html',
      controller  : 'MainCtrl'
    })

    .when('/index', {
     templateUrl: 'views/partials/user.html',
     controller : 'MainCtrl',
    })

    .when('/faq', {
      templateUrl : 'views/partials/faq.html',
      controller  : 'FaqCtrl',
      controllerAs: 'faqC'
    })

    .when('/user', {
      templateUrl: '/views/partials/user.html', controller: 'UserCtrl'
    })

    .when('/liked', {
      templateUrl: 'views/partials/underconstruction.html',
      controller : 'MainCtrl'
    })

    .when('/cart', {
      templateUrl: 'views/partials/cart.html',
      controller : 'MainCtrl'
    })

    .when('/categories', {
      templateUrl: 'views/partials/categories.html',
      controller : 'MainCtrl'
    })

    .when('/product/:productId', {
       templateUrl: 'views/partials/product.html',
       controller : 'ProductCtrl'
     })

    .when('/checkout', {
      templateUrl: 'views/partials/checkout.html',
      controller : 'CheckoutCtrl'
    })

    .otherwise({ redirectTo: '/' });
     // use the HTML5 History API
    // $locationProvider.html5Mode(true);
}]);


// DIRECTIVES

app.directive('head', function(){
    return {
        restrict: 'A', // This means that it will be used as an attribute and NOT as an element.
        replace: true,
        templateUrl: '/views/partials/head.html',
        controller: ['$scope', '$filter', function ($scope, $filter) {
            // Your behaviour goes here :)
        }]
    }
});


app.directive('footer', function () {
    return {
        restrict: 'A', // This means that it will be used as an attribute and NOT as an element.
        replace: true,
        templateUrl: '/views/partials/footer.html',
        controller: ['$scope', '$filter', function ($scope, $filter) {
            // Your behaviour goes here :)
        }]
    }
});

app.directive('header', function () {
    return {
        restrict: 'A',
        replace: true,
        scope: {user: '='}, // This is one of the cool things :). Will be explained in post.
        templateUrl: '/views/partials/header.html',
        controller: ['$scope', '$filter', function ($scope, $filter) {
            // Your behaviour goes here :)
        }]
    }
});

app.directive('products-display', function() {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: '/views/partials/categories_items.html',
        controller: 'CategoriesCtrl',
        controllerAs: 'categoriesC'
    };
});

app.directive('sidebar', function(){
    // Runs during compile
    return {
        restrict: 'A',
        replace: true,
        templateUrl: '/views/partials/sidebar.html',
        controller: 'SidebarCtrl'
    };
});

app.directive('breadcrumbs', function(){
    // Runs during compile
    return {
        restrict: 'A',
        replace: true,
        templateUrl: '/views/partials/breadcrumbs.html',
        controller: 'BreadcrumbsCtrl'
    };
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
    console.log("hola");

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
