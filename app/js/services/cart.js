app.factory('cart', function($rootScope, $q, api, session) {

  function getOrderId() {
    if (cart.order_id != null)
      return $q.when(cart.order_id);

    else if (session.cart_order_id != null)
      return api.order.get(session.cart_order_id).then(function(order) {
        cart.order_id = order.id;
        cart.items    = order.items;
      })

    else
      return api.order.add().then(function(order) {
        cart.order_id         = order.id;
        cart.items            = []
        session.cart_order_id = order.id; // session is persistent

        return order.id;
      });
  }

  $rootScope.$on('session.change', function() {
    if (session.cart_order_id != cart.order_id) {
      cart.order_id = null;
      getOrderId();
    }
  });

  var prototype = {
    add: function(product, quantity) {
      var whenAdded = getOrderId().then(function(order_id) {
        return api.order.addProduct({ id: order_id }, product, quantity).then(function() {
          cart.items.push({ product: product, quantity: quantity });
        });
      });

      return whenAdded;
    }
  }

  var cart = $rootScope.cart = globalCart = Object.create(prototype);
  angular.extend(cart, { order_id: null, items: [] });
  //
  // function checkout(address, card) {
  //   api.order.add().then(function(order) {
  //     var promises = items.map(function addItem)
  //
  //   })
  // }

  return cart;
})
