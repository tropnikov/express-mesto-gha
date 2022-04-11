const { BAD_REQUEST_CODE } = require('./errorCodes');

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = BAD_REQUEST_CODE;
  }
}
module.exports = ValidationError;
