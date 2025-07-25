import React, {
  ComponentProps,
  createContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { ColorService } from "../di/services/ColorService";
import { ColorServiceFactory } from "../di/factories/ColorServiceFactory";

interface ColorContextState {
  color: string;
  generateColor: () => void;
}

const ColorContext = createContext<ColorContextState | null>(null);

export const ColorContextProvider: React.FC<{ children: ReactNode }> = (
  props
) => {
  // Instantiate the shared service
  const colorService = new ColorServiceFactory().Create();
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
    throw new Error("useColorContext must be used within a ColorContextProvider");
  }
  return context;
};