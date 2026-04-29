"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  FetchPlus: () => FetchPlus,
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);

// src/core/request.ts
function buildURL(url, query) {
  if (!query) return url;
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== void 0 && value !== null) {
      params.append(key, String(value));
    }
  });
  return `${url}?${params.toString()}`;
}
function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}
async function request(method, url, config = {}) {
  const {
    baseURL = "",
    headers = {},
    query,
    body,
    timeout = 0,
    retries = 0
  } = config;
  const finalURL = buildURL(baseURL + url, query);
  let attempt = 0;
  while (true) {
    const controller = new AbortController();
    const signal = controller.signal;
    let timeoutId;
    if (timeout > 0) {
      timeoutId = setTimeout(() => controller.abort(), timeout);
    }
    try {
      const res = await fetch(finalURL, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers
        },
        body: body ? JSON.stringify(body) : void 0,
        signal
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
          method
        };
      }
      return {
        status: res.status,
        data,
        headers: res.headers,
        url: finalURL
      };
    } catch (err) {
      clearTimeout(timeoutId);
      const isLastAttempt = attempt >= retries;
      const shouldRetry = !isLastAttempt && (err.name === "AbortError" || err.status >= 500 || err.status);
      if (shouldRetry) {
        attempt++;
        await sleep(300 * attempt);
        continue;
      }
      throw err;
    }
  }
}

// src/features/retry.ts
function sleep2(ms) {
  return new Promise((res) => setTimeout(res, ms));
}
async function withRetry(fn, options = {}) {
  const {
    retries = 0,
    delay = 300,
    factor = 2
  } = options;
  let attempts = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      const isLast = attempts >= retries;
      const shouldRetry = !isLast && (!err.status || err?.status >= 500 || err?.status === "AbortError");
      if (!shouldRetry) {
        throw err;
      }
      attempts++;
      const backoff = delay * Math.pow(factor, attempts - 1);
      await sleep2(backoff);
    }
  }
}

// src/index.ts
async function runRequest(method, url, config = {}) {
  const { retries = 0 } = config;
  return withRetry(
    () => request(method, url, config),
    {
      retries
    }
  );
}
var FetchPlus = {
  /**
   * Make a GET request
   * @param {string} url - Request URL
   * @param {FetchPlusConfig} [config={}] - Request configuration
   * @returns {Promise<any>} Response data
   * @throws {FetchPlusError} If request fails
   */
  get: (url, config = {}) => runRequest("GET", url, config),
  /**
   * Make a POST request
   * @param {string} url - Request URL
   * @param {FetchPlusConfig} [config={}] - Request configuration (include body in config)
   * @returns {Promise<any>} Response data
   * @throws {FetchPlusError} If request fails
   */
  post: (url, config = {}) => runRequest("POST", url, config),
  /**
   * Make a PUT request
   * @param {string} url - Request URL
   * @param {FetchPlusConfig} [config={}] - Request configuration (include body in config)
   * @returns {Promise<any>} Response data
   * @throws {FetchPlusError} If request fails
   */
  put: (url, config = {}) => runRequest("PUT", url, config),
  /**
   * Make a DELETE request
   * @param {string} url - Request URL
   * @param {FetchPlusConfig} [config={}] - Request configuration
   * @returns {Promise<any>} Response data
   * @throws {FetchPlusError} If request fails
   */
  delete: (url, config = {}) => runRequest("DELETE", url, config),
  /**
   * Make a PATCH request
   * @param {string} url - Request URL
   * @param {FetchPlusConfig} [config={}] - Request configuration (include body in config)
   * @returns {Promise<any>} Response data
   * @throws {FetchPlusError} If request fails
   */
  patch: (url, config = {}) => runRequest("PATCH", url, config),
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
var index_default = FetchPlus;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FetchPlus
});
