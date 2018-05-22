"use strict";

const db = require("../helpers/db.helper");
const response = require("../helpers/response.helper");

module.exports = {
  servicoGet: servicoGet,
  servicoPost: servicoPost
}

function servicoGet(req, res, next) {
  db.visualizarServicos(function(result) {
    if (!(result instanceof Error)) {
      return response.sendSuccess(res, { total: result.length, servicos: result });
    } else {
      return response.sendDefaultError(res, { message: result.message });
    }
  });
}

function servicoPost(req, res, next) {
  var service = req.swagger.params['service'].value;

  if (service.descricao === undefined || service.valor === undefined) {
    return response.sendDefaultError(res, { message: "Error: 'decricao' and 'valor' are required" });
  }

  if (!/^\d+(?:\.\d+)?$/.test(service.valor)) {
  	return response.sendDefaultError(res, { message: "Error: 'valor' is not a currency" });
  }

  service.valor = parseFloat(service.valor).toFixed(2);

  db.criarServico(service, function(result) {
    if (!(result instanceof Error)) {
      return response.sendSuccess(res, { message: "Serviço registered" });
    } else {
      return response.sendDefaultError(res, { message: result.message });
    }
  });
}