'use strict';
const db = require('./db');
const ApiError = require('./ApiError');
db.initCollection('users');

module.exports = {
  createUser,
};

function createUser(req, res) {
  const user = req.swagger.params.user.value;
  let isUserExists = false;
  let userExistsError = new ApiError(400, 'User with this username/email already exists')
  try {
    try {
      db.getObject('users', {email: user.email});
      isUserExists = true;
    } catch {
      // silent
    }
    db.getObject('users', {username: user.username});
    throw userExistsError;
  } catch (error) {
    if (error instanceof ApiError || isUserExists) {
      throw userExistsError;
    }
  }
  let userId = db.createObject('users', user);
  return res.json({id: userId._id});
}
