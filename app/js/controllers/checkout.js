app.controller('CheckoutCtrl', function($scope, $location, api, session, cart) {
  var now = new Date();

  $scope.months = range(now.getMonth(), 13);
  $scope.years  = range(now.getFullYear(), now.getFullYear() + 15);

  function reloadOrder() {
    $scope.order = { id: cart.order_id, items: cart.items };
  }

  reloadOrder();
  $scope.$on('cart.change', reloadOrder);

  api.address.all()
    .thenSet($scope, 'addresses')
    .then(function(addresses) {
      $scope.selectedAddress = addresses[0];
    })
  ;

  api.card.all()
    .thenSet($scope, 'cards')
    .then(function(cards) {
      $scope.selectedCard = cards[0];
    })
  ;

  $scope.formatCreditCard = formatCreditCard;

  $scope.addAddress = function(name) {
    api.address.add(name).then(function(address) {
      $scope.addressPanel = 1;
      $scope.addresses.push(address);
      $scope.selectedAddress = address;
    });
  }

  $scope.addCard = function(number, code, exMonth, exYear) {
    var _card = {
      number: number,
      expirationDate: ("0" + exMonth).slice(-2) + exYear.toString().slice(-2),
      securityCode: code
    }

    api.card.add(_card).then(function(card) {
      $scope.cardPanel = 1;
      $scope.cards.push(card);
      $scope.selectedCard = card;
    });
  }

  $scope.checkout = function() {
    cart.checkout($scope.selectedAddress, $scope.selectedCard).then(function(
      $location.path('#/profile');
    ));
  }
});
