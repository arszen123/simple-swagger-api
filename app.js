'use strict';

const SwaggerExpress = require('swagger-express-mw');
const express = require('express');
const app = express();
const cors = require('cors');
const swaggerSecurity = require('./api/helpers/swagger_security')
const swaggerUi = require('swagger-ui-express');
const errorHandler = require('api-error-handler')();
const seeder = require('./seed');

module.exports = app; // for testing

app.use(cors());
app.use(errorHandler);

var config = {
  appRoot: __dirname, // required config
  swaggerSecurityHandlers: swaggerSecurity.swaggerSecurityHandlers
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;

  seeder.run();

  // Szenvedés lenne bekapcsolni, kong consumer apikey-el. Úgyhogy ez most skip.
  /*
  var options = {
    swaggerUrl: `http://127.0.0.1:8000/swagger`
  }
  app.use('/', swaggerUi.serve, swaggerUi.setup(null, options));
*/
  app.listen(port);
});
