"use strict";

const jwt = require("jsonwebtoken");

const db = require("./db.helper");
const response = require("../helpers/response.helper");

const issuer = "barbershop.com";

module.exports = {
  verifyToken: verifyToken,
  issueToken: issueToken
}

//Here we setup the security checks for the endpoints
//that need it (in our case, only /protected). This
//function will be called every time a request to a protected
//endpoint is received
function verifyToken(req, authOrSecDef, token, callback) {
  //these are the scopes/roles defined for the current endpoint
  const currentScopes = req.swagger.operation["x-security-scopes"];

  //validate the 'Authorization' header. it should have the following format:
  //'Bearer tokenString'
  if (token && token.indexOf("Bearer ") == 0) {
    const tokenJwt = token.split(" ")[1];

    db.verifyToken(tokenJwt, function (result) {
      if (result != null) {
        jwt.verify(tokenJwt, result.salt, function(verificationError, decodedToken) {
          //check if the JWT was verified correctly
          if (verificationError === null &&
              Array.isArray(currentScopes) &&
              decodedToken &&
              decodedToken.sub &&
              decodedToken.iss &&
              decodedToken.role) {
            // you can add more verification checks for the
            // token here if necessary, such as checking if
            // the username belongs to an active user
            if (currentScopes.includes(decodedToken.role.toLowerCase()) &&
                decodedToken.iss === issuer &&
                decodedToken.sub.toLowerCase() === result.email.toLowerCase()) {
              //add the token to the request so that we
              //can access it in the endpoint code if necessary
              req.auth = decodedToken;
              //if there is no error, just return
              return callback();
            } else {
              //return the error in the callback if there is one
              return response.sendAcessDenied(req.res);
            }
          } else {
            //return the error in the callback if the JWT was not verified
            return response.sendAcessDenied(req.res);
          }
        });
      } else {
        return response.sendAcessDenied(req.res);
      }
    });
  } else {
    //return the error in the callback if the Authorization header doesn't have the correct format
    return response.sendAcessDenied(req.res);
  }
};

function issueToken(authentication, isCliente, callback) {
  db.loginUsuario(authentication, function(result_login) {
    if (!(result_login instanceof Error) && result_login.email === authentication.email.toLowerCase() && result_login.senha === authentication.senha.toUpperCase()) {
      if (isCliente && result_login.cargo != "CLIENTE") {
        return callback(new Error("Error: Access Denied"));
      }

      const token = jwt.sign(
        {
          sub: result_login.email,
          iss: issuer,
          role: result_login.cargo
        },
        result_login.salt
      );

      db.saveToken(authentication, token, function(result_token) {
        if (!(result_token instanceof Error)) {
          return callback({ token: token, cargo: result_login.cargo });
        } else {
          return callback(result_token);
        }
      })
    } else {
      return callback(new Error("Error: Credentials incorrect or account blocked"));
    }
  });
};