import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import MarkerClusterGroup from "./MarkerClusterGroup";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import FilterComponent from "./FilterComponent";
import SearchBar from "./SearchBar";
import AddPointButton from "./AddPointButton";
import AddPointForm from "./AddPointForm";
import "../src/style.css";

const customIcon = new L.Icon({
  iconUrl: "/icon.png",
  iconSize: [41, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "/shadow-icon.png",
  shadowSize: [41, 41],
  shadowAnchor: [11, 40],
});

const userLocationIcon = new L.Icon({
  iconUrl: "/icon_maloc.png",
  iconSize: [41, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
  shadowUrl: "/shadow-icon.png",
  shadowSize: [41, 41],
  shadowAnchor: [11, 40],
});

const searchicon = new L.Icon({
  iconUrl: "/icon_search.png",
  iconSize: [41, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
  shadowUrl: "/shadow-icon.png",
  shadowSize: [41, 41],
  shadowAnchor: [11, 40],
});

console.log("Backend URL at start:", process.env.REACT_APP_BACKEND_URL);

const fetchPointsWithinBounds = async (bounds) => {
  const { _northEast, _southWest } = bounds;
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  if (!backendUrl) {
    console.error("REACT_APP_BACKEND_URL is not defined");
    return [];
  }
  try {
    const response = await axios.get(
      `${backendUrl}/api/recycling-points?ne_lat=${_northEast.lat}&ne_lng=${_northEast.lng}&sw_lat=${_southWest.lat}&sw_lng=${_southWest.lng}&limit=100`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching points:", error);
    return [];
  }
};

const MapComponent = ({ setBounds, fetchPointsWithinBounds, setPoints }) => {
  const map = useMapEvents({
    moveend: async () => {
      const newBounds = map.getBounds();
      setBounds(newBounds);
      const newPoints = await fetchPointsWithinBounds(newBounds);
      setPoints(newPoints);
    },
  });

  useEffect(() => {
    map.setView(map.getCenter(), map.getZoom());
  }, [map]);

  return null;
};

const MoveMapOnClick = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 18);
    }
  }, [position, map]);

  return null;
};

const MarkerPopup = React.memo(({ point, setPoints, setMoveToPosition }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...point });
  const popupRef = useRef(null);

  const handleInputChange = (field, value) => {
    setEditData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      if (!backendUrl) {
        console.error("REACT_APP_BACKEND_URL is not defined");
        return;
      }
      const response = await axios.put(
        `${backendUrl}/api/recycling-points/${point.id}`,
        editData
      );
      if (response.status !== 200) {
        throw new Error("Failed to save changes");
      }
      setPoints((prevPoints) =>
        prevPoints.map((p) => (p.id === point.id ? { ...p, ...editData } : p))
      );
      setIsEditing(false);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des modifications :", error);
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleMarkerClick = () => {
    setMoveToPosition([point.latitude, point.longitude]);
  };

  const renderRecyclingTypes = (point, isEditing) => {
    const types = [
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
    const typeLabels = {
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

    if (isEditing) {
      return (
        <div>
          {types.map((type) => (
            <div key={type}>
              <label>
                <input
                  type="checkbox"
                  checked={!!editData[type]}
                  onChange={(e) => handleInputChange(type, e.target.checked)}
                />
                {typeLabels[type]}
              </label>
            </div>
          ))}
        </div>
      );
    }
    return types
      .filter((type) => point[type])
      .map((type) => typeLabels[type])
      .join(", ");
  };

  return (
    <Popup ref={popupRef} onOpen={handleMarkerClick}>
      <div>
        <strong>{point.adresse}</strong>
        <br />
        <a
          href={point.itineraire_maps}
          target="_blank"
          rel="noopener noreferrer"
        >
          Itinéraire
        </a>
        <br />
        {isEditing ? (
          <div>
            <input
              type="text"
              value={editData.horaires}
              onChange={(e) => handleInputChange("horaires", e.target.value)}
              placeholder="Horaires"
            />
            <br />
            <input
              type="text"
              value={editData.type}
              onChange={(e) => handleInputChange("type", e.target.value)}
              placeholder="Type de point"
            />
            <br />
            {renderRecyclingTypes(point, true)}
            <button
              onClick={handleSave}
              style={{
                backgroundColor: "blue",
                color: "white",
                borderRadius: "5px",
                padding: "5px 10px",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              Enregistrer
            </button>
          </div>
        ) : (
          <div>
            {point.horaires && <p>Horaires: {point.horaires}</p>}
            {point.type && <p>Type de point: {point.type}</p>}
            {renderRecyclingTypes(point, false) && (
              <p>
                Types de déchets acceptés: {renderRecyclingTypes(point, false)}
              </p>
            )}
            <button
              onClick={handleEditClick}
              style={{
                backgroundColor: "blue",
                color: "white",
                borderRadius: "5px",
                padding: "5px 10px",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              Modifier
            </button>
          </div>
        )}
      </div>
    </Popup>
  );
});

const TestMap = () => {
  const [points, setPoints] = useState([]);
  const [filteredPoints, setFilteredPoints] = useState([]);
  const [bounds, setBounds] = useState(null);
  const [filters, setFilters] = useState({
    glass_bottles: true,
    paper: true,
    glass: true,
    plastic: true,
    clothes: true,
    cans: true,
    plastic_bottles: true,
    plastic_packaging: true,
    waste: true,
    cardboard: true,
    shoes: true,
    paper_packaging: true,
    green_waste: true,
    scrap_metal: true,
    beverage_cartons: true,
    batteries: true,
  });
  const [coordinates, setCoordinates] = useState([46.603354, 1.888334]);
  const [userLocation, setUserLocation] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);
  const [moveToPosition, setMoveToPosition] = useState(null);
  const [showAddPointForm, setShowAddPointForm] = useState(false);
  const mapRef = useRef();

  const updateMapCenter = (newCoordinates, zoom = 15) => {
    setCoordinates(newCoordinates);
    if (mapRef.current) {
      mapRef.current.flyTo(newCoordinates, zoom);
    }
  };

  useEffect(() => {
    const fetchInitialPoints = async () => {
      const initialBounds = {
        _northEast: { lat: 50, lng: 10 },
        _southWest: { lat: 40, lng: 0 },
      };
      const initialPoints = await fetchPointsWithinBounds(initialBounds);
      setPoints(initialPoints);
    };
    fetchInitialPoints();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      const filtered = points.filter((point) =>
        Object.keys(filters).some((key) => filters[key] && point[key])
      );
      setFilteredPoints(filtered);
    };

    applyFilters();
  }, [filters, points]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          updateMapCenter([latitude, longitude], 14);
        },
        (error) => {
          console.error("Erreur de géolocalisation :", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    }
  }, []);

  useEffect(() => {
    if (moveToPosition) {
      if (mapRef.current) {
        mapRef.current.flyTo(moveToPosition, 18);
      }
      setMoveToPosition(null);
    }
  }, [moveToPosition]);

  const handleAddPoint = (newPoint) => {
    setPoints((prevPoints) => [...prevPoints, newPoint]);
  };

  return (
    <div className="content">
      <div id="map-container">
        <div id="filter-container">
          <FilterComponent filters={filters} setFilters={setFilters} />
        </div>
        <SearchBar
          setCoordinates={updateMapCenter}
          setSearchLocation={setSearchLocation}
        />
        <AddPointButton onClick={() => setShowAddPointForm(true)} />
        {showAddPointForm && (
          <AddPointForm
            onClose={() => setShowAddPointForm(false)}
            onAddPoint={handleAddPoint}
          />
        )}
        <MapContainer
          center={coordinates}
          zoom={6}
          className="leaflet-container"
          whenCreated={(mapInstance) => {
            mapRef.current = mapInstance;
          }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapComponent
            setBounds={setBounds}
            fetchPointsWithinBounds={fetchPointsWithinBounds}
            setPoints={setPoints}
          />
          {userLocation && (
            <>
              <MoveMapOnClick position={userLocation} />
              <Marker position={userLocation} icon={userLocationIcon}>
                <Popup>Vous êtes ici</Popup>
              </Marker>
            </>
          )}
          {searchLocation && (
            <>
              <MoveMapOnClick position={searchLocation} />
              <Marker position={searchLocation} icon={searchicon}>
                <Popup>Adresse recherchée</Popup>
              </Marker>
            </>
          )}
          <MarkerClusterGroup>
            {filteredPoints.map((point) => (
              <Marker
                key={point.id}
                position={[point.latitude, point.longitude]}
                icon={customIcon}
              >
                <MarkerPopup
                  point={point}
                  setPoints={setPoints}
                  setMoveToPosition={setMoveToPosition}
                />
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
    </div>
  );
};

TestMap.displayName = "TestMap";

export default TestMap;
