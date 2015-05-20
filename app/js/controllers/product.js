app.controller('ProductCtrl', function($scope, $rootScope, $routeParams, api, cart) {
  $scope.loading = false;

  $scope.productSelections = {
    size: ''
  }

  function randomLetters(max)
  {
      var text = "";
      var possible = "abcdefghijklmnopqrstuvwxyz";

      for( var i=0; i < max; i++ )
          text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
  }

  if (!$scope.product)
    api.product.get($routeParams.productId).thenSet($scope, 'product').then(function() {

      console.log($scope);

      var filter = {
        gender: $scope.product.genders[0],
        page_size: 3,
        name: randomLetters(1)
      }
      
      api.product.find(filter).thenSet($scope, 'products');

    });

  $scope.addToCart = function() {
    $scope.loading = true;

    cart.add($scope.product, 1)
      .catchSet($scope, 'error')
      .finallySet($scope, 'loading', false);
  }

});
