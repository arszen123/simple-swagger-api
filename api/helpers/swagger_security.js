'use strict';
const db = require('../controllers/db');
db.initCollection('session');
db.initCollection('users');

module.exports = {
  swaggerSecurityHandlers: {
    ApiKeyAuth: function(req, authOrSecDef, scopesOrApiKey, callback) {
      if (scopesOrApiKey) {
        let user = null;
        try {
          let session = db.getObject('session', {id: scopesOrApiKey});
          user = db.getObject('users', {id: session.userId});
        } catch (error) {
          // silent
        }
        if (user !== null) {
          callback();
          req.user = user;
        }
        else callback(new Error('Api key missing or not registered'));
        // disable to allow mock mode to work
      }
      else callback(new Error('Api key missing or not registered'));
    },
  },
};
