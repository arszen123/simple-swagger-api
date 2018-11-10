'use strict';

module.exports = class ApiError extends Error {
  constructor(statusCode, message, code) {
    super(message);
    this.statusCode = statusCode || 400;
    if (code !== '') {
      this.code = code;
    }
  }
};
