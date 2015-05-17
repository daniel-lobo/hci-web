var app = angular.module('neonApp', ['ngRoute', 'ui.bootstrap', 'promises']);

app.config(['$routeProvider', function ($routeProvider/*, $locationProvider*/) {
    $routeProvider.

        when('/',
        	{templateUrl: 'views/main.html',
             controller: 'MainCtrl',
             controllerAs: 'mainC'
            }).

        when('/index',
            {templateUrl: 'views/partials/user.html',
             controller: 'MainCtrl',
            }).

        when('/faq',
        	{templateUrl: 'views/partials/faq.html',
             controller: 'FaqCtrl',
             controllerAs: 'faqC'
            }).

        when('/user',
        	{templateUrl: '/views/partials/user.html', controller: 'PlayersCtrl'}).

        when('/liked',
            {templateUrl: 'views/partials/underconstruction.html', controller: 'MainCtrl'}).

        when('/cart',
            {templateUrl: 'views/partials/cart.html', controller: 'MainCtrl'}).

        when('/categories',
            {templateUrl: 'views/partials/categories.html', controller: 'MainCtrl'}).

        when('/checkout',
            {templateUrl: 'views/partials/checkout.html', controller: 'MainCtrl'}).
        otherwise({redirectTo: '/'});

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


/* CONTROLLERS */
app.controller('MainCtrl', function(){
    this.products = [
        {description: 'hola1', price: '123'},
        {description: 'chau1', price: '312'}
    ];
});

app.controller('FaqCtrl', function(){
   this.questions = [
        {question: "¿Como comprar?", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent luctus dui et nulla congue, a molestie leo efficitur. Pellentesque quis pretium velit." },
        {question: "Plazos de Entrega", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent luctus dui et nulla congue, a molestie leo efficitur. Pellentesque quis pretium velit." },
        {question: "Politica de cambios", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent luctus dui et nulla congue, a molestie leo efficitur. Pellentesque quis pretium velit." },
        {question: "Terminos y condiciones", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent luctus dui et nulla congue, a molestie leo efficitur. Pellentesque quis pretium velit." }
   ]; 
});
