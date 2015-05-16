var app = angular.module('neonApp', ['ngResource', 'ngRoute']);

app.config(['$resourceProvider', function($resourceProvider) {
  $resourceProvider.defaults.stripTrailingSlashes = false;
}]);


app.config(['$routeProvider', function ($routeProvider/*, $locationProvider*/) {
    $routeProvider.

        when('/',
        	{templateUrl: 'views/partials/checkout.html', controller: 'MainCtrl'}).

        when('/index',
            {templateUrl: 'views/partials/user.html', controller: 'MainCtrl'}).

        when('/faq',
        	{templateUrl: 'views/faq.html', controller: 'FaqCtrl'}).

        when('/user',
        	{templateUrl: '/views/players.html', controller: 'PlayersCtrl'}).

        when('/liked',
            {templateUrl: 'views/partials/user.html', controller: 'MainCtrl'}).

        when('/cart',
            {templateUrl: 'views/partials/user.html', controller: 'MainCtrl'}).

        when('/checkout',
            {templateUrl: 'views/partials/user.html', controller: 'MainCtrl'}).
        
        
        otherwise({redirectTo: '/'});

         // use the HTML5 History API
        // $locationProvider.html5Mode(true);
}]);


// DIRECTIVES

app.directive('head', function(){
    return {
        restrict: 'A', //This means that it will be used as an attribute and NOT as an element. 
        replace: true,
        templateUrl: '/views/partials/head.html',
        controller: ['$scope', '$filter', function ($scope, $filter) {
            // Your behaviour goes here :)
        }]
    }
});

app.directive('footer', function () {
    return {
        restrict: 'A', //This means that it will be used as an attribute and NOT as an element. 
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
        controllerAs: 'categories-ctrl'
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


/* CONTROLLERS */
/*app.controller('CategoriesCtrl', ['', function(){
    this.
}]);*/