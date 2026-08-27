export class CustomError extends Error {
  constructor({ name = 'Error', cause, message, code = 1, statusCode = 500 }) {
    super(message);
    this.name = name;
    this.cause = cause;
    this.code = code;
    this.statusCode = statusCode;
  }

  static createError({ name = 'Error', cause, message, code = 1, statusCode = 500 }) {
    throw new CustomError({ name, cause, message, code, statusCode });
  }
}