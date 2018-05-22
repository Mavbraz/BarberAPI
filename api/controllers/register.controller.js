"use strict";

const db = require("../helpers/db.helper");
const response = require("../helpers/response.helper");

module.exports = {
  registerPost: registerPost
}

function registerPost(req, res, next) {
  const registration = req.swagger.params['registration'].value;

  if (registration.email === undefined || registration.senha === undefined || registration.cargo === undefined) {
    return response.sendDefaultError(res, { message: "Error: 'email', 'senha' and 'cargo' are required" });
  }

  if (registration.cargo.toUpperCase() != "FUNCIONARIO" && registration.cargo.toUpperCase() != "CLIENTE") {
    return response.sendDefaultError(res, { message: "Error: 'cargo' needs be either 'FUNCIONARIO' and 'CLIENTE'" });
  }

  db.registrarUsuario(registration, function(result) {
    if (!(result instanceof Error)) {
      return response.sendSuccess(res, { message: "User registered." });
    } else {
      return response.sendDefaultError(res, { message: result.message });
    }
  });
}