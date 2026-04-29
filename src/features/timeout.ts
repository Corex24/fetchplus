/**
 * Create an AbortSignal that triggers after a specified timeout
 * @param {number} timeout - Timeout in milliseconds (0 or negative = no timeout)
 * @returns {Object} Object containing abort signal and clear function
 * @returns {AbortSignal} result.signal - AbortSignal that aborts on timeout
 * @returns {Function} result.clear - Function to cancel the timeout before it fires
 * @example
 * const { signal, clear } = CreateTimeoutSignal(5000);
 * try {
 *   await fetch(url, { signal });
 * } finally {
 *   clear(); // Cancel timeout if fetch completes before 5s
 * }
 */
export function CreateTimeoutSignal(timeout: number): {
    signal: AbortSignal;
    clear: () => void;
} {
    const controller = new AbortController();
    if (!timeout || timeout <= 0) {
        return {
            signal: controller.signal,
            clear: () => { },
        };
    }
    const timer = setTimeout(() => {
        controller.abort();
    }, timeout);
    return {
        signal: controller.signal,
        clear: () => clearTimeout(timer),
    };
}