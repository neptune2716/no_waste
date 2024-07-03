import React from "react";

const FilterComponent = ({ filters, setFilters }) => {
  // Fonction pour gérer le changement d'état des cases à cocher
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: checked,
    }));
  };

  // Fonction pour sélectionner tous les filtres
  const handleSelectAll = () => {
    const updatedFilters = Object.keys(filters).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setFilters(updatedFilters);
  };

  // Fonction pour désélectionner tous les filtres
  const handleDeselectAll = () => {
    const updatedFilters = Object.keys(filters).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {});
    setFilters(updatedFilters);
  };

  // Labels des filtres pour une meilleure lisibilité
  const filterLabels = {
    glass_bottles: "Bouteilles en verre",
    paper: "Papier",
    glass: "Verre",
    plastic: "Plastique",
    clothes: "Vêtements",
    cans: "Canettes",
    plastic_bottles: "Bouteilles en plastique",
    plastic_packaging: "Emballages en plastique",
    waste: "Déchets",
    cardboard: "Carton",
    shoes: "Chaussures",
    paper_packaging: "Emballages en papier",
    green_waste: "Déchets verts",
    scrap_metal: "Métal",
    beverage_cartons: "Cartons de boissons",
    batteries: "Batteries",
  };

  return (
    <div>
      <h3>Filtrer les points de recyclage</h3>
      <button onClick={handleSelectAll}>All</button>
      <button onClick={handleDeselectAll}>None</button>
      {Object.keys(filters).map((filterKey) => (
        <div key={filterKey}>
          <label>
            <input
              type="checkbox"
              name={filterKey}
              checked={filters[filterKey]}
              onChange={handleCheckboxChange}
            />
            {filterLabels[filterKey]}
          </label>
        </div>
      ))}
    </div>
  );
};

export default FilterComponent;
