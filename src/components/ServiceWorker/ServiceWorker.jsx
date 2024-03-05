import React, { useState, useContext } from "react";
import { MainContext } from "../../ProjectContext";

function ServiceWorker() {
  const [state, dispatch] = useContext(MainContext);
  const [orders, setOrders] = useState([]);

  const hideInstallPromotion = () => {};
  const handleInstallClick = async () => {
    if (state.deferredPrompt) {
      hideInstallPromotion();

      state.deferredPrompt.prompt();

      const { outcome } = await state.deferredPrompt.userChoice;

      console.log(`User response to the install prompt: ${outcome}`);

      dispatch({
        type: "UPDATE_DEFERRED_PROMPT",
        value: null,
      });
    }
  };

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  const saveOrder = async () => {
    var orderData = {
      name: `Product ${getRandomInt(1, 10)}`,
      price: getRandomInt(100, 900),
    };
    if (!navigator.onLine) {
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.sync) {
          registration.sync.register("add_order").then(() => {
            console.log("Sync order registered");
          });
        }
      });
      insertIntoDatabase(JSON.stringify(orderData));
      setOrders([...orders, orderData]);
    } else {
      // make online call
      setOrders([...orders, orderData]);
    }
  };

  const insertIntoDatabase = (dataObject) => {
    const indexedDBOpenRequest = window.indexedDB.open("order", 1);

    indexedDBOpenRequest.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create the object store only if it doesn't exist
      if (!db.objectStoreNames.contains("order_requests")) {
        db.createObjectStore("order_requests", {
          autoIncrement: true,
        });
      }
    };

    indexedDBOpenRequest.onsuccess = () => {
      const db = indexedDBOpenRequest.result;

      if (db.objectStoreNames.contains("order_requests")) {
        const transaction = db.transaction("order_requests", "readwrite");
        const storeObj = transaction.objectStore("order_requests");
        storeObj.add(dataObject);
      } else {
        console.error("Object store 'order_requests' not found");
      }
    };

    indexedDBOpenRequest.onerror = (error) => {
      console.error("IndexedDB error:", error);
    };
  };

  const handleBgFetchClick = async () => {
    try {
      let assetToFetchId = `series_${Date.now()}`;

      const registration = await navigator.serviceWorker.ready;

      let assetsData = {
        title: "My series",
        urls: ["/assets/asset_01.mp4", "/assets/asset_02.jpg"],
        downloadTotal: 4194304,
        icons: [
          {
            src: `/logo192.png`,
            size: "128x128",
            type: "image/png",
          },
        ],
      };

      const bgFetchRegistration = await registration.backgroundFetch.fetch(
        assetToFetchId,
        assetsData.urls.map((url) => `${process.env.PUBLIC_URL}${url}`),
        {
          icons: assetsData.icons,
          title: `Downloading ${assetsData.title}`,
          downloadTotal: assetsData.downloadTotal,
        }
      );
    } catch (err) {
      console.error("Bg Fetch", err);
    }
  };

  return (
    <div className="flex flex-col">
      Mode: {state.pwaStatus}
      <div className="mt-5">
        <h1 className="text-3xl font-bold">PWA Prompt</h1>

        {!state.isAppInstalled && (
          <>
            <p>
              On click it gives prompt to install as PWA, It will be shown only
              when is in browser
            </p>
            {state.pwaStatus === "browser" && (
              <button
                className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleInstallClick}
              >
                Install App
              </button>
            )}
          </>
        )}
      </div>
      <div className="mt-5">
        <h1 className="text-3xl font-bold">Background Sync</h1>
        <p>
          Turn off network and Add an Order, when it changes to online it makes
          API call
        </p>
        <div>
          <button
            className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={saveOrder}
          >
            Add order
          </button>
          <table className="mt-5">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((el, index) => (
                <tr key={index} className="bg-white">
                  <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium text-gray-900">
                    {el.name}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                    {el.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-5">
        <h1 className="text-3xl font-bold">Background Fetch</h1>
        <p>Download Video and close the tab, it will still download</p>
        <button
          className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleBgFetchClick}
        >
          Store assets locally
        </button>
      </div>
    </div>
  );
}
export default ServiceWorker;
