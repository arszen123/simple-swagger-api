'use strict'
const db = require('./db');
const ApiError = require('./ApiError')
db.initCollection('users')


module.exports = {
  createUser
};

function createUser(req, res) {
  const user = req.swagger.params.user.value
  try {
    db.getObject('users', {email: user.email})
    db.getObject('users', {username: user.username})
    throw new ApiError(400, 'User with this username/email already exists')
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
  }
  let userId = db.createObject('users', user)
  return res.json({id: userId._id})
}
