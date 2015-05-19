var ROOT = 'http://eiffel.itba.edu.ar/hci/service3'


function attributesToObject(attributes) {
  var object = {};

  angular.forEach(attributes, function(key, value) {
    object[key.name] = key.values;
  })

  return object;
}


function buildProduct(data) {
  if (! data.id)
    data = data.product;

  var product = {
    id      : data.id,
    name    : data.name,
    price   : data.price,
    images  : data.imageUrl,
    category: data.category
  }

  if (data.attributes) {
    var attrs = attributesToObject(data.attributes)

    product.color    = (attrs.Color || [])[0];
    product.ages     = attrs.Edad;
    product.genders  = attrs.Genero;
    product.brand    = (attrs.Marca || [])[0];
    product.is_new   = !!attrs.Nuevo;
    product.is_offer = !!attrs.Oferta;

    for (var attr in attrs)
      if (attr.startsWith('Talle-'))
        product.sizes = attrs[attr];
  }

  return product;
}


function buildProductList(data) {
  return data.products.map(buildProduct);
  // return {
  //   page    : data.page,
  //   per_page: data.pageSize,
  //   total   : data.total,
  //   products: data.products.map(buildProduct)
  // }
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
  return data.subcategories.map(buildCategory);
}

function buildSession(data) {
  return {
    profile      : data.account,
    token        : data.authenticationToken,
    cart_order_id: null
  }
}

function buildPreferences(data) {
  return data.preferences || {};
}

function buildAddress(data) {
  return data.address;
}

function buildAddressList(data) {
  return data.addresses;
}

function buildCreditCard(data) {
  return data.creditCard;
}

function buildCreditCardList(data) {
  return data.creditCards;
}

function buildOrder(data) {
  if (data.order)
    data = data.order;

  if (data.items)
    data.items = data.items.map(buildOrderItem);

  data.status = {
    1: 'unconfirmed',
    2: 'confirmed',
    3: 'sent',
    4: 'received'
  }[data.status];

  return data;
}

function buildOrderList(data) {
  return data.orders.map(buildOrder);
}

function buildOrderItem(data) {
  if (data.orderItem)
    data = data.orderItem;

  data.product.price = data.price;
  delete data.price;

  data.product.images = [data.product.imageUrl];
  delete data.product.imageUrl;
  return data;
}


app.factory('api', function($http, $rootScope, $q, session) {
  // Endpoints:
  function endpoint(options) {
    var url      = ROOT + options.url;
    var after    = options.after || function(data) { return data };
    var auth     = options.auth;
    var defaults = options.defaults || {};

    return function(params) {
      params = angular.merge({}, defaults, params);

      if (auth) {
        angular.merge(params, {
          username: session.profile.username,
          authentication_token: session.token
        })
      }

      return $http.get(url, { params: params })
        .catch(function(error) {
          raise({ code: -error.status, message: "HTTP Error", data: error.data });

        }).then(function(response) {
          if (response.data.error)
            raise(response.data.error);

          return after(response.data);
        })
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
  })

  var e_product = endpoint({
    url     : '/Catalog.groovy?method=GetProductById',
    after   : buildProduct
  })

  var e_products_by_category = endpoint({
    url     : '/Catalog.groovy?method=GetProductsByCategoryId',
    after   : buildProductList,
    defaults: { page_size: 1000 }
  })

  var e_products_by_name = endpoint({
    url     : '/Catalog.groovy?method=GetProductsByName',
    after   : buildProductList,
    defaults: { page_size: 1000 }
  })

  var e_products = endpoint({
    url     : '/Catalog.groovy?method=GetAllProducts',
    after   : buildProductList,
    defaults: { page_size: 1000 }
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

  var e_addresses = endpoint({
    url     : '/Account.groovy?method=GetAllAddresses',
    auth    : true,
    after   : buildAddressList,
    defaults: { page_size: 1000 }
  })

  var e_create_address = endpoint({
    url  : '/Account.groovy?method=CreateAddress',
    auth : true,
    after: buildAddress,
  })

  var e_delete_address = endpoint({
    url : '/Account.groovy?method=DeleteAddress',
    auth: true
  })

  var e_create_card = endpoint({
    url  : '/Account.groovy?method=CreateCreditCard',
    auth : true,
    after: buildCreditCard
  })

  var e_cards = endpoint({
    url     : '/Account.groovy?method=GetAllCreditCards',
    auth    : true,
    after   : buildCreditCardList,
    defaults: { page_size: 1000 }
  })

  var e_delete_card = endpoint({
    url  : '/Account.groovy?method=DeleteCreditCard',
    auth : true
  })

  var e_create_order = endpoint({
    url  : '/Order.groovy?method=CreateOrder',
    auth : true,
    after: buildOrder
  })

  var e_orders = endpoint({
    url  : '/Order.groovy?method=GetAllOrders',
    auth : true,
    after: buildOrderList
  })

  var e_order = endpoint({
    url  : '/Order.groovy?method=GetOrderById',
    auth : true,
    after: buildOrder
  })

  var e_delete_order = endpoint({
    url : '/Order.groovy?method=DeleteOrder',
    auth: true
  })

  var e_add_to_order = endpoint({
    url  : '/Order.groovy?method=AddItemToOrder',
    auth : true,
    after: buildOrderItem
  })

  var e_remove_from_order = endpoint({
    url : '/Order.groovy?method=RemoveItemFromOrder',
    auth: true
  })

  var e_confirm_order = endpoint({
    url : '/Order.groovy?method=ConfirmOrder',
    auth: true
  })

  // Service object:
  var api = {};

  api.category = {
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
  };

  api.product = {
    get: function(id) {
      return e_product({ id: id });
    },

    find: function(criteria) {
      if (! criteria)
        return e_products();

      if (criteria.ctaegory && criteria.name)
        throw new Error("Can't search both by name and category");

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

      var query = {
        filters: JSON.stringify(filters),
        page_size: criteria.page_size,
        page: criteria.page
      }

      if (criteria.category) {
        query.id = criteria.category.id;
        return e_products_by_category(query);

      } else if (criteria.name) {
        query.name = criteria.name
        return e_products_by_name(query);

      } else
        return e_products(query);
    }
  };

  api.user = {
    login: function(credentials) {
      return e_login(credentials).thenExtend(session);
    },

    logout: function() {
      return e_logout().thenClear(session);
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
      var profile = angular.merge({}, session.profile, changes);
      return e_update({ account: profile }).thenExtend(session.profile, profile);
    },
  };

  api.preferences = {
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
  };

  api.address = {
    add: function(name) {
      address = {
        name       : name,
        street     : "Av. Eduardo Madero",
        number     : "399",
        province   : "C",
        zipCode    : "C1106ACD",
        phoneNumber: "6393-ITBA",
      }

      return e_create_address({ address: address }).get('id', 'name');
    },

    all: function() {
      return e_addresses().mapGet('id', 'name')
    },

    remove: function(address) {
      return e_delete_address({ id: address.id });
    }
  };

  api.card = {
    add: function(card) {
      return e_create_card({ credit_card: card });
    },

    all: e_cards,

    remove: function(card) {
      return e_delete_card({ id: card.id });
    }
  };

  api.order = {
    add: e_create_order,

    all: e_orders,

    get: function(id) {
      return e_order({ id: id });
    },

    remove: function(order) {
      return e_delete_order({ id: order.id });
    },

    addProduct: function(order, product, quantity) {
      var item = {
        order   : { id: order.id },
        product : { id: product.id },
        quantity: quantity || 1
      }

      return e_add_to_order({ order_item: item });
    },

    removeItem: function(item) {
      return e_remove_from_order({ id: item.id });
    },

    confirm: function(order, address, card) {
      return e_confirm_order({
        order:{
          id        : order.id,
          address   : { id: address.id },
          creditCard: { id: card.id }
        }
      });
    }
  }

  return api;
});

app.controller('testCtrl', function($scope, api) {
    // $scope.categories = api.products.find({ category: 2 });
    //
    // api.user.login({ username: 'testuser3', password: 'asdf1234' })
    // .then(function() {
      // return api.user.logout();

      // api.user.update({
      //   gender: 'F'
      // })

      // api.preferences.set({});
      // api.preferences.change(function(prefs) {})

      // api.address.add('Coronel Diaz 1725').then(function() {
      // });
      // api.address.remove({ id: 761 }) //.thenSet($scope, 'addresses').catchSet($scope, 'addresses')
      // api.address.all().thenSet($scope, 'addresses');
    //   api.address.add({
    //     "number": "4512340987123409",
    //     "expirationDate": "1015",
    //     "securityCode": "399"
    //   }).thenSet($scope, 'addresses');

        // api.card.add({
        //   "number": "4512340987123401",
        //   "expirationDate": "1015",
        //   "securityCode": "399"
        // });
        //
        // console.log(api)
        // api.address.all().thenSet($scope, 'addresses').catchSet($scope, 'addresses')
        // api.card.all().thenSet($scope, 'cards').catchSet($scope, 'cards');
        // // api.order.add().thenSet($scope, 'order');
        // api.order.all().thenSet($scope, 'order')
        // api.order.remove({ id: 1734 })
    // });


    api.user.login({ username: 'testuser3', password: 'asdf1234' })
    .then(function() {
      api.address.all().thenSet($scope, 'addresses');

      api.order.all().then(function(orders) {
        return api.order.get(orders[0].id);

      }).thenSet($scope, 'order')

      .then(function() {
          return api.product.find({ page_size: 1 }).thenSet($scope, 'products')

      }).then(function() {
          api.order.addProduct($scope.order, $scope.products[0], 2);
      });

    });

    // api.products.find().thenSet($scope, 'products');
    // api.category.all().thenSet($scope, 'categories');
    // api.category.all().thenSet($scope, 'categories');

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
