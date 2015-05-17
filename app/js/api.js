
var ROOT='http://eiffel.itba.edu.ar/hci/service3'


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
  var attrs = attributesToObject(data.attributes);

  return {
    id    : data.id,
    name  : data.name,
    genres: attrs.Genero,
    ages  : attrs.Edad
  }
}


function buildCategoryList(data, headers) {
  return { categories: data.categories.map(buildCategory) };
}


function buildSession(data) {
  var account = data.account || {};
  account.token = data.authenticationToken;
  account.error = data.error;
  return account;
}


app.factory('api', function($http, $rootScope, $http) {
  // Endpoints:
  function endpoint(options) {
    var url    = options.url
    var after  = options.after || function(data) { return data };
    var params = options.params || {};

    return function(params) {
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

  var e_categories = endpoint({
    url  : ROOT + '/Catalog.groovy?method=GetAllCategories',
    after: buildCategoryList
  })

  var e_products_by_category = endpoint({
    url  : ROOT + '/Catalog.groovy?method=GetProductsByCategoryId',
    after: buildProductList
  })

  var e_products = endpoint({
    url  : ROOT + '/Catalog.groovy?method=GetAllProducts',
    after: buildProductList
  })

  var e_login = endpoint({
    url  : ROOT + '/Account.groovy?method=SignIn',
    after: buildSession
  })

  var e_logout = endpoint({
    url: ROOT + '/Account.groovy?method=SignOut',
  })

  var e_signup = endpoint({
    url  : ROOT + '/Account.groovy?method=CreateAccount',
    after: buildSession
  })

  var e_update = endpoint({
    url: '/Account.groovy?method=UpdateAccount'
  })

  // Service object:
  return api = {
    session: {},

    categories: {
      all: e_categories
    },

    products: {
      find: function(criteria) {
        var filters = [];

        if (criteria.genre)
          filters.push({ id: 1, value: criteria.genre });

        if (criteria.age)
          filters.push({ id: 2, value: criteria.age });

        if (criteria.color)
          filters.push({ id: 4, value: criteria.color });

        if (criteria.brand)
          filters.push({ id: 9, value: criteria.brand });

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
        return e_logout({
          username: api.session.username,
          authentication_token: api.session.token

        }).thenClear(api.session);
      },

      signup: function(profile) {
        return e_signup({ account: profile }).then(function(account) {
          return e_login({
            username: profile.username,
            password: profile.password
          })

        }).thenExtend(api.session);
      },
    }
  }
});

app.controller('testCtrl', function($scope, api, $q) {
    // $scope.categories = api.products.find({ category: 2 });

    $scope.session = api.session;

    console.log('before login', api.session)
    api.user.login({ username: 'testuser3', password: 'asdf1234' })
    .then(function(x) {
      console.log('before logout', api.session)
      return api.user.logout();
    })
    .then(function(x) {
      console.log('after logout', api.session)
    })

    // api.products.find({ category: 1 }).thenSet($scope, 'products');
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
