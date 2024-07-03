import test from "node:test";
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

test.displayName = "MapEventHandler";
export default MapEventHandler;
