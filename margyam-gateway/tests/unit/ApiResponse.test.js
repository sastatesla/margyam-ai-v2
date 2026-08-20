import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { ApiResponse } from '../../src/common/ApiResponse.js';

describe('ApiResponse Class', () => {
  let resMock;

  beforeEach(() => {
    resMock = {
      status: jest.fn().mockReturnThis(),
      json:   jest.fn().mockReturnThis(),
    };
  });

  it('should format a successful API response using success() method', () => {
    const apiRes = new ApiResponse(resMock);
    apiRes.success({ statusCode: 200, message: 'Success Test', data: { id: 101 } });

    expect(resMock.status).toHaveBeenCalledWith(200);
    expect(resMock.json).toHaveBeenCalledWith({
      success: true,
      status: 200,
      message: 'Success Test',
      data: { id: 101 },
    });
  });

  it('should format an error API response using error() method', () => {
    const apiRes = new ApiResponse(resMock);
    const errPayload = { statusCode: 404, message: 'Resource Not Found', errorCode: 'NOT_FOUND' };
    apiRes.error(errPayload);

    expect(resMock.status).toHaveBeenCalledWith(404);
    expect(resMock.json).toHaveBeenCalledWith({
      success: false,
      status: 404,
      message: 'Resource Not Found',
      code: 'NOT_FOUND',
    });
  });
});
