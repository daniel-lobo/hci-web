app.config(['$routeProvider', function ($routeProvider/*, $locationProvider*/) {
  $routeProvider
    .when('/', {
      templateUrl : 'views/main.html',
      controller  : 'MainCtrl',
      ncyBreadcrumb: 'Home'
    })

    .when('/index', {
     templateUrl: 'views/partials/user.html',
     controller : 'MainCtrl',
     ncyBreadcrumb: 'Home'
    })

    .when('/faq', {
      templateUrl : 'views/partials/faq.html',
      controller  : 'FaqCtrl',
      controllerAs: 'faqC',
      ncyBreadcrumb: 'FAQ'
    })

    .when('/profile', {
      templateUrl: 'views/profile.html',
      controller: 'ProfileCtrl'
    })

    .when('/signup', {
      templateUrl: 'views/signup.html',
      controller : 'SignupCtrl'
    })

    .when('/login', {
      templateUrl: 'views/login.html',
      controller : 'LoginCtrl'
    })

    .when('/order/:orderId', {
      templateUrl: 'views/partials/order.html',
      controller : 'OrderCtrl'
    })

    .when('/liked', {
      templateUrl: 'views/partials/underconstruction.html',
      controller : 'MainCtrl',
    })

    .when('/cart', {
      templateUrl: 'views/partials/cart.html',
      controller : 'CartController'
    })

    .when('/category/:filter/:categoryId', {
      templateUrl: 'views/partials/category.html',
      controller : 'CategoryCtrl',
      ncyBreadcrumb: 'Category Detail'
    })

    .when('/searched/:name', {
      templateUrl: 'views/partials/category.html',
      controller : 'CategoryCtrl'
    })

    .when('/product/:productId', {
       templateUrl: 'views/partials/product.html',
       controller : 'ProductCtrl',
       ncyBreadcrumb: 'Product Detail'
     })

    .when('/checkout', {
      templateUrl: 'views/checkout.html',
      controller : 'CheckoutCtrl'
    })

    .otherwise({ redirectTo: '/' });
     // use the HTML5 History API
    // $locationProvider.html5Mode(true);
}]);
