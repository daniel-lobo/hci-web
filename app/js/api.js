var ROOT = 'http://eiffel.itba.edu.ar/hci/service3'


function attributesToObject(attributes) {
  var object = {};

  angular.forEach(attributes, function(key, value) {
    object[key.name] = key.values;
  })

  return object;
}


function buildProduct(data) {
  return {
    id      : data.id,
    name    : data.name,
    price   : data.price,
    images  : data.imageUrl,
    category: data.category.id
  }
}


function buildProductList(data) {
  return {
    page    : data.page,
    per_page: data.pageSize,
    total   : data.total,
    products: data.products.map(buildProduct)
  }
}


function buildCategory(data) {
  if (! data.id)
    data = data.category // hack alert

  var attrs = attributesToObject(data.attributes);

  return {
    id     : data.id,
    name   : data.name,
    genders: attrs.Genero,
    ages   : attrs.Edad
  }
}


function buildCategoryList(data) {
  return data.categories.map(buildCategory);
}

function buildSubcategoryList(data) {
  console.log(data);
  return data.subcategories.map(buildCategory);
}

function buildSession(data) {
  var account = data.account || {};
  account.token = data.authenticationToken;
  account.error = data.error;
  return account;
}

function buildPreferences(data) {
  return data.preferences || {};
}


app.factory('api', function($http, $rootScope, $q) {
  var api;

  // Endpoints:
  function endpoint(options) {
    var url    = ROOT + options.url;
    var after  = options.after || function(data) { return data };
    var params = options.params || {};
    var auth   = options.auth;

    return function(params) {
      if (auth) {
        params = angular.merge({}, params, {
          username: api.session.username,
          authentication_token: api.session.token
        })
      }

      return $http.get(url, { params: params })
        .then(function(response) {
          if (response.data.error)
            raise(response.data.error);

          return after(response.data);
        })

        .catch(function(response) {
          raise({ code: -response.status, reason: "HTTP Error" });
        });
    }
  }

  var e_category = endpoint({
      url  : '/Catalog.groovy?method=GetCategoryById',
      after: buildCategory
  })


  var e_categories = endpoint({
    url  : '/Catalog.groovy?method=GetAllCategories',
    after: buildCategoryList
  })

  var e_subcategories = endpoint({
    url  : '/Catalog.groovy?method=GetAllSubcategories',
    after: buildSubcategoryList
  });

  var e_products_by_category = endpoint({
    url  : '/Catalog.groovy?method=GetProductsByCategoryId',
    after: buildProductList
  })

  var e_products = endpoint({
    url  : '/Catalog.groovy?method=GetAllProducts',
    after: buildProductList
  })

  var e_signup = endpoint({
    url  : '/Account.groovy?method=CreateAccount',
    after: buildSession
  })

  var e_login = endpoint({
    url  : '/Account.groovy?method=SignIn',
    after: buildSession
  })

  var e_logout = endpoint({
    url : '/Account.groovy?method=SignOut',
    auth: true
  })

  var e_update = endpoint({
    url : '/Account.groovy?method=UpdateAccount',
    auth: true
  })

  var e_get_preferences = endpoint({
    url  : '/Account.groovy?method=GetPreferences',
    auth : true,
    after: buildPreferences
  })

  var e_set_preferences = endpoint({
    url : '/Account.groovy?method=UpdatePreferences',
    auth: true
  })

  // Service object:
  return api = {
    session: {},

    categories: {
      all: function() {
        var categories;

        return e_categories().then(function(result) {
          categories = result;

          promises = result.map(function(category) {
            return e_subcategories({ id: category.id });
          })

          return $q.all(promises);

        }).then(function(result) {
          result.map(function(subcategories, index) {
            categories[index].subcategories = subcategories;
          })

          return categories;
        })
      },

      get: function(id) {
        var category;

        return e_category({ id: id }).then(function(result) {
          category = result;
          return e_subcategories({ id: id });

        }).then(function(result) {
          category.subcategories = result;
          return category;
        });
      }
    },

    products: {
      find: function(criteria) {
        var filters = [];

        if (criteria.gender)
          filters.push({ id: 1, value: criteria.gender });

        if (criteria.age)
          filters.push({ id: 2, value: criteria.age });

        if (criteria.color)
          filters.push({ id: 4, value: criteria.color });

        if (criteria.brand)
          filters.push({ id: 9, value: criteria.brand });

        if (criteria.is_new)
          filters.push({ id: 6, value: 'Nuevo' })

        if (criteria.is_offer)
          filters.push({ id: 5, value: 'Oferta' })

        var sfilters = JSON.stringify(filters);

        if (criteria.category)
          return e_products_by_category({ id: criteria.category, filters: sfilters });
        else
          return e_products({ filters: sfilters });
      }
    },

    user: {
      login: function(credentials) {
        return e_login(credentials).thenExtend(api.session);
      },

      logout: function() {
        return e_logout().thenClear(api.session);
      },

      signup: function(profile) {
        return e_signup({ account: profile }).then(function() {
          return api.user.login({
            username: profile.username,
            password: profile.password
          })
        });
      },

      update: function(changes) {
        var account = angular.merge({}, api.session, changes);
        return e_update({ account: account}).thenExtend(api.session, account);
      },

      preferences: {
        get: e_get_preferences,

        set: function(prefs) {
          return e_set_preferences({ value: prefs });
        },

        change: function(makeChanges) {
          return e_get_preferences.then(function(prefs) {
            changed = makeChanges(prefs);
            return e_set_preferences(changed).then(changed);
          })
        }
      }
    }
  }
});

app.controller('testCtrl', function($scope, api) {

    // $scope.categories = api.products.find({ category: 2 });
    $scope.session = api.session;

    api.user.login({ username: 'testuser3', password: 'asdf1234' })
    .then(function() {
      // return api.user.logout();
      // api.user.update({
      //   gender: 'F'
      // })
      // api.user.preferences.set({});
      // api.user.preferences.set(
      //   {
      //     "meta":{"uuid":"99c71c58-a4e9-489e-ba2f-3e5e827fd178","time":"153.266ms"},"product":{"id":1,"name":"Pancha Coral","price":458,"imageUrl":["http://eiffel.itba.edu.ar/hci/service3/images/levis-9623-26963-1-product.jpg","http://eiffel.itba.edu.ar/hci/service3/images/levis-9627-26963-3-product.jpg","http://eiffel.itba.edu.ar/hci/service3/images/levis-9632-26963-6-product.jpg"],"category":{"id":1,"name":"Calzado"},"subcategory":{"id":1,"name":"Alpargatas"},"attributes":[{"id":4,"name":"Color","values":["Coral"]},{"id":2,"name":"Edad","values":["Adulto"]},{"id":1,"name":"Genero","values":["Femenino"]},{"id":9,"name":"Marca","values":["Levi's"]},{"id":8,"name":"Material-Calzado","values":["Lona"]},{"id":6,"name":"Nuevo","values":["Nuevo"]},{"id":3,"name":"Ocasion","values":["Casual"]},{"id":5,"name":"Oferta","values":["Oferta"]},{"id":7,"name":"Talle-Calzado","values":["35","37","39","40"]}]},
      //     "meta2":{"uuid":"99c71c58-a4e9-489e-ba2f-3e5e827fd178","time":"153.266ms"},"product2":{"id":1,"name":"Pancha Coral","price":458,"imageUrl":["http://eiffel.itba.edu.ar/hci/service3/images/levis-9623-26963-1-product.jpg","http://eiffel.itba.edu.ar/hci/service3/images/levis-9627-26963-3-product.jpg","http://eiffel.itba.edu.ar/hci/service3/images/levis-9632-26963-6-product.jpg"],"category":{"id":1,"name":"Calzado"},"subcategory":{"id":1,"name":"Alpargatas"},"attributes":[{"id":4,"name":"Color","values":["Coral"]},{"id":2,"name":"Edad","values":["Adulto"]},{"id":1,"name":"Genero","values":["Femenino"]},{"id":9,"name":"Marca","values":["Levi's"]},{"id":8,"name":"Material-Calzado","values":["Lona"]},{"id":6,"name":"Nuevo","values":["Nuevo"]},{"id":3,"name":"Ocasion","values":["Casual"]},{"id":5,"name":"Oferta","values":["Oferta"]},{"id":7,"name":"Talle-Calzado","values":["35","37","39","40"]}]},
      //     "meta3":{"uuid":"99c71c58-a4e9-489e-ba2f-3e5e827fd178","time":"153.266ms"},"product3":{"id":1,"name":"Pancha Coral","price":458,"imageUrl":["http://eiffel.itba.edu.ar/hci/service3/images/levis-9623-26963-1-product.jpg","http://eiffel.itba.edu.ar/hci/service3/images/levis-9627-26963-3-product.jpg","http://eiffel.itba.edu.ar/hci/service3/images/levis-9632-26963-6-product.jpg"],"category":{"id":1,"name":"Calzado"},"subcategory":{"id":1,"name":"Alpargatas"},"attributes":[{"id":4,"name":"Color","values":["Coral"]},{"id":2,"name":"Edad","values":["Adulto"]},{"id":1,"name":"Genero","values":["Femenino"]},{"id":9,"name":"Marca","values":["Levi's"]},{"id":8,"name":"Material-Calzado","values":["Lona"]},{"id":6,"name":"Nuevo","values":["Nuevo"]},{"id":3,"name":"Ocasion","values":["Casual"]},{"id":5,"name":"Oferta","values":["Oferta"]},{"id":7,"name":"Talle-Calzado","values":["35","37","39","40"]}]},
      //     "meta4":{"uuid":"99c71c58-a4e9-489e-ba2f-3e5e827fd178","time":"153.266ms"},"product4":{"id":1,"name":"Pancha Coral","price":458,"imageUrl":["http://eiffel.itba.edu.ar/hci/service3/images/levis-9623-26963-1-product.jpg","http://eiffel.itba.edu.ar/hci/service3/images/levis-9627-26963-3-product.jpg","http://eiffel.itba.edu.ar/hci/service3/images/levis-9632-26963-6-product.jpg"],"category":{"id":1,"name":"Calzado"},"subcategory":{"id":1,"name":"Alpargatas"},"attributes":[{"id":4,"name":"Color","values":["Coral"]},{"id":2,"name":"Edad","values":["Adulto"]},{"id":1,"name":"Genero","values":["Femenino"]},{"id":9,"name":"Marca","values":["Levi's"]},{"id":8,"name":"Material-Calzado","values":["Lona"]},{"id":6,"name":"Nuevo","values":["Nuevo"]},{"id":3,"name":"Ocasion","values":["Casual"]},{"id":5,"name":"Oferta","values":["Oferta"]},{"id":7,"name":"Talle-Calzado","values":["35","37","39","40"]}]},
      //     "meta5":{"uuid":"99c71c58-a4e9-489e-ba2f-3e5e827fd178","time":"153.266ms"},"product5":{"id":1,"name":"Pancha Coral","price":458,"imageUrl":["http://eiffel.itba.edu.ar/hci/service3/images/levis-9623-26963-1-product.jpg","http://eiffel.itba.edu.ar/hci/service3/images/levis-9627-26963-3-product.jpg","http://eiffel.itba.edu.ar/hci/service3/images/levis-9632-26963-6-product.jpg"],"category":{"id":1,"name":"Calzado"},"subcategory":{"id":1,"name":"Alpargatas"},"attributes":[{"id":4,"name":"Color","values":["Coral"]},{"id":2,"name":"Edad","values":["Adulto"]},{"id":1,"name":"Genero","values":["Femenino"]},{"id":9,"name":"Marca","values":["Levi's"]},{"id":8,"name":"Material-Calzado","values":["Lona"]},{"id":6,"name":"Nuevo","values":["Nuevo"]},{"id":3,"name":"Ocasion","values":["Casual"]},{"id":5,"name":"Oferta","values":["Oferta"]},{"id":7,"name":"Talle-Calzado","values":["35","37","39","40"]}]},
      //   }
      // );

      // api.user.preferences.change(function(prefs) {})
    });
    // api.products.find({ category: 1, is_offer: true, is_new: true }).thenSet($scope, 'products');
    // api.categories.all().thenSet($scope, 'categories');
    api.categories.all().thenSet($scope, 'categories');

    // api.user.signup({
    //   "username": "testuser3",
    //   "password": "asdf1234",
    //   "firstName": "jane",
    //   "lastName": "doe",
    //   "gender": "F",
    //   "identityCard": "22222337",
    //   "email": "jane@doe.com",
    //   "birthDate": "1980-01-01"
    // });
  }
);
