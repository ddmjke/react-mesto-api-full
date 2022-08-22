class ForbiddenError extends Error {
  constructor(message) {
    super(message || 'Forbidden');
    this.statusCode = 403;
  }
}

module.exports = ForbiddenError;
