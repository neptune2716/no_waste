// AddPointForm.js
import React, { useState } from "react";
import axios from "axios";

const AddPointForm = ({ onClose, onAddPoint }) => {
  const [address, setAddress] = useState("");
  const [wasteTypes, setWasteTypes] = useState([]);
  const [type, setType] = useState("");
  const [hours, setHours] = useState("");

  const wasteOptions = [
    "glass_bottles",
    "paper",
    "glass",
    "plastic",
    "clothes",
    "cans",
    "plastic_bottles",
    "plastic_packaging",
    "waste",
    "cardboard",
    "shoes",
    "paper_packaging",
    "green_waste",
    "scrap_metal",
    "beverage_cartons",
    "batteries",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Obtenir les coordonnées via l'API Nominatim
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${address}`
      );
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        const coordinates = [parseFloat(lat), parseFloat(lon)];
        const itineraireUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;

        const newPoint = {
          adresse: address,
          latitude: lat,
          longitude: lon,
          itineraire_maps: itineraireUrl,
          type,
          horaires: hours,
          ...wasteTypes.reduce(
            (acc, wasteType) => ({ ...acc, [wasteType]: true }),
            {}
          ),
        };

        await axios.post("http://localhost:3000/recycling-points", newPoint);
        onAddPoint(newPoint);
        onClose();
      } else {
        alert("Adresse non trouvée.");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du point :", error);
      alert("Erreur lors de l'ajout du point.");
    }
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setWasteTypes((prevWasteTypes) => {
      if (checked) {
        return [...prevWasteTypes, name];
      } else {
        return prevWasteTypes.filter((type) => type !== name);
      }
    });
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "50px",
        right: "10px",
        zIndex: 1000,
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "5px",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
      }}
    >
      <h3>Ajouter un point de recyclage</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Adresse"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <div>
          <h4>Types de déchets acceptés</h4>
          {wasteOptions.map((waste) => (
            <label key={waste}>
              <input
                type="checkbox"
                name={waste}
                onChange={handleCheckboxChange}
              />
              {waste}
            </label>
          ))}
        </div>
        <input
          type="text"
          placeholder="Type de point (facultatif)"
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <input
          type="text"
          placeholder="Horaires (facultatif)"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <button type="submit" style={{ marginRight: "10px" }}>
          Ajouter
        </button>
        <button type="button" onClick={onClose}>
          Annuler
        </button>
      </form>
    </div>
  );
};

export default AddPointForm;
