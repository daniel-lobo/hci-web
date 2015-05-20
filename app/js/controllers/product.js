app.controller('ProductCtrl', function($scope, $rootScope, $routeParams, api, cart) {
  $scope.loading = false;

  $scope.productSelections = {
    size: ''
  }

  if (!$scope.product)
    api.product.get($routeParams.productId).thenSet($scope, 'product');
    
  $scope.addToCart = function() {
    $scope.loading = true;

    cart.add($scope.product, 1)
      .catchSet($scope, 'error')
      .finallySet($scope, 'loading', false);
  }

});
