"use strict";

const cors = require('cors')
const app = require("express")();
const swaggerTools = require("swagger-tools");
const YAML = require("yamljs");

const auth = require("./api/helpers/auth.helper");
const swaggerConfig = YAML.load("./api/swagger/swagger.yaml");

swaggerTools.initializeMiddleware(swaggerConfig, function(middleware) {
  app.use(cors())

  //Serves the Swagger UI on /docs
  app.use(middleware.swaggerMetadata()); // needs to go BEFORE swaggerSecurity
  
  app.use(
    middleware.swaggerSecurity({
      //manage token function in the 'auth' module
      Bearer: auth.verifyToken
    })
  );
  
  //app.use(middleware.swaggerValidator());

  app.use(middleware.swaggerRouter({
    controllers: "./api/controllers",
    useStubs: false
  }));

  app.use(middleware.swaggerUi());
  
  app.listen(3000, function() {
    console.log("Started server on port 3000");
  });
});
