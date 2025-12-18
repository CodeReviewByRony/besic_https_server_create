export class ApiError extends Error {
  constructor(statusCode, message, data = null) {
    super(message);
    this.status = false;
    this.statusCode = statusCode;
    this.data = null;
  }
}

export class ApiSuccess {
  constructor(statusCode, message, data) {
    this.status = true;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
