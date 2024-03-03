import React, { useEffect, useRef, useState } from "react";
import WorkerFactory from "./WorkerFactory";
import workerFunction from "./square.worker.js";

function WebWorker(props) {
  const inputRef = useRef(null);
  const [webWorker, setWebWorker] = useState(null);
  const [workerValue, setWorkerValue] = useState(null);

  useEffect(() => {
    const worker = new WorkerFactory(workerFunction);

    worker.onmessage = (e) => {
      const data = e.data;
      setWorkerValue(data);
    };
    setWebWorker(worker);
    return () => {
      worker.terminate();
    };
  }, []);

  const onSend = () => {
    webWorker.postMessage(inputRef.current.value);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Web worker</h1>

      <div className="mt-3 p-3 border-2 border-grey-600">
        <h1 className="text-2xl font-bold text-indigo-700 mb-8">
          Dedicated Web worker
        </h1>
        <label
          for="num"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Number
        </label>
        <input
          type="number"
          id="num"
          class="w-16 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
          ref={inputRef}
        />
        <button
          type="button"
          class="mt-5 mb-10 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={onSend}
        >
          Send
        </button>
        <div>
          <b>Value: </b> {workerValue}
        </div>
      </div>
    </div>
  );
}

export default WebWorker;
