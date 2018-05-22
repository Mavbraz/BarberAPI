"use strict";

const auth = require("../helpers/auth.helper");
const db = require("../helpers/db.helper");
const response = require("../helpers/response.helper");

module.exports = {
  registerPost: registerPost,
  loginPost: loginPost,
  usuarioIdPut: usuarioIdPut,
  usuarioIdDelete: usuarioIdDelete
}

function registerPost(req, res, next) {
  const user = req.swagger.params['user'].value;

  if (user.email === undefined || user.senha === undefined || user.cargo === undefined) {
    return response.sendDefaultError(res, { message: "Error: 'email', 'senha' and 'cargo' are required" });
  }

  if (user.cargo.toUpperCase() != "FUNCIONARIO" && user.cargo.toUpperCase() != "CLIENTE") {
    return response.sendDefaultError(res, { message: "Error: 'cargo' needs be either 'FUNCIONARIO' and 'CLIENTE'" });
  }

  db.registrarUsuario(user, function(result) {
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

function usuarioIdPut(req, res, next) {
  const id = req.swagger.params['id'].value;
  var user = req.swagger.params['user'].value;

  if (user.email === undefined || user.senha === undefined || user.cargo === undefined) {
    return response.sendDefaultError(res, { message: "Error: 'email', 'senha' and 'cargo' are required" });
  }

  if (user.cargo.toUpperCase() != "FUNCIONARIO" && user.cargo.toUpperCase() != "CLIENTE") {
    return response.sendDefaultError(res, { message: "Error: 'cargo' needs be either 'FUNCIONARIO' and 'CLIENTE'" });
  }

  user.id = id;

  db.atualizarUsuario(user, function(result) {
    if (!(result instanceof Error)) {
      if (result.affectedRows > 0) {
        return response.sendSuccess(res, { message: "User updated" });
      } else {
        return response.sendDefaultError(res, { message: "User not found" });
      }
    } else {
      return response.sendDefaultError(res, { message: result.message });
    }
  });
};

function usuarioIdDelete(req, res, next) {
  const id = req.swagger.params['id'].value;

  db.removerUsuario(id, function(result) {
    if (!(result instanceof Error)) {
      if (result.affectedRows > 0) {
        return response.sendSuccess(res, { message: "User deleted" });
      } else {
        return response.sendDefaultError(res, { message: "User not found" });
      }
    } else {
      return response.sendDefaultError(res, { message: result.message });
    }
  });
}