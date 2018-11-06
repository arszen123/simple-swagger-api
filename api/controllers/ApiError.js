'use strict';

module.exports = class ApiError extends Error{
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode || 400;
  }
}
