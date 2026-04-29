import { describe, it, expect, beforeEach, vi } from 'vitest';
import { request } from './request';

describe('request', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should build URL with baseURL', async () => {
    const mockResponse = { data: 'test' };
    (globalThis as any).fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: async () => mockResponse,
      text: async () => JSON.stringify(mockResponse),
    });

    await request('GET', '/test', { baseURL: 'https://api.example.com' });
    
    expect((globalThis as any).fetch).toHaveBeenCalledWith(
      'https://api.example.com/test',
      expect.any(Object)
    );
  });

  it('should build URL with query parameters', async () => {
    const mockResponse = { data: 'test' };
    (globalThis as any).fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: async () => mockResponse,
      text: async () => JSON.stringify(mockResponse),
    });

    await request('GET', 'https://api.example.com/test', {
      query: { page: 1, search: 'hello' },
    });
    
    const callUrl = ((globalThis as any).fetch as any).mock.calls[0][0];
    expect(callUrl).toContain('page=1');
    expect(callUrl).toContain('search=hello');
  });

  it('should filter out null and undefined query params', async () => {
    const mockResponse = { data: 'test' };
    (globalThis as any).fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: async () => mockResponse,
      text: async () => JSON.stringify(mockResponse),
    });

    await request('GET', 'https://api.example.com/test', {
      query: { page: 1, search: undefined, filter: null },
    });
    
    const callUrl = ((globalThis as any).fetch as any).mock.calls[0][0];
    expect(callUrl).toContain('page=1');
    expect(callUrl).not.toContain('search');
    expect(callUrl).not.toContain('filter');
  });

  it('should handle request body', async () => {
    const mockResponse = { id: 1 };
    const requestBody = { name: 'test' };
    
    (globalThis as any).fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 201,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: async () => mockResponse,
      text: async () => JSON.stringify(mockResponse),
    });

    await request('POST', 'https://api.example.com/test', { body: requestBody });
    
    const callArgs = ((globalThis as any).fetch as any).mock.calls[0][1];
    expect(callArgs.body).toBe(JSON.stringify(requestBody));
  });

  it('should set Content-Type header by default', async () => {
    const mockResponse = { data: 'test' };
    (globalThis as any).fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: async () => mockResponse,
      text: async () => JSON.stringify(mockResponse),
    });

    await request('GET', 'https://api.example.com/test');
    
    const callArgs = ((globalThis as any).fetch as any).mock.calls[0][1];
    expect(callArgs.headers['Content-Type']).toBe('application/json');
  });

  it('should merge custom headers with default headers', async () => {
    const mockResponse = { data: 'test' };
    (globalThis as any).fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: async () => mockResponse,
      text: async () => JSON.stringify(mockResponse),
    });

    await request('GET', 'https://api.example.com/test', {
      headers: { 'Authorization': 'Bearer token' },
    });
    
    const callArgs = ((globalThis as any).fetch as any).mock.calls[0][1];
    expect(callArgs.headers['Content-Type']).toBe('application/json');
    expect(callArgs.headers['Authorization']).toBe('Bearer token');
  });

  it('should return response with correct structure', async () => {
    const mockData = { success: true };
    const mockHeaders = new Headers({ 'Content-Type': 'application/json' });
    
    (globalThis as any).fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: mockHeaders,
      json: async () => mockData,
      text: async () => JSON.stringify(mockData),
    });

    const result = await request('GET', 'https://api.example.com/test');
    
    expect(result).toHaveProperty('status', 200);
    expect(result).toHaveProperty('data', mockData);
    expect(result).toHaveProperty('headers');
    expect(result).toHaveProperty('url');
  });

  it('should throw error with proper structure on failure', async () => {
    (globalThis as any).fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 400,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: async () => ({ message: 'Bad request' }),
      text: async () => '{"message":"Bad request"}',
    });

    await expect(request('POST', 'https://api.example.com/test')).rejects.toMatchObject({
      status: 400,
      message: 'Bad request',
    });
  });

  it('should parse JSON responses', async () => {
    const mockData = { id: 1, name: 'test' };
    
    (globalThis as any).fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: async () => mockData,
      text: async () => JSON.stringify(mockData),
    });

    const result = await request('GET', 'https://api.example.com/test');
    
    expect(result.data).toEqual(mockData);
  });

  it('should parse text responses when not JSON', async () => {
    const mockData = 'Hello, World!';
    
    (globalThis as any).fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ 'Content-Type': 'text/plain' }),
      json: async () => { throw new Error('Not JSON'); },
      text: async () => mockData,
    });

    const result = await request('GET', 'https://api.example.com/test');
    
    expect(result.data).toBe(mockData);
  });
});
