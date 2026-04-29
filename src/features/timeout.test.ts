import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateTimeoutSignal } from './timeout';

describe('CreateTimeoutSignal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return signal and clear function', () => {
    const result = CreateTimeoutSignal(1000);

    expect(result).toHaveProperty('signal');
    expect(result).toHaveProperty('clear');
    expect(result.signal instanceof AbortSignal).toBe(true);
    expect(typeof result.clear).toBe('function');
  });

  it('should abort signal after timeout', () => {
    vi.useFakeTimers();
    
    const { signal } = CreateTimeoutSignal(1000);
    
    expect(signal.aborted).toBe(false);
    
    vi.advanceTimersByTime(999);
    expect(signal.aborted).toBe(false);
    
    vi.advanceTimersByTime(1);
    expect(signal.aborted).toBe(true);
    
    vi.useRealTimers();
  });

  it('should not abort if clear is called', () => {
    vi.useFakeTimers();
    
    const { signal, clear } = CreateTimeoutSignal(1000);
    
    vi.advanceTimersByTime(500);
    clear();
    
    vi.advanceTimersByTime(600);
    expect(signal.aborted).toBe(false);
    
    vi.useRealTimers();
  });

  it('should return non-aborted signal for zero timeout', () => {
    const { signal } = CreateTimeoutSignal(0);
    
    expect(signal.aborted).toBe(false);
  });

  it('should return non-aborted signal for negative timeout', () => {
    const { signal } = CreateTimeoutSignal(-100);
    
    expect(signal.aborted).toBe(false);
  });

  it('should handle clear without timeout', () => {
    const { signal, clear } = CreateTimeoutSignal(0);
    
    expect(() => clear()).not.toThrow();
    expect(signal.aborted).toBe(false);
  });

  it('should abort multiple times if multiple timeouts are created', () => {
    vi.useFakeTimers();
    
    const signal1 = CreateTimeoutSignal(1000).signal;
    const signal2 = CreateTimeoutSignal(500).signal;
    
    vi.advanceTimersByTime(600);
    expect(signal1.aborted).toBe(false);
    expect(signal2.aborted).toBe(true);
    
    vi.advanceTimersByTime(500);
    expect(signal1.aborted).toBe(true);
    
    vi.useRealTimers();
  });

  it('should fire abort event when timeout expires', () => {
    vi.useFakeTimers();
    
    const { signal } = CreateTimeoutSignal(1000);
    const abortHandler = vi.fn();
    
    signal.addEventListener('abort', abortHandler);
    
    vi.advanceTimersByTime(1000);
    
    expect(abortHandler).toHaveBeenCalledTimes(1);
    
    vi.useRealTimers();
  });

  it('should be possible to abort signal before timeout', () => {
    vi.useFakeTimers();
    
    const controller = new AbortController();
    const { signal, clear } = CreateTimeoutSignal(1000);
    
    controller.abort();
    clear();
    
    expect(signal.aborted).toBe(false);
    
    vi.useRealTimers();
  });

  it('should handle large timeout values', () => {
    vi.useFakeTimers();
    
    const { signal } = CreateTimeoutSignal(100000);
    
    expect(signal.aborted).toBe(false);
    
    vi.advanceTimersByTime(50000);
    expect(signal.aborted).toBe(false);
    
    vi.advanceTimersByTime(50000);
    expect(signal.aborted).toBe(true);
    
    vi.useRealTimers();
  });
});
