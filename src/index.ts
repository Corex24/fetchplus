import {request} from "./core/request";
import {withRetry} from "./features/retry";

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
async function runRequest(
    method: string,
    url: string,
    config: FetchPlusConfig = {}
) {
    const { retries = 0 } = config;

    return withRetry(
        () => request(method, url, config), 
        { 
            retries 
        }
    );
}

/**
 * FetchPlus HTTP Client
 * A lightweight fetch wrapper with built-in retries, timeouts, and error handling
 */
export const FetchPlus = {
    /**
     * Make a GET request
     * @param {string} url - Request URL
     * @param {FetchPlusConfig} [config={}] - Request configuration
     * @returns {Promise<any>} Response data
     * @throws {FetchPlusError} If request fails
     */
    get: (url: string, config: FetchPlusConfig = {}) => runRequest("GET", url, config),
    
    /**
     * Make a POST request
     * @param {string} url - Request URL
     * @param {FetchPlusConfig} [config={}] - Request configuration (include body in config)
     * @returns {Promise<any>} Response data
     * @throws {FetchPlusError} If request fails
     */
    post: (url: string, config: FetchPlusConfig = {}) => runRequest("POST", url, config),
    
    /**
     * Make a PUT request
     * @param {string} url - Request URL
     * @param {FetchPlusConfig} [config={}] - Request configuration (include body in config)
     * @returns {Promise<any>} Response data
     * @throws {FetchPlusError} If request fails
     */
    put: (url: string, config: FetchPlusConfig = {}) => runRequest("PUT", url, config),
    
    /**
     * Make a DELETE request
     * @param {string} url - Request URL
     * @param {FetchPlusConfig} [config={}] - Request configuration
     * @returns {Promise<any>} Response data
     * @throws {FetchPlusError} If request fails
     */
    delete: (url: string, config: FetchPlusConfig = {}) => runRequest("DELETE", url, config),
    
    /**
     * Make a PATCH request
     * @param {string} url - Request URL
     * @param {FetchPlusConfig} [config={}] - Request configuration (include body in config)
     * @returns {Promise<any>} Response data
     * @throws {FetchPlusError} If request fails
     */
    patch: (url: string, config: FetchPlusConfig = {}) => runRequest("PATCH", url, config),
    
    /**
     * Make a generic HTTP request
     * @param {string} method - HTTP method (GET, POST, PUT, DELETE, PATCH)
     * @param {string} url - Request URL
     * @param {FetchPlusConfig} [config={}] - Request configuration
     * @returns {Promise<any>} Response data
     * @throws {FetchPlusError} If request fails
     */
    request: runRequest
};
export default FetchPlus;