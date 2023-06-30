import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

let batchedRequests: InternalAxiosRequestConfig[] = [];
let batchedRequestTimeout: NodeJS.Timeout | null = null;

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
      batchedRequestTimeout = null;
    });
};

const batchRequest = (config: InternalAxiosRequestConfig): void => {
  batchedRequests.push(config);

  if (batchedRequestTimeout === null) {
    batchedRequestTimeout = setTimeout(sendBatchRequest, 2000);
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
