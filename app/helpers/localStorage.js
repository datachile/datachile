const isBrowser = "undefined" != typeof window;

export function saveToStorage(key, item) {
  try {
    const str = JSON.stringify(item);
    localStorage.setItem(key, str);
  } catch (err) {
    //ignore setItem errors
  }
}

export function getFromStorage(key) {
  try {
    const str = localStorage.getItem(key);
    if (str === null) {
      return [];
    }
    return JSON.parse(str);
  } catch (err) {
    return [];
  }
}

export function SyncStateAndLocalStorage(params, store) {
  console.log("store.map", store.map);
  var prm = new Promise((resolve, reject) => {
    resolve({
      key: "local_storage",
      data: getFromStorage("reduxcart")
    });
  });
  return {
    type: "GET_DATA",
    promise: prm
  };
}

export const SessionStorage = {
  clear() {
    return isBrowser ? sessionStorage.clear() : undefined;
  },
  set(key, data) {
    return isBrowser ? sessionStorage.setItem(key, data) : undefined;
  },
  get(key) {
    return isBrowser ? sessionStorage.getItem(key) : undefined;
  },
  setObject(key, data) {
    return this.set(key, JSON.stringify(data));
  },
  getObject(key) {
    const data = this.get(key);
    return data ? JSON.parse(data) : data;
  },
  getInPromise(key) {
    if (isBrowser && key in sessionStorage) {
      return Promise.resolve(sessionStorage.getItem(key));
    } else {
      return Promise.reject(undefined);
    }
  }
};
