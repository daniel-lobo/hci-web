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

    .when('/user', {
      templateUrl: '/views/partials/user.html', controller: 'UserCtrl',
      ncyBreadcrumb: 'User'
    })

    .when('/liked', {
      templateUrl: 'views/partials/underconstruction.html',
      controller : 'MainCtrl',
    })

    .when('/cart', {
      templateUrl: 'views/partials/cart.html',
      controller : 'MainCtrl',
      ncyBreadcrumb: 'Cart'
    })

    .when('/category/:filter/:categoryId', {
      templateUrl: 'views/partials/category.html',
      controller : 'CategoryCtrl',
      ncyBreadcrumb: 'Category Detail'
    })

    .when('/product/:productId', {
       templateUrl: 'views/partials/product.html',
       controller : 'ProductCtrl',
       ncyBreadcrumb: 'Product Detail'
     })

    .when('/checkout', {
      templateUrl: 'views/partials/checkout.html',
      controller : 'CheckoutCtrl',
      ncyBreadcrumb: 'Checkout'
    })

    .otherwise({ redirectTo: '/' });
     // use the HTML5 History API
    // $locationProvider.html5Mode(true);
}]);
