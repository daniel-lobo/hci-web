app.factory('validate', function() {
  var validate = {};

  validate.name = function(name) {
    if (! name) return 'invalid';
    if (name.length > 80) return 'very invalid';
    return 'valid';
  }

  validate.dni = function(dni) {
    if (! dni) return 'invalid';

    if ((/[^0-9.]/).test(dni))
      return 'very invalid';

    dni = dni.replace(/[^0-9]/g, '');

    if (dni.length > 8) return 'very invalid';
    if (dni.length < 8) return 'invalid';

    return 'valid';
  }

  validate.password = function(password) {
    password = password || '';

    var alphanum  = password.length == 0 || (/^[a-z0-9]+$/i).test(password);
    var too_long  = (password.length > 15);
    var too_short = (password.length < 8);

    if (! alphanum || too_long)
      return 'very invalid';
    else if (too_short)
      return 'invalid';
    else
      return 'valid';
  }

  validate.password2 = function(password2, password) {
    if (! password2) return 'invalid';
    if (password2 !== password) return 'very invalid';
    return validate.password(password2);
  }

  validate.email = function(email) {
    if (! email)
      return 'invalid';

    var has_strange_characters = !! email.match(/[\"\^\&\*\=\?\!]/)
    var has_many_at_symbols    = (email.match(/@/g) || []).length > 1

    if (has_strange_characters || has_many_at_symbols)
      return 'very invalid';

    return 'valid';
  }

  return validate;
})
