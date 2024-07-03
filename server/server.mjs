import express from "express";
import { createClient } from "@supabase/supabase-js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Charger les variables d'environnement

const app = express();
const port = 3000;

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:3001",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.get("/recycling-points", async (req, res) => {
  try {
    const { ne_lat, ne_lng, sw_lat, sw_lng } = req.query;
    const { data, error } = await supabase
      .from("recycling_points")
      .select("*")
      .gte("latitude", sw_lat)
      .lte("latitude", ne_lat)
      .gte("longitude", sw_lng)
      .lte("longitude", ne_lng);

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.put("/recycling-points/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.adresse) {
      updateData.adresse = updateData.adresse.replace(/'/g, "''");
    }

    const { data, error } = await supabase
      .from("recycling_points")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      return res.status(404).send("Point not found");
    }

    res.json(data);
  } catch (err) {
    console.error("Error during PUT request:", err);
    res.status(500).send("Server Error");
  }
});

app.post("/recycling-points", async (req, res) => {
  try {
    const newPoint = req.body;
    const { data, error } = await supabase
      .from("recycling_points")
      .insert([newPoint]);

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    res.json(data);
  } catch (err) {
    console.error("Error during POST request:", err);
    res.status(500).send("Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
