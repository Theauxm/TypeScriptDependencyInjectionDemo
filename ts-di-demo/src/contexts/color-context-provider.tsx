import React, {
  createContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import {ServiceCollection} from "../di/ServiceCollection";

interface ColorContextState {
  color: string;
  generateColor: () => void;
}

const ColorContext = createContext<ColorContextState | null>(null);

// Service instantiation _outside_ of the context,
// to not create a new service instance every time this context renders
// Instantiate the shared service
const colorService = ServiceCollection.ColorServiceFactory.Create();

export const ColorContextProvider: React.FC<{ children: ReactNode }> = (
  props
) => {
  const [currentColor, setCurrentColor] = useState(colorService.getRgbColor());

  useEffect(() => {
    // Subscribe to color changes
    const unsubscribe = colorService.subscribe(() => {
      setCurrentColor(colorService.getRgbColor());
    });

    return unsubscribe;
  }, [colorService]);

  const handleGenerateColor = () => {
    colorService.generateNewColor();
  };

  return (
    <ColorContext.Provider
      value={{ color: currentColor, generateColor: handleGenerateColor }}
    >
      {props.children}
    </ColorContext.Provider>
  );
};

export const useColorContext = () => {
  const context = React.useContext(ColorContext);
  if (context === null) {
    throw new Error(
      "useColorContext must be used within a ColorContextProvider"
    );
  }
  return context;
};
