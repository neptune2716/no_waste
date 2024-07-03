// next.config.mjs
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import webpack from "webpack";

// Convertit import.meta.url en chemin de fichier
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charge les variables d'environnement depuis le fichier .env
dotenv.config({ path: path.resolve(__dirname, ".env") });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.module.rules.push({
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      });

      config.plugins.push(
        new webpack.DefinePlugin({
          "process.env.REACT_APP_BACKEND_URL": JSON.stringify(
            process.env.REACT_APP_BACKEND_URL
          ),
        })
      );
    }

    return config;
  },
};

export default nextConfig;
