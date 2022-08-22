class DefaultError extends Error {
  constructor(message) {
    super(message || 'Internal serwer error');
    this.statusCode = 500;
  }
}

module.exports = DefaultError;
