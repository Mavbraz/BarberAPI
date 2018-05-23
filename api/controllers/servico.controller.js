"use strict";

const db = require("../helpers/db.helper");
const response = require("../helpers/response.helper");

module.exports = {
  servicoGet: servicoGet,
  servicoPost: servicoPost,
  servicoIdGet: servicoIdGet,
  servicoIdPut: servicoIdPut,
  servicoIdDelete: servicoIdDelete,
  servicoIdUnlockPut: servicoIdUnlockPut
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
      return response.sendSuccess(res, { message: "Service registered" });
    } else {
      return response.sendDefaultError(res, { message: result.message });
    }
  });
}

function servicoIdGet(req, res, next) {
  const id = req.swagger.params['id'].value;

  db.visualizarServico(id, function(result) {
    if (!(result instanceof Error)) {
      return response.sendSuccess(res, result);
    } else {
      return response.sendDefaultError(res, { message: result.message });
    }
  });
}

function servicoIdPut(req, res, next) {
  const id = req.swagger.params['id'].value;
  var service = req.swagger.params['service'].value;

  if (service.descricao === undefined || service.valor === undefined) {
    return response.sendDefaultError(res, { message: "Error: 'decricao' and 'valor' are required" });
  }

  if (!/^\d+(?:\.\d+)?$/.test(service.valor)) {
  	return response.sendDefaultError(res, { message: "Error: 'valor' is not a currency" });
  }

  service.id = id;
  service.valor = parseFloat(service.valor).toFixed(2);

  db.atualizarServico(service, function(result) {
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

function servicoIdDelete(req, res, next) {
  const id = req.swagger.params['id'].value;

  db.removerServico(id, function(result) {
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

function servicoIdUnlockPut(req, res, next) {
  const id = req.swagger.params['id'].value;

  db.desbloquearServico(id, function(result) {
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