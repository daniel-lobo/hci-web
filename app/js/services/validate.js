app.factory('validate', function() {
  var validate = {};

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
