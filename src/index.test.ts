import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import FetchPlus from './index';

describe('FetchPlus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should make a GET request', async () => {
    const mockResponse = { success: true, data: 'test' };
    (globalThis as any).fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: async () => mockResponse,
      text: async () => JSON.stringify(mockResponse),
    });

    const result = await FetchPlus.get('https://api.example.com/test');
    
    expect(result.status).toBe(200);
    expect(result.data).toEqual(mockResponse);
    expect((globalThis as any).fetch).toHaveBeenCalledWith(
      'https://api.example.com/test',
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('should make a POST request with body', async () => {
    const mockResponse = { id: 1, name: 'test' };
    const requestBody = { name: 'test' };

    (globalThis as any).fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 201,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: async () => mockResponse,
      text: async () => JSON.stringify(mockResponse),
    });

    const result = await FetchPlus.post('https://api.example.com/test', { body: requestBody });
    
    expect(result.status).toBe(201);
    expect(result.data).toEqual(mockResponse);
    expect((globalThis as any).fetch).toHaveBeenCalledWith(
      'https://api.example.com/test',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(requestBody),
      })
    );
  });

  it('should make a PUT request', async () => {
    const mockResponse = { id: 1, updated: true };
    (globalThis as any).fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: async () => mockResponse,
      text: async () => JSON.stringify(mockResponse),
    });

    const result = await FetchPlus.put('https://api.example.com/test/1', { body: { updated: true } });
    
    expect(result.status).toBe(200);
    expect((globalThis as any).fetch).toHaveBeenCalledWith(
      'https://api.example.com/test/1',
      expect.objectContaining({ method: 'PUT' })
    );
  });

  it('should make a DELETE request', async () => {
    (globalThis as any).fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 204,
      headers: new Headers(),
      json: async () => ({}),
      text: async () => '',
    });

    const result = await FetchPlus.delete('https://api.example.com/test/1');
    
    expect(result.status).toBe(204);
    expect((globalThis as any).fetch).toHaveBeenCalledWith(
      'https://api.example.com/test/1',
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('should make a PATCH request', async () => {
    const mockResponse = { id: 1, patched: true };
    (globalThis as any).fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: async () => mockResponse,
      text: async () => JSON.stringify(mockResponse),
    });

    const result = await FetchPlus.patch('https://api.example.com/test/1', { body: { patched: true } });
    
    expect(result.status).toBe(200);
    expect((globalThis as any).fetch).toHaveBeenCalledWith(
      'https://api.example.com/test/1',
      expect.objectContaining({ method: 'PATCH' })
    );
  });

  it('should include custom headers', async () => {
    (globalThis as any).fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers(),
      json: async () => ({}),
      text: async () => '{}',
    });

    const customHeaders = { 'Authorization': 'Bearer token123' };
    await FetchPlus.get('https://api.example.com/test', { headers: customHeaders });
    
    expect((globalThis as any).fetch).toHaveBeenCalledWith(
      'https://api.example.com/test',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer token123',
          'Content-Type': 'application/json',
        }),
      })
    );
  });

  it('should include query parameters', async () => {
    (globalThis as any).fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers(),
      json: async () => ({}),
      text: async () => '{}',
    });

    await FetchPlus.get('https://api.example.com/test', { query: { page: 1, limit: 10 } });
    
    expect((globalThis as any).fetch).toHaveBeenCalledWith(
      expect.stringContaining('?page=1&limit=10'),
      expect.any(Object)
    );
  });

  it('should handle non-JSON responses', async () => {
    const mockResponse = '<html>test</html>';
    (globalThis as any).fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ 'Content-Type': 'text/html' }),
      json: async () => { throw new Error('Not JSON'); },
      text: async () => mockResponse,
    });

    const result = await FetchPlus.get('https://api.example.com/test');
    
    expect(result.data).toBe(mockResponse);
  });

  it('should throw error on failed response', async () => {
    (globalThis as any).fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 404,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: async () => ({ message: 'Not found' }),
      text: async () => '{"message":"Not found"}',
    });

    await expect(FetchPlus.get('https://api.example.com/notfound')).rejects.toThrow();
  });

  it('should retry on 5xx errors', async () => {
    const mockResponse = { success: true };
    
    (globalThis as any).fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => ({ message: 'Server error' }),
        text: async () => '{"message":"Server error"}',
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => mockResponse,
        text: async () => JSON.stringify(mockResponse),
      });

    vi.useFakeTimers();
    const promise = FetchPlus.get('https://api.example.com/test', { retries: 1 });
    
    await vi.runAllTimersAsync();
    const result = await promise;
    
    vi.useRealTimers();
    
    expect(result.status).toBe(200);
    expect((globalThis as any).fetch).toHaveBeenCalledTimes(2);
  });
});
