/**
 * Configuration object for HTTP requests
 * @typedef {Object} FetchPlusConfig
 * @property {string} [baseURL] - Base URL for requests
 * @property {Record<string, string>} [headers] - Custom headers
 * @property {Record<string, any>} [query] - Query parameters
 * @property {any} [body] - Request body
 * @property {number} [timeout] - Timeout in milliseconds
 * @property {number} [retries] - Number of retries
 * @property {string} [method] - HTTP method
 */
type FetchPlusConfig = {
  baseURL?: string;
  headers?: Record<string, string>;
  query?: Record<string, any>;
  body?: any;
  timeout?: number;
  retries?: number;
  method?: string;
};

/**
 * HTTP Response object
 * @typedef {Object} FetchPlusResponse
 * @property {number} status - HTTP status code
 * @property {T} data - Response data
 * @property {Headers} headers - Response headers
 * @property {string} url - Request URL
 */
type FetchPlusResponse<T = any> = {
  status: number;
  data: T;
  headers: Headers;
  url: string;
};

/**
 * Build URL with query parameters
 * @param {string} url - Base URL
 * @param {Record<string, any>} [query] - Query parameters
 * @returns {string} URL with query string
 */
function buildURL(url: string, query?: Record<string, any>) {
  if (!query) return url;

  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });
  return `${url}?${params.toString()}`;
}

/**
 * Sleep/delay for specified milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>} Promise that resolves after delay
 */
function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

/**
 * Execute an HTTP request with full configuration support
 * @template T - Response data type
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE, PATCH)
 * @param {string} url - Request URL
 * @param {FetchPlusConfig} [config={}] - Request configuration
 * @returns {Promise<FetchPlusResponse<T>>} Response object with status, data, headers, and url
 * @throws {FetchPlusError} If request fails or returns an error status
 */
export async function request<T = any>(
  method: string,
  url: string,
  config: FetchPlusConfig = {},
): Promise<FetchPlusResponse<T>> {
  const {
    baseURL = "",
    headers = {},
    query,
    body,
    timeout = 0,
    retries = 0,
  } = config;
  const finalURL = buildURL(baseURL + url, query);

  let attempt = 0;
  while (true) {
    const controller = new AbortController();
    const signal = controller.signal;
    let timeoutId: any;

    if (timeout > 0) {
      timeoutId = setTimeout(() => controller.abort(), timeout);
    }
    try {
      const res = await fetch(finalURL, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal,
      });
      clearTimeout(timeoutId);
      let data;
      const contentType = res.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        data = await res.text();
      }
      if (!res.ok) {
        throw {
          status: res.status,
          message: data?.message || "Request failed",
          url: finalURL,
          method,
        };
      }
      return {
        status: res.status,
        data,
        headers: res.headers,
        url: finalURL,
      };
    } catch (err: any) {
      clearTimeout(timeoutId);
      const isLastAttempt = attempt >= retries;
      const shouldRetry =
        !isLastAttempt &&
        (err.name === "AbortError" || err.status >= 500 || err.status);
      if (shouldRetry) {
        attempt++;
        await sleep(300 * attempt); // simple backoff strategy
        continue;
      }
      throw err;
    }
  }
}
