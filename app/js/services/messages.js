
app.factory('m', function() {
  var m = {
    generic          : "Ha ocurrido un error interno. Disculpe",
    invalid_password : "La contraseña debe tener entre 8 y 15 caracteres alfanuméricos",
    invalid_email    : "El e-mail ingresado no es válido. Use uno que tenga entre 6 y 15 caracteres",
    rejected_login   : "Las credenciales ingresadas son incorrectas",
  }

  var byCode = {
    001: m.generic,
    002: m.generic,
    003: m.generic,
    100: m.generic,
    101: m.rejected_login,
    103: m.generic,
    104: m.invalid_email,
    105: m.invalid_password,
  }

  var prototype = {
    fromApi: function(code) {
      return byCode[code];
    }
  }

  return angular.extend(Object.create(prototype), m);
})
