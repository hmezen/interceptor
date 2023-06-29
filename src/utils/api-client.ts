import axios from "axios";
import batchInterceptor from "./interceptor";

const instance = axios.create({
  baseURL: "https://europe-west1-quickstart-1573558070219.cloudfunctions.net",
});

batchInterceptor(instance, "/file-batch-api");

export default instance;
