/**
 * Retry options for withRetry function
 * @typedef {Object} RetryOptions
 * @property {number} [retries=0] - Number of times to retry on failure
 * @property {number} [delay=300] - Initial delay in milliseconds before first retry
 * @property {number} [factor=2] - Exponential backoff multiplier (delay * factor ^ attempt)
 */
export type RetryOptions = {
    retries?: number;
    delay?: number;
    factor?: number;
};

function sleep(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
}
/**
 * Execute an async function with automatic retry logic
 * Uses exponential backoff for retry delays
 * @template T - Function return type
 * @param {Function} fn - Async function to execute with retry
 * @param {RetryOptions} [options={}] - Retry configuration options
 * @returns {Promise<T>} Result from the function on successful execution
 * @throws {Error} Throws the last error if all retries are exhausted
 * @example
 * const result = await withRetry(
 *   () => fetchData(),
 *   { retries: 3, delay: 300, factor: 2 }
 * );
 */
export async function withRetry<T>(
    fn: () => Promise<T>, 
    options: RetryOptions = {}
): Promise<T> {
    const {
         retries = 0, 
         delay = 300,
          factor = 2
         } = options;
    let attempts = 0;
    while (true){
        try {
            return await fn();
        } catch (err: any) {
            const isLast = attempts >= retries;

           //Only retry network/aborted-style failures or 5xx (handled upstream ideally)
            const shouldRetry = !isLast && (!err.status || err?.status >= 500 || err?.status === "AbortError");
            if (!shouldRetry) {
                throw err;
            }
            attempts++;

            const backoff = delay * Math.pow(factor, attempts - 1);
            await sleep(backoff);
        }
    }
}