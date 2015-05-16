
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


function createEndpoint($resource, options) {
  var url     = options.url || ''
  var method  = options.method || 'get';
  var after   = options.after || function(body) { return body };
  var before  = options.before || function(body) { return body };
  var params  = options.params || {};

  var actions = {};

  actions[method] = {
    method: method,

    transformRequest: before,

    transformResponse: function(body, headers) {
      var data = JSON.parse(body);

      if (data.error)
        raise(data.error);

      return after(data);
    }
  }

  var resource = $resource(url, params, actions);
  return resource[method].bind(resource);
}


app.factory('api', function($resource, $rootScope, $http) {
  // Endpoints:
  function endpoint(method, url, transform) {
    return createEndpoint($resource, method, url, transform)
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
        return api.session = e_login(credentials);
      },

      logout: function() {
        return e_logout({
          username: api.session.username,
          authentication_token: api.sesssion.authenticationToken
        });
      },

      signup: function(profile) {
        e_signup({ account: profile }).$promise.then(function(account) {
          return e_login({
            username: profile.username,
            password: profile.password
          }).$promise

        }).then(function(account) {
            angular.extend(api.session, account);

        }).catch (function (error) {

        });

        return api.session
      },

      update: function(profile) {

      }
    }
  }
});

app.controller('testCtrl', function($scope, api) {
    // $scope.api.user.login({ username: 'a', password: 'b' }).$promise
    // $scope.categories = api.products.find({ category: 2 });

    $scope.session = api.session;

    api.user.signup({
      "username": "testuser3",
      "password": "asdf1234",
      "firstName": "jane",
      "lastName": "doe",
      "gender": "F",
      "identityCard": "22222337",
      "email": "jane@doe.com",
      "birthDate": "1980-01-01"
    });
  }
);
