"use strict";

const db = require("../helpers/db.helper");
const response = require("../helpers/response.helper");

module.exports = {
  registerPost: registerPost
}

function registerPost(args, res, next) {
  const email = args.body.email;
  const password = args.body.senha;
  const cargo = args.body.cargo;

  if (email === undefined || password === undefined || cargo === undefined) {
    return response.sendDefaultError(res, { message: "Error: 'email', 'senha' and 'cargo' are required" });
  }

  if (!args.swagger.operation["x-security-scopes"].includes(cargo.toLowerCase())) {
    return response.sendDefaultError(res, { message: "Error: 'cargo' needs be either 'FUNCIONARIO' and 'CLIENTE'" });
  }

  db.registrar(email, password, cargo, function(result) {
    if (!(result instanceof Error)) {
      return response.sendSuccess(res, { message: "User registered." });
    } else {
      return response.sendDefaultError(res, { message: result.message });
    }
  });
}