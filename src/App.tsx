import { FC } from "react";
import apiClient from "./utils/api-client";

const runRequests = () => {
  const batchUrl = "/file-batch-api";

  // Should return [{id:"fileid1"},{id:"fileid2"}]
  apiClient
    .get(batchUrl, { params: { ids: ["fileid1", "fileid5"] } })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
  // Should return [{id:"fileid2"}]
  apiClient
    .get(batchUrl, { params: { ids: ["fileid2", "fileid1"] } })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });

  // Should reject as the fileid3 is missing from the response
  apiClient
    .get(batchUrl, {
      params: { ids: ["fileid3", "fileid2", "fileid5", "fileid4"] },
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};

const App: FC = () => {
  return (
    <div className="App">
      <h3>Hello</h3>
      <button onClick={runRequests}>trigger 3 requests</button>
    </div>
  );
};

export default App;
