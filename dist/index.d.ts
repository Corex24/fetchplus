/**
 * Configuration object for FetchPlus requests
 * @typedef {Object} FetchPlusConfig
 * @property {string} [baseURL] - Base URL for all requests
 * @property {Record<string, string>} [headers] - Custom headers to send with request
 * @property {Record<string, any>} [query] - Query parameters to append to URL
 * @property {any} [body] - Request body (for POST, PUT, PATCH)
 * @property {number} [timeout] - Request timeout in milliseconds
 * @property {number} [retries] - Number of times to retry failed requests
 */
type FetchPlusConfig = {
    baseURL?: string;
    headers?: Record<string, string>;
    query?: Record<string, any>;
    body?: any;
    timeout?: number;
    retries?: number;
};
/**
 * Internal function to execute HTTP requests with retry logic
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE, PATCH)
 * @param {string} url - Request URL
 * @param {FetchPlusConfig} [config={}] - Request configuration
 * @returns {Promise<any>} Response data from the server
 * @throws {FetchPlusError} If request fails after retries
 * @private
 */
declare function runRequest(method: string, url: string, config?: FetchPlusConfig): Promise<{
    status: number;
    data: any;
    headers: Headers;
    url: string;
}>;
/**
 * FetchPlus HTTP Client
 * A lightweight fetch wrapper with built-in retries, timeouts, and error handling
 */
declare const FetchPlus: {
    /**
     * Make a GET request
     * @param {string} url - Request URL
     * @param {FetchPlusConfig} [config={}] - Request configuration
     * @returns {Promise<any>} Response data
     * @throws {FetchPlusError} If request fails
     */
    get: (url: string, config?: FetchPlusConfig) => Promise<{
        status: number;
        data: any;
        headers: Headers;
        url: string;
    }>;
    /**
     * Make a POST request
     * @param {string} url - Request URL
     * @param {FetchPlusConfig} [config={}] - Request configuration (include body in config)
     * @returns {Promise<any>} Response data
     * @throws {FetchPlusError} If request fails
     */
    post: (url: string, config?: FetchPlusConfig) => Promise<{
        status: number;
        data: any;
        headers: Headers;
        url: string;
    }>;
    /**
     * Make a PUT request
     * @param {string} url - Request URL
     * @param {FetchPlusConfig} [config={}] - Request configuration (include body in config)
     * @returns {Promise<any>} Response data
     * @throws {FetchPlusError} If request fails
     */
    put: (url: string, config?: FetchPlusConfig) => Promise<{
        status: number;
        data: any;
        headers: Headers;
        url: string;
    }>;
    /**
     * Make a DELETE request
     * @param {string} url - Request URL
     * @param {FetchPlusConfig} [config={}] - Request configuration
     * @returns {Promise<any>} Response data
     * @throws {FetchPlusError} If request fails
     */
    delete: (url: string, config?: FetchPlusConfig) => Promise<{
        status: number;
        data: any;
        headers: Headers;
        url: string;
    }>;
    /**
     * Make a PATCH request
     * @param {string} url - Request URL
     * @param {FetchPlusConfig} [config={}] - Request configuration (include body in config)
     * @returns {Promise<any>} Response data
     * @throws {FetchPlusError} If request fails
     */
    patch: (url: string, config?: FetchPlusConfig) => Promise<{
        status: number;
        data: any;
        headers: Headers;
        url: string;
    }>;
    /**
     * Make a generic HTTP request
     * @param {string} method - HTTP method (GET, POST, PUT, DELETE, PATCH)
     * @param {string} url - Request URL
     * @param {FetchPlusConfig} [config={}] - Request configuration
     * @returns {Promise<any>} Response data
     * @throws {FetchPlusError} If request fails
     */
    request: typeof runRequest;
};

export { FetchPlus, FetchPlus as default };
