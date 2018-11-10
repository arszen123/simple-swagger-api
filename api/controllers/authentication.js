'use strict';
const db = require('./db');
db.initCollection('users');
db.initCollection('session');

module.exports = {
  login,
  logout,
};

function login(req, res) {
  let credentials = req.swagger.params.credentials.value;
  try {
    let user = db.getObject('users', credentials);
    let sessionId = null;
    try {
      let session = db.getObject('session', {userId: user.id});
      sessionId = session.id;
    } catch (error) {
      // silent
    }
    if (sessionId === null) {
      sessionId = db.createObject('session', {userId: user.id}).id;
    }

    return res.json({sessionID: sessionId});
  } catch (error) {
    return res.status(401).json({
      message: 'Incorrect password/username!',
    });
  }
}

function logout(req, res) {
  let sessionID = req.swagger.params['x-session-id'].value;

  try {
    let session = db.deleteObject('session', {id: sessionID});
    return res.json({sessionID: session.id});
  } catch (error) {
    return res.status(401).json({
      message: 'You are not logged in!',
    });
  }
}
