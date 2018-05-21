"use strict";

const auth = require("../helpers/auth.helper");
const response = require("../helpers/response.helper");

module.exports = {
  loginPost: loginPost
};

function loginPost(args, res, next) {
  const email = args.body.email;
  const password = args.body.senha;

  if (email === undefined || password === undefined) {
    return response.sendDefaultError(res, { message: "Error: 'email' and 'senha' are required" });
  }

  auth.issueToken(email, password, function(result) {
    if (!(result instanceof Error)) {
    	return response.sendSuccess(res, { token: result });
    } else {
    	return response.sendResponse(res, 403, { message: result.message });
    }
  });
};