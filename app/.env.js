function defaultExport() {}

defaultExport.NODE_ENV = process.env.NODE_ENV || "development";
defaultExport.PORT = process.env.PORT || 3300;
defaultExport.ROOT = __dirname;

// defaultExport.API = "https://sandbox-api.dataafrica.io/";
// defaultExport.API = process.env.API || defaultExport.NODE_ENV === "development"
                  // ? "http://localhost:5000/" : "https://api.dataafrica.io/";
// defaultExport.ATTRS = process.env.ATTRS || `${defaultExport.API}attrs/list`;
// defaultExport.GOOGLE_ANALYTICS = "UA-########-#";

module.exports = defaultExport;
