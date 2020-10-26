const path = require("path");

module.exports = {
   mode: "development",
   entry: "./build",
   output: {
      path: path.resolve(__dirname, "docs"),
      filename: "index.js",
   },
   module: {
      rules: [
         {
            test: /./,
            resolve: {
               fullySpecified: false,
            },
         },
      ],
   },
};
