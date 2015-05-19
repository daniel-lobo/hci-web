app.filter('join', function() {
  return function join(array, string) {
    return array.join(string);
  }
})

app.filter('orderCount', function() {
  return function orderCount(order) {
    return order.items
      .map(function (item) { return item.quantity })
      .sum()
    ;
  }
})

app.filter('orderTotal', function() {
  return function orderTotal(order) {
    return order.items
      .map(function(item) { return item.quantity * item.product.price })
      .sum()
    ;
  }
})


app.filter('formatCard', function() {
  return function formatCard(card) {
    return formatCreditCard({ number: card.number || card });
  }
})
