/**
 * Options for creating a FetchPlusError
 * @typedef {Object} FetchPlusErrorOptions
 * @property {number} [status] - HTTP status code
 * @property {string} [url] - Request URL
 * @property {string} [method] - HTTP method (GET, POST, etc.)
 * @property {any} [data] - Response data
 * @property {unknown} [cause] - Original error cause
 * @property {string} [code] - Error code
 */
export type FetchPlusErrorOptions = {
    status?: number;
    url?: string;
    method?: string;
    data?: any;
    cause?: unknown;
    code?: string;
};

/**
 * Custom error class for FetchPlus HTTP errors
 * Extends Error with additional HTTP-related properties
 * @extends Error
 */
export class FetchPlusError extends Error {
    status?: number;
    url?: string;
    method?: string;
    data?: any;
    code?: string;
    cause?: unknown;
    
    /**
     * Create a new FetchPlusError
     * @param {string} message - Error message
     * @param {FetchPlusErrorOptions} [options={}] - Error options
     */
    constructor(message: string, options: FetchPlusErrorOptions = {}) {
        super(message);
        this.name = "FetchPlusError";
        this.status = options.status;
        this.url = options.url;
        this.method = options.method;
        this.data = options.data;
        this.code = options.code;
        this.cause = options.cause;

        Object.setPrototypeOf(this, FetchPlusError.prototype);
    }
    
    /**
     * Serialize error to JSON
     * @returns {Object} JSON representation of the error (excludes cause)
     */
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            status: this.status,
            url: this.url,
            method: this.method,
            data: this.data,
            code: this.code
        };
    }
}