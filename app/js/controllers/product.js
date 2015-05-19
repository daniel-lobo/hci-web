app.controller('ProductCtrl', function($scope, $rootScope, $routeParams, api, cart) {
  $scope.loading = false;

  if (! $scope.product)
    api.product.get($routeParams.productId).thenSet($scope, 'product').then(function(){
      console.log($scope.product);
    });

  $scope.addToCart = function() {
    $scope.loading = true;

    cart.add($scope.product, 1)
      .catchSet($scope, 'error')
      .finallySet($scope, 'loading', false)
    ;
  }

  api.attribute.get(3).then(function(attr){
    console.log(attr);
  });

});
