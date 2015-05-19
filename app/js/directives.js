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
        scope: true,
        templateUrl: '/views/partials/header.html',
        controller: 'HeaderCtrl',
    }
});

app.directive('productList', function() {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: '/views/partials/product_list.html',
        scope: { products: '='},
        controller: 'ProductListController'
    };
});

app.directive('sidebar', function(){
    // Runs during compile
    return {
        restrict: 'A',
        replace: true,
        templateUrl: '/views/partials/sidebar2.html',
    };
});

app.directive('cartproductlist', function(){
    // Runs during compile
    return {
        restrict: 'A',
        replace: true,
        templateUrl: '/views/partials/cart_product_list.html',
        controller: 'CartController'
    };
});

app.directive('breadcrumbs', function(){
    // Runs during compile
    return {
        restrict: 'A',
        replace: true,
        templateUrl: '/views/partials/breadcrumbs.html',
    };
});


app.directive('formInput', function() {
  return {
    restrict   : 'A',
    replace    : true,
    scope      : { label: '=', placeholder: '=', model: '=', type: '=' },
    templateUrl: '/views/partials/form_input.html'
  }
})
