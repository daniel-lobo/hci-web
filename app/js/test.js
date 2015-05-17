var app = angular.module('neonApp', ['ngRoute', 'promises']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.

        when('/',
        	{templateUrl: 'views/partials/checkout.html', controller: 'MainCtrl'}).

        when('/index',
            {templateUrl: 'views/partials/user.html', controller: 'MainCtrl'}).

        when('/faq',
        	{templateUrl: 'views/partials/faq.html', controller: 'SportsCtrl'}).

        when('/user',
        	{templateUrl: '/views/players.html', controller: 'PlayersCtrl'}).

        when('/liked',
            {templateUrl: 'views/partials/user.html', controller: 'MainCtrl'}).

        when('/cart',
            {templateUrl: 'views/partials/user.html', controller: 'MainCtrl'}).

        when('/checkout',
            {templateUrl: 'views/partials/user.html', controller: 'MainCtrl'}).


        otherwise({redirectTo: '/'});
}]);


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
