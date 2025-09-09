declare module "react-simple-maps" {
    import * as React from "react";
  
    export interface ComposableMapProps {
      projection?: string;
      projectionConfig?: object;
      width?: number;
      height?: number;
      className?: string;
      style?: object;
      children: React.ReactNode;
    }
  
    export const ComposableMap: React.FC<ComposableMapProps>;
  
    export interface GeographiesProps {
      geography: string | object;
      children: (params: { geographies: any[]; projection: any }) => React.ReactNode;
    }
  
    export const Geographies: React.FC<GeographiesProps>;
  
    export interface GeographyProps {
      geography: any;
      style?: object;
    }
  
    export const Geography: React.FC<GeographyProps>;
  
    export interface MarkerProps {
      coordinates: [number, number];
      children: React.ReactNode;
    }
  
    export const Marker: React.FC<MarkerProps>;
  }
  