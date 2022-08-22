class ConflictError extends Error {
  constructor(message) {
    super(message || 'DB conflict');
    this.statusCode = 409;
  }
}

module.exports = ConflictError;
