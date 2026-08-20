export class ApiResponse {
  constructor(res) {
    this.res = res;
  }

  success({ statusCode = 200, message = 'Success', data = null } = {}) {
    return this.res.status(statusCode).json({
      success: true,
      status: statusCode,
      message,
      data,
    });
  }

  error(err) {
    const statusCode = err.statusCode ?? 500;
    const message = err.message ?? 'Internal server error';
    const code = err.errorCode ?? 'internal_server_error';

    return this.res.status(statusCode).json({
      success: false,
      status: statusCode,
      message,
      code,
    });
  }
}
