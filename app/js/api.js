function attributesToObject(attributes) {
  object = {};

  angular.forEach(attributes, function(key, value) {
    object[key.name] = key.values;
  })

  return object;
}

function resToCategory(data) {
  attrs = attributesToObject(data.attributes);

  id     = data.id;
  name   = data.name;
  genres = attrs.Genero;
  ages   = attrs.Edad;

  return new Category(id, name, genres, ages);
}

function resToCategories(body, headers) {
  return { all: body.categories.map(resToCategory) }
}


app.factory('Categories', [ '$resource', function($resource) {
  Url = {
    ALL: 'http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetAllCategories'
  }

  return {

    all: $resource(
      Url.ALL, { callback: 'JSON_CALLBACK' }, {
        get: { method: 'JSONP', transformResponse: resToCategories }
      }
    )

  }
}]);

app.controller('testCtrl', ['$scope', 'Categories',
  function($scope, Categories) {
    $scope.categories = Categories.all.get();
  }
]);
