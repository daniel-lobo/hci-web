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

    .when('/profile', {
      templateUrl: '/views/profile.html',
      controller: 'ProfileCtrl'
    })

    .when('/signup', {
      templateUrl: '/views/signup.html',
      controller : 'SignupCtrl'
    })

    .when('/login', {
      templateUrl: '/views/login.html',
      controller : 'LoginCtrl'
    })

    .when('/liked', {
      templateUrl: 'views/partials/underconstruction.html',
      controller : 'MainCtrl'
    })

    .when('/cart', {
      templateUrl: 'views/partials/cart.html',
      controller : 'CartController'
    })

    .when('/category/:filter/:categoryId', {
      templateUrl: 'views/partials/category.html',
      controller : 'CategoryCtrl'
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
