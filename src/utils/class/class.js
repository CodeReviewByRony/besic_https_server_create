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

export function sendApiResponce(res, result) {
  // api error
  if (result instanceof ApiError) {
    res.writeHead(result.statusCode, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        status: false,
        statusCode: result.statusCode,
        message: result.message,
        data: result.data,
      })
    );
  }

  //   api success
  if (result instanceof ApiSuccess) {
    res.writeHead(result.statusCode, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        status: true,
        statusCode: result.statusCode,
        message: result.message,
        data: result.data,
      })
    );
  }
}
