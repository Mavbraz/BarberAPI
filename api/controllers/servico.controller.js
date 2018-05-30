"use strict";

const db = require("../helpers/db.helper");
const response = require("../helpers/response.helper");

module.exports = {
    visualizarServicos: visualizarServicos,
    criarServico: criarServico,
    visualizarServico: visualizarServico,
    atualizarServico: atualizarServico,
    bloquearServico: bloquearServico,
    desbloquearServico: desbloquearServico
}

function visualizarServicos(req, res, next) {
    db.visualizarServicos(function (result) {
        if (!(result instanceof Error)) {
            return response.sendSuccess(res, { total: result.length, servicos: result });
        } else {
            return response.sendDefaultError(res, { message: result.message });
        }
    });
}

function criarServico(req, res, next) {
    var service = req.swagger.params['service'].value;

    if (service.nome === undefined || service.descricao === undefined || service.valor === undefined) {
        return response.sendDefaultError(res, { message: "Error: 'nome', 'decricao' and 'valor' are required" });
    }

    if (!/^\d+(?:\.\d+)?$/.test(service.valor)) {
        return response.sendDefaultError(res, { message: "Error: 'valor' is not a currency" });
    }

    service.valor = parseFloat(service.valor).toFixed(2);

    db.criarServico(service, function (result) {
        if (!(result instanceof Error)) {
            return response.sendSuccess(res, { message: "Service registered" });
        } else {
            return response.sendDefaultError(res, { message: result.message });
        }
    });
}

function visualizarServico(req, res, next) {
    const id = req.swagger.params['id'].value;

    db.visualizarServico(id, function (result) {
        if (!(result instanceof Error)) {
            return response.sendSuccess(res, result);
        } else {
            return response.sendDefaultError(res, { message: result.message });
        }
    });
}

function atualizarServico(req, res, next) {
    var service = req.swagger.params['service'].value;
    service.id = req.swagger.params['id'].value;

    if (service.nome === undefined || service.descricao === undefined || service.valor === undefined) {
        return response.sendDefaultError(res, { message: "Error: 'nome', 'decricao' and 'valor' are required" });
    }

    if (!/^\d+(?:\.\d+)?$/.test(service.valor)) {
        return response.sendDefaultError(res, { message: "Error: 'valor' is not a currency" });
    }

    service.valor = parseFloat(service.valor).toFixed(2);

    db.atualizarServico(service, function (result) {
        if (!(result instanceof Error)) {
            if (result.affectedRows > 0) {
                return response.sendSuccess(res, { message: "Service updated" });
            } else {
                return response.sendDefaultError(res, { message: "Service not found" });
            }
        } else {
            return response.sendDefaultError(res, { message: result.message });
        }
    });
}

function bloquearServico(req, res, next) {
    const id = req.swagger.params['id'].value;

    db.removerServico(id, function (result) {
        if (!(result instanceof Error)) {
            if (result.affectedRows > 0) {
                return response.sendSuccess(res, { message: "Service deleted" });
            } else {
                return response.sendDefaultError(res, { message: "Service not found" });
            }
        } else {
            return response.sendDefaultError(res, { message: result.message });
        }
    });
}

function desbloquearServico(req, res, next) {
    const id = req.swagger.params['id'].value;

    db.desbloquearServico(id, function (result) {
        if (!(result instanceof Error)) {
            if (result.affectedRows > 0) {
                return response.sendSuccess(res, { message: "Service unlocked" });
            } else {
                return response.sendDefaultError(res, { message: "Service not found" });
            }
        } else {
            return response.sendDefaultError(res, { message: result.message });
        }
    });
}