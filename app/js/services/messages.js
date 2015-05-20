
app.factory('messages', function() {
  var m = {
    generic          : "Ha ocurrido un error interno. Disculpe",
    invalid_email    : "El e-mail ingresado no es válido. Use uno que tenga entre 6 y 15 caracteres",
    invalid_password : "La contraseña debe tener entre 8 y 15 caracteres alfanuméricos",
    invalid_name     : "Su nombre tiene más de 80 caracteres. Use un apodo",
    rejected_login   : "Las credenciales ingresadas son incorrectas",
    repeated_email   : "Ese e-mail ya está registrado",
    repeated_dni     : "Ese DNI ya está registrado",
  }

  var byCode = {
    101: m.rejected_login,
    104: m.invalid_email,
    105: m.invalid_password,
    106: m.invalid_name,
    109: m.invalid_dni,
    110: m.invalid_email,
    200: m.repeated_email,
    201: m.repeated_dni,
  }

  var prototype = {
    fromApi: function(code) {
      return byCode[code] || m.generic;
    }
  }

  return angular.extend(Object.create(prototype), m);
})
