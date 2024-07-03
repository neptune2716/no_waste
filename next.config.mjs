import MiniCssExtractPlugin from "mini-css-extract-plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.module.rules.push({
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      });

      config.plugins.push(
        new MiniCssExtractPlugin({
          filename: "static/css/[name].[contenthash].css",
          chunkFilename: "static/css/[name].[contenthash].css",
        })
      );
    }

    // Ajouter cette règle pour ignorer les modules avec le schéma node:test
    config.module.rules.push({
      test: /node:test/,
      use: "null-loader",
    });

    // Ajoutez cette ligne pour désactiver le cache temporairement
    config.cache = false;

    return config;
  },
};

export default nextConfig;
