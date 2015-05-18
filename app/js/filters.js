app.filter('join', function() {
  return function join(array, string) {
    return array.join(string);
  }
})

app.filter('orderTotal', function() {
  return function orderTotal(order) {
    if (! order.items)
      return 0;

    var total = 0;
    for (var i = 0; i < order.items.length; i++) {
      total += order.items[i].quantity * order.items[i].product.price;
    }

    return total;
  }
})
