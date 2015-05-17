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