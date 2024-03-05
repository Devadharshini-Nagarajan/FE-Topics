import React, { useState, useEffect } from "react";
import { usePWADisplayMode } from "./usePWADisplayMode";

function ServiceWorker() {
  const PWAStatus = usePWADisplayMode();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // TODO - later move this install prompt listen logic to main component and add deferredPrompt in redux
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", () => {
      console.log("PWA was installed");
      setIsAppInstalled(true);
    });

    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone
    ) {
      setIsAppInstalled(true);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const hideInstallPromotion = () => {};
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      hideInstallPromotion();

      deferredPrompt.prompt();

      const { outcome } = await deferredPrompt.userChoice;

      console.log(`User response to the install prompt: ${outcome}`);

      setDeferredPrompt(null);
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
          registration.sync.register("order").then(() => {
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

    indexedDBOpenRequest.onblocked = () => {
      console.error("IndexedDB blocked");
    };
  };

  return (
    <div className="flex flex-col">
      Mode: {PWAStatus}
      <div className="mt-5">
        <h1 className="text-3xl font-bold">PWA Prompt</h1>
        {!isAppInstalled && (
          <>
            <p>
              On click it gives prompt to install as PWA, It will be shown only
              when is in browser
            </p>
            <button
              className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleInstallClick(deferredPrompt)}
            >
              Install App
            </button>
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
    </div>
  );
}
export default ServiceWorker;
