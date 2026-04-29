import { describe, it, expect, beforeEach, vi } from 'vitest';
import { withRetry } from './retry';

describe('withRetry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return result on first attempt', async () => {
    const mockFn = vi.fn().mockResolvedValueOnce('success');

    const result = await withRetry(mockFn);

    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should retry on error', async () => {
    const mockFn = vi.fn()
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce('success');

    vi.useFakeTimers();
    const promise = withRetry(mockFn, { retries: 1 });
    
    await vi.runAllTimersAsync();
    const result = await promise;
    
    vi.useRealTimers();

    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('should not retry after retries limit', async () => {
    const mockFn = vi.fn(async () => {
      throw new Error('Network error');
    });

    vi.useFakeTimers();
    const promise = withRetry(mockFn, { retries: 2 });
    
    await vi.runAllTimersAsync();
    
    vi.useRealTimers();

    await expect(promise).rejects.toThrow('Network error');
    expect(mockFn).toHaveBeenCalledTimes(3); // initial + 2 retries
  });

  it('should use exponential backoff by default', async () => {
    const mockFn = vi.fn()
      .mockRejectedValueOnce(new Error('Error 1'))
      .mockRejectedValueOnce(new Error('Error 2'))
      .mockResolvedValueOnce('success');

    vi.useFakeTimers();
    const promise = withRetry(mockFn, { retries: 2, delay: 300, factor: 2 });
    
    await vi.runAllTimersAsync();
    const result = await promise;
    
    vi.useRealTimers();

    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(3);
  });

  it('should use custom delay', async () => {
    const mockFn = vi.fn()
      .mockRejectedValueOnce(new Error('Error'))
      .mockResolvedValueOnce('success');

    vi.useFakeTimers();
    const promise = withRetry(mockFn, { retries: 1, delay: 500 });
    
    await vi.runAllTimersAsync();
    const result = await promise;
    
    vi.useRealTimers();

    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('should use custom factor for backoff', async () => {
    const mockFn = vi.fn()
      .mockRejectedValueOnce(new Error('Error 1'))
      .mockRejectedValueOnce(new Error('Error 2'))
      .mockResolvedValueOnce('success');

    vi.useFakeTimers();
    const promise = withRetry(mockFn, { retries: 2, delay: 100, factor: 3 });
    
    await vi.runAllTimersAsync();
    const result = await promise;
    
    vi.useRealTimers();

    expect(result).toBe('success');
  });

  it('should retry on status 500', async () => {
    const mockFn = vi.fn()
      .mockRejectedValueOnce({ status: 500, message: 'Server error' })
      .mockResolvedValueOnce('success');

    vi.useFakeTimers();
    const promise = withRetry(mockFn, { retries: 1 });
    
    await vi.runAllTimersAsync();
    const result = await promise;
    
    vi.useRealTimers();

    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('should not retry on 4xx errors', async () => {
    const mockFn = vi.fn(async () => {
      throw { status: 400, message: 'Bad request' };
    });

    vi.useFakeTimers();
    const promise = withRetry(mockFn, { retries: 2 });
    
    await vi.runAllTimersAsync();
    
    vi.useRealTimers();

    await expect(promise).rejects.toMatchObject({ status: 400 });
    expect(mockFn).toHaveBeenCalledTimes(1); // no retries
  });

  it('should throw error from last attempt', async () => {
    const finalError = new Error('Final error');
    const mockFn = vi.fn(async () => {
      throw finalError;
    });

    vi.useFakeTimers();
    const promise = withRetry(mockFn, { retries: 1 });
    
    await vi.runAllTimersAsync();
    
    vi.useRealTimers();

    await expect(promise).rejects.toBe(finalError);
  });

  it('should handle no retries config', async () => {
    const mockFn = vi.fn().mockResolvedValueOnce('success');

    const result = await withRetry(mockFn);

    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should handle AbortError', async () => {
    const mockFn = vi.fn()
      .mockRejectedValueOnce(new DOMException('Aborted', 'AbortError'))
      .mockResolvedValueOnce('success');

    vi.useFakeTimers();
    const promise = withRetry(mockFn, { retries: 1 });
    
    await vi.runAllTimersAsync();
    const result = await promise;
    
    vi.useRealTimers();

    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});
