"use strict";

const auth = require("../helpers/auth.helper");
const response = require("../helpers/response.helper");

module.exports = {
  loginPost: loginPost
};

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