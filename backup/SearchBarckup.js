import React, { useState } from "react";
import axios from "axios";

const SearchBar = ({ setCoordinates }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = async () => {
    if (query.trim() === "") return;

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
      );
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setCoordinates([parseFloat(lat), parseFloat(lon)], 14); // Zoom level set to 14
      } else {
        alert("Adresse non trouvée.");
      }
    } catch (error) {
      console.error("Erreur lors de la recherche d'adresse :", error);
      alert("Erreur lors de la recherche d'adresse.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="Rechercher une adresse"
        style={{
          width: "300px",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          marginRight: "10px",
        }}
      />
      <button onClick={handleSearch} style={{ padding: "10px 20px" }}>
        Rechercher
      </button>
    </div>
  );
};

export default SearchBar;
