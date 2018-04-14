import httpStatus from 'http-status';

/**
 * @extends Error
 */
class ExtendableError extends Error {
  constructor(message, status, isPublic, errors, subMessage) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.subMessage = subMessage;
    this.status = status;
    this.isPublic = isPublic;
    this.errors = errors;
    this.isOperational = true; // This is required since bluebird 4 doesn't append it anymore.
    Error.captureStackTrace(this, this.constructor.name);
  }
}

/**
 * Class representing an API error.
 * @extends ExtendableError
 */
class APIError extends ExtendableError {
  /**
   * Creates an API error.
   * @param {string} message - Error message.
   * @param {number} status - HTTP status code of error.
   * @param {boolean} isPublic - Whether the message should be visible to user or not.
   */
  constructor(message, status = httpStatus.INTERNAL_SERVER_ERROR, isPublic = false,
              errors, subMessage) {
    super(message, status, isPublic, errors, subMessage);
  }
}

export default APIError;
