import Mapbox from "@rnmapbox/maps";
import { createContext, Dispatch, SetStateAction, useState } from "react";

interface ContextValue {
  targetCoordinates: number[] | undefined;
  setTargetCoordinates: Dispatch<SetStateAction<number[] | undefined>>;
  currentLocation: Mapbox.Location | null;
  setCurrentLocation: Dispatch<SetStateAction<Mapbox.Location | null>>;
}

export const MapContext = createContext<ContextValue>(undefined!);

export const MapProvider = ({ children }: { children: React.ReactNode }) => {
  const [targetCoordinates, setTargetCoordinates] = useState<
    number[] | undefined
  >();
  const [currentLocation, setCurrentLocation] =
    useState<Mapbox.Location | null>(null);

  return (
    <MapContext.Provider
      value={{
        targetCoordinates,
        setTargetCoordinates,
        currentLocation,
        setCurrentLocation,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
