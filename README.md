# FetchPlus

A lightweight, production-ready HTTP client for JavaScript and TypeScript. Built with simplicity in mind, FetchPlus provides automatic retries, timeout handling, and structured error management—everything you need for reliable API communication without the overhead.

[![npm version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://www.npmjs.com/package/@corex24/fetchplus)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen)

## Why FetchPlus?

Making HTTP requests shouldn't be complicated. The native `fetch` API is great, but it lacks essential features that real-world applications need: automatic retries when networks fail, timeouts for hanging requests, and structured error handling that actually tells you what went wrong.

FetchPlus wraps the native fetch API with these critical features built-in, while keeping the implementation lean and understandable. It includes the essential features that actually matter for production applications without unnecessary bloat.

## Features

- **Lightweight & Dependency-Free** - Minimal overhead with zero external dependencies. Pure JavaScript you can audit and understand.
- **Automatic Retries** - Failing requests are automatically retried with intelligent exponential backoff strategy. Failed 5xx errors and network issues get retried; 4xx errors fail fast.
- **Built-in Timeout Protection** - Prevent requests from hanging indefinitely. Set per-request timeouts and get predictable error handling.
- **Structured Error Objects** - Stop guessing what went wrong. FetchPlus errors include HTTP status, URL, method, response data, and the original error for debugging.
- **Full TypeScript Support** - Complete type definitions included. Get IDE autocomplete and type safety from the start.
- **Simple, Familiar API** - The same methods you know: `get()`, `post()`, `put()`, `delete()`, `patch()`. No learning curve.
- **Promise-Based** - Built for async/await. Works seamlessly with modern JavaScript patterns.
- **Works Everywhere** - Node.js 18+ and modern browsers (ES2022+).

## Installation

```bash
npm install @corex24/fetchplus
```

or with yarn:

```bash
yarn add @corex24/fetchplus
```

or with pnpm:

```bash
pnpm add @corex24/fetchplus
```

## Quick Start

The simplest possible example:

```javascript
import { FetchPlus } from 'fetchplus';

// Make a GET request
const user = await FetchPlus.get('https://api.example.com/users/1');
console.log(user);
```

That's it. No configuration, no setup. FetchPlus handles the rest.

## Basic Examples

### GET Request with Query Parameters

```javascript
const users = await FetchPlus.get('https://api.example.com/users', {
  query: {
    page: 1,
    limit: 20,
    sort: 'name'
  }
});
// Automatically builds: https://api.example.com/users?page=1&limit=20&sort=name
```

### POST Request with Data

```javascript
const newUser = await FetchPlus.post('https://api.example.com/users', {
  body: {
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin'
  }
});
```

### Request with Timeout

```javascript
// Abort if the request takes longer than 5 seconds
const data = await FetchPlus.get('https://api.example.com/data', {
  timeout: 5000
});
```

### Request with Automatic Retries

```javascript
// Retry up to 3 times if the request fails
const response = await FetchPlus.get('https://unstable-api.example.com/data', {
  retries: 3
});

// Retry delays follow exponential backoff:
// 1st failure: wait 300ms, retry
// 2nd failure: wait 600ms, retry  
// 3rd failure: wait 1200ms, retry
// All failures: throw error
```

### Request with Custom Headers

```javascript
const response = await FetchPlus.get('https://api.example.com/protected', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIs...',
    'X-API-Key': 'your-api-key',
    'Accept': 'application/json'
  }
});
```

### PUT and PATCH Requests

```javascript
// Update a resource
const updated = await FetchPlus.put('https://api.example.com/users/1', {
  body: {
    name: 'Jane Doe',
    email: 'jane@example.com'
  }
});

// Partial update
const patched = await FetchPlus.patch('https://api.example.com/users/1', {
  body: {
    email: 'newemail@example.com'
  }
});
```

### DELETE Request

```javascript
await FetchPlus.delete('https://api.example.com/users/1');
```

## Complete API Reference

### FetchPlus.get(url, config?)

Fetch data with a GET request.

**Parameters:**
- `url` (string, required) - The URL to request
- `config` (object, optional) - Request configuration

**Returns:** Promise resolving to response data

**Example:**
```javascript
const data = await FetchPlus.get('https://api.example.com/data', {
  query: { id: 123 },
  timeout: 5000
});
```

### FetchPlus.post(url, config?)

Submit data with a POST request.

**Parameters:**
- `url` (string, required) - The URL to request
- `config` (object, optional) - Request configuration (use `body` property for data)

**Returns:** Promise resolving to response data

**Example:**
```javascript
const response = await FetchPlus.post('https://api.example.com/users', {
  body: { name: 'John', email: 'john@example.com' },
  headers: { 'Content-Type': 'application/json' }
});
```

### FetchPlus.put(url, config?)

Replace a resource with a PUT request.

**Parameters:** Same as POST

**Returns:** Promise resolving to response data

### FetchPlus.patch(url, config?)

Partially update a resource with a PATCH request.

**Parameters:** Same as POST

**Returns:** Promise resolving to response data

### FetchPlus.delete(url, config?)

Delete a resource with a DELETE request.

**Parameters:**
- `url` (string, required) - The URL to request
- `config` (object, optional) - Request configuration

**Returns:** Promise resolving to response data

### FetchPlus.request(method, url, config?)

Make a request with a custom HTTP method.

**Parameters:**
- `method` (string, required) - HTTP method (e.g., 'GET', 'POST', 'CUSTOM')
- `url` (string, required) - The URL to request
- `config` (object, optional) - Request configuration

**Returns:** Promise resolving to response data

**Example:**
```javascript
const response = await FetchPlus.request('CUSTOM', 'https://api.example.com/action', {
  body: { action: 'deploy' }
});
```

## Configuration Options

All request methods accept a configuration object with these options:

```javascript
{
  // Base URL prepended to the request URL
  baseURL: 'https://api.example.com',
  
  // Custom HTTP headers
  headers: {
    'Authorization': 'Bearer token',
    'X-Custom-Header': 'value'
  },
  
  // Query parameters (automatically URL encoded)
  query: {
    page: 1,
    limit: 20
  },
  
  // Request body (for POST, PUT, PATCH)
  body: {
    name: 'John',
    email: 'john@example.com'
  },
  
  // Request timeout in milliseconds
  // If exceeded, request is aborted and error is thrown
  timeout: 5000,
  
  // Number of times to retry on failure
  // Retries on 5xx errors and network failures
  // Does NOT retry on 4xx errors (fail fast)
  retries: 3
}
```

## Error Handling

FetchPlus provides detailed error information to help you debug issues:

```javascript
import { FetchPlus } from '@corex24/fetchplus';
import { FetchPlusError } from '@corex24/fetchplus/error';

try {
  const user = await FetchPlus.get('https://api.example.com/invalid');
} catch (error) {
  // Check if it's a FetchPlus error
  if (error instanceof FetchPlusError) {
    console.log('HTTP Status:', error.status);      // e.g., 404
    console.log('Error Message:', error.message);   // e.g., "Not Found"
    console.log('Request URL:', error.url);         // The URL that was requested
    console.log('HTTP Method:', error.method);      // GET, POST, etc.
    console.log('Response Data:', error.data);      // Server response body
    console.log('Error Code:', error.code);         // Internal error code
    
    // Handle specific status codes
    if (error.status === 404) {
      console.log('Resource not found');
    } else if (error.status === 401) {
      console.log('Unauthorized - redirect to login');
    } else if (error.status >= 500) {
      console.log('Server error - might retry');
    }
  } else {
    // Non-HTTP errors (network issues, etc.)
    console.error('Network error:', error.message);
  }
}
```

### Error Structure

```javascript
{
  name: 'FetchPlusError',
  message: string,          // Human-readable error message
  status: number,           // HTTP status code (e.g., 404, 500)
  url: string,              // URL that was requested
  method: string,           // HTTP method (GET, POST, etc.)
  data: any,                // Response body from server
  code: string,             // Error code for categorization
  cause: unknown            // Original error (if available)
}
```

### Retry Behavior

FetchPlus uses intelligent retry logic:

**WILL RETRY (automatically):**
- 5xx Server Errors (500, 502, 503, 504, etc.)
- Network Timeouts
- Connection Failures
- AbortError (timeout or manual abort)

**WILL NOT RETRY (fail immediately):**
- 4xx Client Errors (400, 401, 403, 404, etc.)
- Invalid JSON responses
- Other application-level errors

This strategy ensures you don't waste time retrying requests that will never succeed, while automatically handling transient failures.

## Advanced Usage

### Using with Base URL

```javascript
// Configure a base URL for all requests
const apiClient = (url, config = {}) => 
  FetchPlus.get(url, { 
    baseURL: 'https://api.example.com',
    ...config 
  });

// Usage
const user = await apiClient('/users/1');
// Requests: https://api.example.com/users/1
```

### Creating an API Client Wrapper

```javascript
class APIClient {
  constructor(baseURL, token) {
    this.baseURL = baseURL;
    this.token = token;
  }

  async request(method, path, data = null) {
    return FetchPlus.request(method, path, {
      baseURL: this.baseURL,
      body: data,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      retries: 2,
      timeout: 10000
    });
  }

  getUser(id) {
    return this.request('GET', `/users/${id}`);
  }

  createUser(userData) {
    return this.request('POST', '/users', userData);
  }

  updateUser(id, userData) {
    return this.request('PUT', `/users/${id}`, userData);
  }

  deleteUser(id) {
    return this.request('DELETE', `/users/${id}`);
  }
}

// Usage
const api = new APIClient('https://api.example.com', 'your-auth-token');
const user = await api.getUser(1);
const newUser = await api.createUser({ name: 'John', email: 'john@example.com' });
```

### Handling Multiple Requests

```javascript
// Fetch multiple resources in parallel
const [users, posts, comments] = await Promise.all([
  FetchPlus.get('https://api.example.com/users'),
  FetchPlus.get('https://api.example.com/posts'),
  FetchPlus.get('https://api.example.com/comments')
]);
```

## When to Use FetchPlus

FetchPlus is perfect for:

- ✅ Small to medium-sized projects
- ✅ REST API consumption
- ✅ Server-side rendering (Next.js, Nuxt, etc.)
- ✅ Microservices and backend applications
- ✅ When you want to keep dependencies minimal
- ✅ When you want to understand your dependencies
- ✅ When you need retries and timeouts, but not interceptors

Consider other libraries if you need:

- ❌ Request/Response interceptors
- ❌ Response caching
- ❌ File streaming or uploads
- ❌ GraphQL-specific features
- ❌ Complex middleware pipelines

## Why FetchPlus?

FetchPlus is built for developers who want a simple, lightweight HTTP client without bloat. It gives you the essentials—retries, timeouts, and error handling—without forcing you to carry features you don't need.

If you need advanced features like interceptors or streaming, other libraries exist for that. But for straightforward API calls? FetchPlus does it right.

## Performance

- **Lightweight** - Minimal bundle footprint with zero external dependencies
- **Zero Dependencies** - No external packages to install or maintain
- **Fast** - Minimal overhead, direct fetch wrapper
- **Optimized** - Respects your bundle size and keeps applications lean

## Browser & Runtime Support

- **Node.js** 18+
- **Modern Browsers** (ES2022+)
  - Chrome 51+
  - Firefox 54+
  - Safari 10.1+
  - Edge 15+

## Development

FetchPlus is fully tested with 54 unit tests and real API integration tests.

### Run Tests

```bash
npm run test          # Run unit tests
npm run test:api      # Run real API tests
```

### Build

```bash
npm run build         # Compile TypeScript
npm run dev           # Watch mode
```

## License

MIT © Corex Anthony

## Contributing

Contributions, issues, and feature requests are welcome! Please feel free to check the [issues page](https://github.com/Corex24/fetchplus/issues).

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Changelog

### v0.1.0 
- Initial release
- HTTP methods: GET, POST, PUT, DELETE, PATCH
- Automatic retry with exponential backoff
- Request timeout support
- Structured error handling
- Full TypeScript support
- 54 unit tests with 100% passing
- Real API integration tests

## Support

If you have questions or need help:

1. Check the [examples](./examples/) directory for usage patterns
2. Review the [README](#) for API documentation
3. Open an issue on GitHub for bugs or feature requests

## Made with 💙

FetchPlus is maintained with care for developers who value simplicity, performance, and reliability.

