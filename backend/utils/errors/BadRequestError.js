class BadRequestError extends Error {
  constructor(message) {
    super(message || 'Bad request');
    this.statusCode = 400;
  }
}

module.exports = BadRequestError;
