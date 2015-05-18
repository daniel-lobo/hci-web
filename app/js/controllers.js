app.controller('MainCtrl', function($scope, api) {
  api.product.find({
    is_new: true,
    page_size: 8
  }).thenSet($scope, 'products');

  $scope.carrouselSlides = [{
    title: "",
    image: "assets/img1.jpg",
    link: "",
    active: "true"
  }, {
    title: "",
    image: "assets/img2.jpg",
    link: "",
    active: "false"
  }];
});


app.controller('ProductCtrl', function($scope, $rootScope, $routeParams, api, cart) {
  api.product.get($routeParams.productId).thenSet($scope, 'product');

  $scope.addToCart = function() {
    cart.add($scope.product, 1);
  }

});

app.controller('HeaderCtrl', function($scope, api, cart) {
  api.category.all().thenSet($scope, 'categories');

  $scope.toggled = function(open) {
    console.log("hola");
  };

  // api.order.all().thenSet($scope, 'magicDrawer');
})

app.controller('CategoryCtrl', function($scope, $routeParams, api) {
  var filter = null;

  switch ($routeParams.filter) {
    case "hombres":
      filter = {
        gender: 'Masculino',
        ages: "Adulto"
      };
      break;
    case "mujeres":
      filter = {
        gender: 'Femenino',
        ages: "Adulto"
      };
      break;
    case "chicos":
      filter = {
        gender: 'Masculino',
        ages: "Infantil"
      };
      break;
    case "chicas":
      filter = {
        gender: 'Femenino',
        ages: "Infantil"
      };
      break;
  }

  filter.category = {
    id: $routeParams.categoryId
  };

  api.product.find(filter).thenSet($scope, 'products');

});


app.controller('FaqCtrl', function($scope){

  $scope.alerts = [{
    type: '',
    msg: 'Esta seccion contiene importante información sobre nuestro sitio web y nuestra tienda Neon. En caso de que no pueda encontrar la respuesta que está buscando, por favor no dude en contactarnos.'
  }];

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  $scope.groups = [{
    title: "¿Como comprar?",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent luctus dui et nulla congue, a molestie leo efficitur. Pellentesque quis pretium velit."
  }, {
    title: "Plazos de Entrega",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent luctus dui et nulla congue, a molestie leo efficitur. Pellentesque quis pretium velit."
  }, {
    title: "Politica de cambios",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent luctus dui et nulla congue, a molestie leo efficitur. Pellentesque quis pretium velit."
  }, {
    title: "Terminos y condiciones",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent luctus dui et nulla congue, a molestie leo efficitur. Pellentesque quis pretium velit."
  }];
});

app.controller('CheckoutCtrl', function($scope, api, session) {

  // Info

  $scope.alertMessagesForLogIn = [{
    type: "",
    message: "Debe iniciar sesión para realizar la compra."
  }];

  $scope.closeAlert = function(index) {
    $scope.alertMessagesForLogIn.splice(index, 1);
  };

  // Address variables

  $scope.addressInputField = {
    address: ""
  };
  $scope.addressSelection = {
    selectionStatus: 'address-existing',
    selectedAddress: ''
  };

  // Address list
  $scope.existingAddresses = [];

  $scope.$watch('session', function() {
    if (session.is_logged_in()) {
      api.address.all().thenSet($scope, 'existingAddresses').then(function(address) {
        $scope.addressSelection.selectedAddress = address[0].name;
      });
    }
  }, true);

  // Add new adress

  $scope.onAddAddressClick = function() {

    console.log($scope);
    var address = $scope.addressInputField.address;

    api.address.add(address).then(function(address) {
      $scope.existingAddresses.push(address);
      $scope.addressSelection.selectionStatus = 'address-existing';
      $scope.addressSelection.selectedAddress = address.name;
    }).catch(function(error) {
      console.log("Error");
    });
  }

  // Card variables

  $scope.cardSelection = {
    selectionStatus: 'card-existing',
    selectedCard: ''
  }

  $scope.dateFormat = {
    mstep: ['Mes', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
    ystep: ['Año', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031']
  };

  $scope.cardData = {
    month: 'Mes',
    year: 'Año',
    number: '',
    ccv: ''
  }

  // Add new card

  $scope.onAddCardClick = function() {

    console.log($scope);
    var cardData = $scope.cardData;
    var expiration = cardData.month + cardData.year.substring(2, 4);

    api.card.add({
      number: cardData.number,
      expirationDate: expiration,
      securityCode: cardData.ccv
    }).then(function(card) {
      $scope.existingCreditCards.push(card);
      $scope.cardSelection.selectionStatus = 'card-existing';
      $scope.cardSelection.selectedCard = card.number;

    }).catch(function(error) {
      console.log("Error");
    });
  }

  // Card list

  $scope.existingCreditCards = [];

  $scope.$watch('session', function() {
    if (session.is_logged_in()) {
      api.card.all().thenSet($scope, 'existingCreditCards').then(function(card) {
        $scope.cardSelection.selectedCard = card[0].number;
      });
    }
  }, true);

});

app.controller('CartController', function($scope, cart, session) {

  $scope.variables = {
    totalPrice: 0
  }

  $scope.quantities = [1,2,3,4,5,6,7,8,9,10];

  $scope.$watch('session', function() {
    if (session.is_logged_in()) {
      for(var i=0;i<cart.items.length;i++){
          $scope.variables.totalPrice = $scope.variables.totalPrice + Number(cart.items[i].product.price);
      }
      $scope.variables.totalPrice = '$' + $scope.variables.totalPrice.toFixed(2);
    }
  }, true);

  $scope.updateQuantity = function (item) {
    //console.log(item);
    cart.remove(item).then(cart.add(item.product,item.quantity).then(console.log(cart)));
  }

  $scope.onClickRemove = function (item) {
    cart.remove(item);
  }

  $scope.onClickRemoveAll = function()  {
    cart.items.forEach(function(item) {
      cart.remove(item);
    });
  }

});

/*
$scope.$on('session.change', function() {
    if (session.is_logged_in()) {
      console.log("Logged in");
    }
});*/
