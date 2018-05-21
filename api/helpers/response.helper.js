"use strict";

module.exports = {
	sendResponse: sendResponse,
	sendDefaultError: sendDefaultError,
	sendAcessDenied: sendAcessDenied
}

function sendResponse(res, code, message) {
    return res.status(code).json(responseObject);
}

function sendSuccess(res, message) {
	return sendResponse(res, 200, message);
}

function sendDefaultError(res, message) {
	return sendResponse(res, 400, message);
}

function sendAcessDenied(res) {
	return sendResponse(res, 403, { message: "Error: Access Denied" });
}