import {request} from "./core/request";
import {withRetry} from "./features/retry";

type FetchPlusConfig = {
    baseURL?: string;
    headers?: Record<string, string>;
    timeout?: number;
    retries?: number;
};

function runRequestFactory(globalConfig: FetchPlusConfig) {
    return async function runRequest(
        method: string,
        url: string,
        config: FetchPlusConfig = {}
    ) {
        const mergedConfig = { 
            ...globalConfig, 
            ...config,
            headers: {
                ...globalConfig.headers,
                ...config.headers
            }
        };

        const { retries = 0 } = mergedConfig;

        return withRetry(
            () => request(method, url, mergedConfig),
            { retries }
        );
    };
}

export function createInstance(config: FetchPlusConfig = {}) {
    const runRequest = runRequestFactory(config);
    return {
        get: (url: string, cfg: FetchPlusConfig = {}) => runRequest("GET", url, cfg),
        post: (url: string, cfg: FetchPlusConfig = {}) => runRequest("POST", url, cfg),
        put: (url: string, cfg: FetchPlusConfig = {}) => runRequest("PUT", url, cfg),
        delete: (url: string, cfg: FetchPlusConfig = {}) => runRequest("DELETE", url, cfg),
        patch: (url: string, cfg: FetchPlusConfig = {}) => runRequest("PATCH", url, cfg),
        request: runRequest
    };
}