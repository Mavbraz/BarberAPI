"use strict";

const auth = require("../helpers/auth.helper");
const db = require("../helpers/db.helper");
const response = require("../helpers/response.helper");

module.exports = {
    registrarUsuario: registrarUsuario,
    loginUsuario: loginUsuario,
    atualizarUsuario: atualizarUsuario,
    bloquearUsuario: bloquearUsuario,
    desbloquearUsuario: desbloquearUsuario
}

function registrarUsuario(req, res, next) {
    var registration = req.swagger.params['registration'].value;

    if (req.swagger.apiPath === "/usuario/registrar/cliente") {
        registration.cargo = "CLIENTE";
    } else if (req.swagger.apiPath === "/usuario/registrar/funcionario") {
        registration.cargo = "FUNCIONARIO";
    }

    if (registration.nome === undefined || registration.cpf === undefined || registration.email === undefined || registration.senha === undefined || registration.cargo === undefined) {
        return response.sendDefaultError(res, { message: "Error: 'nome', 'cpf', 'email', 'senha' and 'cargo' are required" });
    }

    if (registration.cpf.length != 11) {
        return response.sendDefaultError(res, { message: "Error: 'cpf' must have 11 characters" });
    }

    if (registration.cargo.toUpperCase() != "FUNCIONARIO" && registration.cargo.toUpperCase() != "CLIENTE") {
        return response.sendDefaultError(res, { message: "Error: 'cargo' needs be either 'FUNCIONARIO' and 'CLIENTE'" });
    }

    db.registrarUsuario(registration, function (result) {
        if (!(result instanceof Error)) {
            auth.issueToken(registration, false, function (result) {
                if (!(result instanceof Error)) {
                    return response.sendSuccess(res, { token: result.token, cargo: result.cargo });
                } else {
                    return response.sendResponse(res, 403, { message: result.message });
                }
            });
            //return response.sendSuccess(res, { message: "User registered" });
        } else {
            return response.sendDefaultError(res, { message: result.message });
        }
    });
}

function loginUsuario(req, res, next) {
    const authentication = req.swagger.params['authentication'].value;

    if (authentication.email === undefined || authentication.senha === undefined) {
        return response.sendDefaultError(res, { message: "Error: 'email' and 'senha' are required" });
    }

    auth.issueToken(authentication, req.swagger.apiPath === "/usuario/login/cliente", function (result) {
        if (!(result instanceof Error)) {
            return response.sendSuccess(res, { token: result.token, cargo: result.cargo });
        } else {
            return response.sendResponse(res, 403, { message: result.message });
        }
    });
};

function atualizarUsuario(req, res, next) {
    var updateUser = req.swagger.params['updateUser'].value;

    if (req.swagger.apiPath === "/usuario") {
        user.email = req.auth.sub;
    } else {
        user.email = req.swagger.params['email'].value;
    }

    if (updateUser.email === undefined || updateUser.nome === undefined || user.senha === undefined) {
        return response.sendDefaultError(res, { message: "Error: 'email', 'nome' and 'senha' are required" });
    }

    db.atualizarUsuario(user, function (result) {
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

function bloquearUsuario(req, res, next) {
    const email = req.swagger.params['email'].value;

    db.removerUsuario(email, function (result) {
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

function desbloquearUsuario(req, res, next) {
    const email = req.swagger.params['email'].value;

    db.desbloquearUsuario(email, function (result) {
        if (!(result instanceof Error)) {
            if (result.affectedRows > 0) {
                return response.sendSuccess(res, { message: "User unlocked" });
            } else {
                return response.sendDefaultError(res, { message: "User not found" });
            }
        } else {
            return response.sendDefaultError(res, { message: result.message });
        }
    });
}