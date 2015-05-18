app.factory('cart', function($rootScope, $q, api, session) {
  var prototype = {
    add: function(product, quantity) {
      var whenAdded = getOrderId().then(function(order_id) {
        return api.order.addProduct({ id: order_id }, product, quantity).then(function() {
          cart.items.push({ product: product, quantity: quantity });
        });
      });

      return whenAdded;
    },

    remove: function(item) {
      var whenDeleted = getOrderId().then(function(order_id) {
        return api.order.removeItem(item).then(function() {
          var index = cart.items.map(function(item) { return item.id }).indexOf(item.id)
          cart.items.splice(index, 1);
        });
      });

      return whenDeleted;
    }
  }

  cart = $rootScope.cart = globalCart = Object.create(prototype);
  angular.extend(cart, { order_id: null, items: [] });

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
    if (! session.cart_order_id || session.cart_order_id != cart.order_id) {
      cart.order_id = null;
      getOrderId();
    }
  });

  return cart;
})
