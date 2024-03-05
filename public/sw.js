const CACHE_NAME = "my-cache-v1";

const addResourcesToCache = async (resources) => {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(resources);
};

const putInCache = async (request, response) => {
  if (request.url.startsWith("chrome-extension://")) {
    return;
  }
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response);
};

const cacheFirst = async ({ request, fallbackUrl }) => {
  // First try to get the resource from the cache
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  // Next try to get the resource from the network
  try {
    const responseFromNetwork = await fetch(request.clone());
    // response may be used only once
    // we need to save clone to put one copy in cache
    // and serve second one
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    const fallbackResponse = await caches.match(fallbackUrl);
    if (fallbackResponse) {
      return fallbackResponse;
    }
    // when even the fallback response is not available,
    // there is nothing we can do, but we must always
    // return a Response object
    return new Response(
      `<html><body><h1>Network error happened</h1></body></html>`,
      {
        status: 408,
        headers: { "Content-Type": "text/html" },
      }
    );
  }
};

self.addEventListener("install", (event) => {
  console.log("Installing service");
  event.waitUntil(
    addResourcesToCache([
      "/",
      "/index.html",
      "/static/css/main.4a4daa38.css",
      "/static/css/main.4a4daa38.css.map",
      "/static/js/453.340b5978.chunk.js",
      "/static/js/453.340b5978.chunk.js.map",
      "/static/js/main.810845c5.js",
      "/static/js/main.810845c5.js.map",
      "/manifest.json",
      "/favicon.ico",
      "/logo192.png",
      "/logo512.png",
      "/static/js/bundle.js",
    ])
  );
});

self.addEventListener("activate", function (event) {
  console.log("Activating service");
  event.waitUntil(self.clients.claim());

  const cacheAllowList = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (!cacheAllowList.includes(key)) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  console.log("Fetching event", event.request.url);
  //   event.respondWith(
  //     cacheFirst({
  //       request: event.request,
  //       fallbackUrl: "",
  //     })
  //   );
  // or
  event.respondWith(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.match(event.request).then(function (response) {
        if (navigator.onLine) {
          return fetch(event.request).then(function (response) {
            if (event.request.method == "GET") {
              putInCache(event.request, response.clone());
            }
            return response;
          });
        } else {
          if (response) {
            return response;
          } else {
            return new Response(
              `<html><body><h1>Network error happened</h1></body></html>`,
              {
                status: 408,
                headers: { "Content-Type": "text/html" },
              }
            );
          }
        }
      });
    })
  );
});

self.addEventListener("sync", function (event) {
  if (event.tag == "order") {
    event.waitUntil(getOrderData());
  }
});

const URL = "application_endpoint_url";

function getOrderData() {
  var indexedDBOpenRequest = indexedDB.open("order", 1);
  indexedDBOpenRequest.onsuccess = function () {
    let db = indexedDBOpenRequest.result;
    let transaction = db.transaction("order_requests", "readwrite");
    let storeObj = transaction.objectStore("order_requests");
    var cursorRequest = storeObj.openCursor();
    cursorRequest.onsuccess = function (evt) {
      var cursor = evt.target.result;
      if (cursor) {
        console.log("cursor.value", cursor.value);
        sendTableOrder(cursor.value, cursor.key);
        cursor.continue();
      }
    };
  };
  indexedDBOpenRequest.onerror = function (error) {
    console.error("IndexedDB error:", error);
  };
}

function sendTableOrder(data, index) {
  fetch(URL + "orders", {
    method: "POST",
    body: JSON.stringify(data),
  }).then((response) => {
    if (response) {
      deleteFromIndexdb(index);
    }
  });
}

// delete data from indexedb, that sent to server
function deleteFromIndexdb(index) {
  var indexedDBOpenRequest = indexedDB.open("order", 1);
  indexedDBOpenRequest.onsuccess = function () {
    let db = this.result;
    let transaction = db.transaction("order_requests", "readwrite");
    let storeObj = transaction.objectStore("order_requests");
    storeObj.delete(index);
  };
}
