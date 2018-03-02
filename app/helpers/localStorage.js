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
