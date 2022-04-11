const { FORBIDDEN } = require('./errorCodes');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.errorMessage = message;
    this.statusCode = FORBIDDEN;
  }
}
module.exports = ForbiddenError;
