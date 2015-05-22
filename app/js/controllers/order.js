app.controller('OrderCtrl', function($scope, $routeParams, $q, api) {
  // Unwrap callbacks:
  var notifyEdit   = $scope.onEdit ? $scope.onEdit() : angular.noop;
  var notifyRemove = $scope.onRemove ? $scope.onRemove() : angular.noop;

  if (! $scope.order)
    api.order.get($routeParams.orderId).thenSet($scope, 'order');

  $scope.updateQuantity = function(item) {
    notifyEdit(item);
  }

  $scope.removeItem = notifyRemove;
});

app.directive('orderView', function() {
  return {
    restrict   : 'A',
    replace    : true,
    templateUrl: 'views/partials/order.html',
    controller : 'OrderCtrl',
    scope      : { order: '=', compact: '@', editable: '@', onEdit: '&', onRemove: '&' }
  };
});

// var whenRemoved = api.order.removeItem(item);
// var whenAdded   = api.order.addProduct($scope.order, item.product, item.quantity);
//
// $q.all([ whenRemoved, whenAdded ]).then(function(args) {
//   var index = $scope.order.items.map(function(i) { return i.id }).indexOf(item.id);
//   cart.items[index] = args[1];
// })

// var exampleOrder = buildOrder({
//   "address": {
//       "id": 7,
//       "name": "ITBA - Sede Central"
//   },
//   "creditCard": null,
//   "deliveredDate": "2014-06-25 00:00",
//   "id": 4,
//   "items": [
//       {
//           "id": 2071,
//           "price": 458,
//           "product": {
//               "id": 1,
//               "imageUrl": "http://eiffel.itba.edu.ar/hci/service3/images/levis-9623-26963-1-product.jpg",
//               "name": "Pancha Coral"
//           },
//           "quantity": 2
//       },
//       {
//           "id": 2072,
//           "price": 458,
//           "product": {
//               "id": 1,
//               "imageUrl": "http://eiffel.itba.edu.ar/hci/service3/images/levis-9623-26963-1-product.jpg",
//               "name": "Pancha Coral"
//           },
//           "quantity": 2
//       },
//       {
//           "id": 2073,
//           "price": 458,
//           "product": {
//               "id": 1,
//               "imageUrl": "http://eiffel.itba.edu.ar/hci/service3/images/levis-9623-26963-1-product.jpg",
//               "name": "Pancha Coral"
//           },
//           "quantity": 2
//       },
//       {
//           "id": 2074,
//           "price": 458,
//           "product": {
//               "id": 1,
//               "imageUrl": "http://eiffel.itba.edu.ar/hci/service3/images/levis-9623-26963-1-product.jpg",
//               "name": "Pancha Coral"
//           },
//           "quantity": 2
//       },
//       {
//           "id": 4,
//           "price": 458,
//           "product": {
//               "id": 1,
//               "imageUrl": "http://eiffel.itba.edu.ar/hci/service3/images/levis-9623-26963-1-product.jpg",
//               "name": "Pancha Coral"
//           },
//           "quantity": 2
//       },
//       {
//           "id": 1037,
//           "price": 458,
//           "product": {
//               "id": 1,
//               "imageUrl": "http://eiffel.itba.edu.ar/hci/service3/images/levis-9623-26963-1-product.jpg",
//               "name": "Pancha Coral"
//           },
//           "quantity": 2
//       },
//       {
//           "id": 1416,
//           "price": 458,
//           "product": {
//               "id": 1,
//               "imageUrl": "http://eiffel.itba.edu.ar/hci/service3/images/levis-9623-26963-1-product.jpg",
//               "name": "Pancha Coral"
//           },
//           "quantity": 2
//       },
//       {
//           "id": 1417,
//           "price": 554,
//           "product": {
//               "id": 2,
//               "imageUrl": "http://eiffel.itba.edu.ar/hci/service3/images/coca-cola-7762-90813-1-product.jpg",
//               "name": "Alpargata Negra Coca-Cola Shoes Carnaval"
//           },
//           "quantity": 2
//       },
//   ],
//   "latitude": 0,
//   "longitude": 0,
//   "processedDate": "2013-10-10 00:00",
//   "receivedDate": "2013-10-10 00:00",
//   "shippedDate": null,
//   "status": "2"
// });
