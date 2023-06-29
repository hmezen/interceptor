import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const batchInterval = 2000; // two seconds
let batchedRequests: InternalAxiosRequestConfig[] = [];
let batchedRequestPromise: Promise<any> | null = null;

const getBatchedRequestsConfig = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  if (batchedRequests.length === 0) {
    return config;
  }

  const batchConfig = {
    ...config,
    params: {
      ids: [...new Set(batchedRequests.flatMap((req) => req.params.ids))],
    },
  };

  return batchConfig;
};

const sendBatchRequest = () => {
  if (batchedRequests.length === 0) {
    return;
  }

  axios(getBatchedRequestsConfig(batchedRequests[0]))
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      batchedRequests = [];
      batchedRequestPromise = null;
    });
};

const batchRequest = (config: InternalAxiosRequestConfig): void => {
  batchedRequests.push(config);

  if (batchedRequestPromise === null) {
    batchedRequestPromise = new Promise(() => {
      setTimeout(() => {
        sendBatchRequest();
      }, batchInterval);
    });
  }
};

const batchInterceptor = (instance: AxiosInstance, url: string): void => {
  instance.interceptors.request.use(
    (config) => {
      if (config.url === url) {
        batchRequest(config);

        return Promise.reject(new Error("request will be batched"));
      }

      return config;
    },
    (error) => Promise.reject(error)
  );
};

export default batchInterceptor;
