"use strict";

const db = require("../helpers/db.helper");
const response = require("../helpers/response.helper");

module.exports = {
  servicoGet: servicoGet
}

function servicoGet(args, res, next) {
  db.visualizarServicos(function(result) {
    if (!(result instanceof Error)) {
      return response.sendSuccess(res, { total: result.length, servicos: result });
    } else {
      return response.sendDefaultError(res, { message: result.message });
    }
  });
}