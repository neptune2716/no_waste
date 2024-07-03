const path = require("path");

module.exports = {
  entry: "./pages/index.tsx", // Fichier d'entrée principal
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  mode: "development", // Vous pouvez changer à 'production' pour le build de production
  resolve: {
    alias: {
      "node:test": false,
    },
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /node:test/,
        use: "null-loader",
      },
    ],
  },
};
