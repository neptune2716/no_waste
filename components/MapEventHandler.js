import { useMapEvents } from "react-leaflet";

const MapEventHandler = ({ setPoints }) => {
  useMapEvents({
    moveend: async () => {
      const bounds = mapEvents.getBounds();
      const newPoints = await fetchPointsWithinBounds(bounds);
      setPoints(newPoints);
    },
  });

  return null;
};

export default MapEventHandler;
