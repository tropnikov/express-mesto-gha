const { CONFLICT } = require('./errorCodes');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CONFLICT;
  }
}

module.exports = ConflictError;
