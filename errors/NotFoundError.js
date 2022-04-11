const { NOT_FOUND_CODE } = require('./errorCodes');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.errorMessage = message;
    this.statusCode = NOT_FOUND_CODE;
  }
}
module.exports = NotFoundError;
