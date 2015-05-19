app.controller('CartController', function($scope, $location, cart, session) {
  if (! session.is_logged_in())
    $location.path('/login');

  function reloadOrder() {
    $scope.order = { id: cart.order_id, items: cart.items };
  }

  reloadOrder();
  $scope.$on('cart.change', reloadOrder);

  $scope.editItem = function(item) {
    cart.remove(item);
    cart.add(item.product, item.quantity);
  }

  $scope.removeItem = function(item) {
    cart.remove(item);
  }

  $scope.clear = function() {
    cart.items.map(cart.remove);
  }
});
