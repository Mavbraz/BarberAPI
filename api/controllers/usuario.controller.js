"use strict";

const auth = require("../helpers/auth.helper");
const db = require("../helpers/db.helper");
const response = require("../helpers/response.helper");

module.exports = {
  registerPost: registerPost,
  loginPost: loginPost
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
      return response.sendSuccess(res, { message: "User registered" });
    } else {
      return response.sendDefaultError(res, { message: result.message });
    }
  });
}

function loginPost(req, res, next) {
  const authentication = req.swagger.params['authentication'].value;

  if (authentication.email === undefined || authentication.senha === undefined) {
    return response.sendDefaultError(res, { message: "Error: 'email' and 'senha' are required" });
  }

  auth.issueToken(authentication, function(result) {
    if (!(result instanceof Error)) {
      return response.sendSuccess(res, { token: result });
    } else {
      return response.sendResponse(res, 403, { message: result.message });
    }
  });
};