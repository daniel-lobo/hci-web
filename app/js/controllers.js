app.controller('MainCtrl', function($scope, api) {
  api.product.find({
    is_new: true,
    page_size: 9
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

app.controller('HeaderCtrl', function($scope, $location, api, cart) {
  api.category.all().thenSet($scope, 'categories');

  $scope.searchBoxText = '';

  $scope.searched = function() {
    $location.path('searched/' + $scope.searchBoxText);
    $scope.searchBoxText = '';
  };

  $scope.toggled = function(open) {
    console.log("hola");
  };
});

/*app.controller('HeaderCtrl', function($scope, $location, api, cart) {
  api.category.all().thenSet($scope, 'categories');

  $scope.searchBoxText = '';

  $scope.searched = function($location){
    console.log($location);
    console.log($scope.searchBoxText);
    //$location.path('category/searched/mac');
    $location.path('/login');
    $scope.searchBoxText = '';
  };

  $scope.toggled = function(open) {
    console.log("hola");
  };

  // api.order.all().thenSet($scope, 'magicDrawer');
})*/

app.controller('CategoryCtrl', function($scope, $routeParams, api) {

  var filter = null;

  if ($routeParams.categoryId != null) {
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

  } else {
    filter = {};
    filter.name = $routeParams.name;
  }

  filter.ocation = '';
  filter.color = '';
  filter.brand = '';

  filter.page_size = 12;
  filter.page = 1;

  $scope.filter = filter;

  api.product.find(filter).thenSet($scope, 'products').then(function(products) {
    if (products.length < filter.page_size) {
      fetchMoreItems.status = 2;
    }
  });;

  // START: FILTER SELECTION

  $scope.possibleGenders = [];

  api.attribute.get(1).then(function(genders) {
    $scope.possibleGenders = genders.values;
  });

  $scope.possibleColors = [];

  api.attribute.get(4).then(function(colors) {
    $scope.possibleColors = colors.values;
  });


  $scope.possibleAges = [];

  api.attribute.get(2).then(function(ages) {
    $scope.possibleAges = ages.values;
  });

  $scope.possibleOcations = [];

  api.attribute.get(3).then(function(ocations) {
    $scope.possibleOcations = ocations.values;
  });

  $scope.possibleBrands = [];

  api.attribute.get(9).then(function(brands) {
    $scope.possibleBrands = brands.values;
  });


  $scope.attributeChanged = function() {
    filter.page = 1;
    $scope.fetchMoreItems.status = 0;
    api.product.find(filter).thenSet($scope, 'products').then(function(products) {
      if (products.length < filter.page_size) {
        fetchMoreItems.status = 2;
      }
    });
  }

  $scope.priceOrder = [
    { title: 'Menor precio' , sort_order:'asc' },
    { title: 'Mayor precio' , sort_order:'desc' }
  ];

  $scope.orderActivated = function () {
    filter.sort_key = 'precio',
    $scope.attributeChanged()
  }

  if ($routeParams.categoryId != null) {
    $scope.removeCategory = function() {
      filter.category = '';
      $scope.attributeChanged();
    }

    if (filter.category != '') {
      api.category.get(filter.category.id).thenSet($scope, 'categoryName').then(function() {});
    }
  } else {
    $scope.removeName = function() {
      filter.name = '';
      $scope.attributeChanged();
    }
  }

  /// END: FILTER SELECTION

  $scope.fetchMoreItems = {
    status: 0,
    message: 'Ver más'
  }

  var fetchMoreItems = $scope.fetchMoreItems;

  var fetchAdditionalItems = function() {

    filter.page = filter.page + 1;

    fetchMoreItems.status = 1;
    fetchMoreItems.message = 'Cargando...';

    api.product.find(filter).
    then(function(products) {
      products.forEach(function(product) {
        $scope.products.push(product);
      });

      fetchMoreItems.status = 0;
      fetchMoreItems.message = 'Ver más';

      if (products.length < filter.page_size) {
        fetchMoreItems.status = 2;
      }

    }).catch(function(error) {
      console.log("Error");
    });
  }

  $scope.onClickFetchMoreItems = function() {
    fetchAdditionalItems();
  }

  $scope.moreItemsButtonDisabled = function() {
    if (fetchMoreItems.status == 0)
      return true;

    return false;
  }

});


app.controller('FaqCtrl', function($scope) {

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

app.controller('ProductListController', function($scope, cart, session) {

  $scope.loggedIn = session.is_logged_in();

  $scope.addToCart = function(product) {

    $scope.loading = true;

    cart.add(product, 1)
      .catchSet($scope, 'error')
      .finallySet($scope, 'loading', false);
  }

});

/*
$scope.$on('session.change', function() {
    if (session.is_logged_in()) {
      console.log("Logged in");
    }
});*/
