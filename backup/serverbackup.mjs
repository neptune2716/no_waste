import express from "express";
import { createClient } from "@supabase/supabase-js";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); // Ajouté pour permettre le parsing du JSON dans les requêtes

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

// Ajout de la route PUT pour mettre à jour les points de recyclage
app.put("/recycling-points/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = req.body;

    // Échappez les caractères spéciaux dans les chaînes de caractères
    if (updateData.adresse) {
      updateData.adresse = updateData.adresse.replace(/'/g, "''");
    }

    // console.log("Received PUT request for ID:", id);
    // console.log("Updating point with ID:", id, "with data:", updateData);

    const { data, error } = await supabase
      .from("recycling_points")
      .update(updateData)
      .eq("id", id)
      .select(); // Assurez-vous de sélectionner les données après mise à jour

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    // console.log("Supabase response data:", data);

    if (!data || data.length === 0) {
      console.error("No data returned from Supabase");
      return res.status(404).send("Point not found");
    }

    // console.log("Successfully updated point:", data);
    res.json(data);
  } catch (err) {
    console.error("Error during PUT request:", err);
    res.status(500).send("Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
