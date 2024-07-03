import express from "express";
import { createClient } from "@supabase/supabase-js";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const supabaseUrl = "https://tyybgchyzgeqfjmkyxxq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5eWJnY2h5emdlcWZqbWt5eHhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkyNjU4MjEsImV4cCI6MjAzNDg0MTgyMX0.-qU3PL6IhNu9jGD5zCmdR7PmB4ORip70eTkAEEIDckM";
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

// Ajouter une nouvelle route POST pour ajouter un point de recyclage
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
