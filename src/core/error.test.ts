import { describe, it, expect } from 'vitest';
import { FetchPlusError } from './error';

describe('FetchPlusError', () => {
  it('should create error with message', () => {
    const error = new FetchPlusError('Test error');

    expect(error.message).toBe('Test error');
    expect(error.name).toBe('FetchPlusError');
  });

  it('should include status property', () => {
    const error = new FetchPlusError('Test error', { status: 404 });

    expect(error.status).toBe(404);
  });

  it('should include url property', () => {
    const error = new FetchPlusError('Test error', { url: 'https://api.example.com/test' });

    expect(error.url).toBe('https://api.example.com/test');
  });

  it('should include method property', () => {
    const error = new FetchPlusError('Test error', { method: 'GET' });

    expect(error.method).toBe('GET');
  });

  it('should include data property', () => {
    const errorData = { message: 'Validation failed' };
    const error = new FetchPlusError('Test error', { data: errorData });

    expect(error.data).toEqual(errorData);
  });

  it('should include code property', () => {
    const error = new FetchPlusError('Test error', { code: 'NETWORK_ERROR' });

    expect(error.code).toBe('NETWORK_ERROR');
  });

  it('should include cause property', () => {
    const cause = new Error('Original error');
    const error = new FetchPlusError('Test error', { cause });

    expect(error.cause).toBe(cause);
  });

  it('should support all options together', () => {
    const options = {
      status: 500,
      url: 'https://api.example.com/test',
      method: 'POST',
      data: { error: 'Server error' },
      code: 'INTERNAL_SERVER_ERROR',
      cause: new Error('Original cause'),
    };

    const error = new FetchPlusError('Server error occurred', options);

    expect(error.message).toBe('Server error occurred');
    expect(error.status).toBe(500);
    expect(error.url).toBe('https://api.example.com/test');
    expect(error.method).toBe('POST');
    expect(error.data).toEqual({ error: 'Server error' });
    expect(error.code).toBe('INTERNAL_SERVER_ERROR');
    expect(error.cause).toEqual(new Error('Original cause'));
  });

  it('should convert to JSON', () => {
    const error = new FetchPlusError('Test error', {
      status: 400,
      url: 'https://api.example.com/test',
      method: 'POST',
      data: { message: 'Validation failed' },
      code: 'VALIDATION_ERROR',
    });

    const json = error.toJSON();

    expect(json).toEqual({
      name: 'FetchPlusError',
      message: 'Test error',
      status: 400,
      url: 'https://api.example.com/test',
      method: 'POST',
      data: { message: 'Validation failed' },
      code: 'VALIDATION_ERROR',
    });
  });

  it('should be instanceof Error', () => {
    const error = new FetchPlusError('Test error');

    expect(error instanceof Error).toBe(true);
    expect(error instanceof FetchPlusError).toBe(true);
  });

  it('should have correct prototype', () => {
    const error = new FetchPlusError('Test error');

    expect(Object.getPrototypeOf(error)).toBe(FetchPlusError.prototype);
  });

  it('should exclude cause from toJSON output', () => {
    const error = new FetchPlusError('Test error', { cause: new Error('Original') });

    const json = error.toJSON();

    expect((json as any).cause).toBeUndefined();
  });

  it('should handle empty options', () => {
    const error = new FetchPlusError('Test error', {});

    expect(error.status).toBeUndefined();
    expect(error.url).toBeUndefined();
    expect(error.method).toBeUndefined();
    expect(error.data).toBeUndefined();
    expect(error.code).toBeUndefined();
    expect(error.cause).toBeUndefined();
  });
});
