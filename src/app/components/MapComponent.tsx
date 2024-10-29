// src/app/components/MapComponent.tsx
"use client"; // Add this line to mark the file as a client component

import React, { createContext, useContext } from 'react'; 
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Import marker images directly
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix default icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Create a context for Leaflet (if you need one)
export const LeafletContext = createContext(null);
export const LeafletProvider = LeafletContext.Provider;

export function useLeafletContext() {
  const context = useContext(LeafletContext);
  if (!context) {
    throw new Error('useLeafletContext must be used within a LeafletProvider');
  }
  return context;
}

const MapComponent: React.FC = () => {
  const position: [number, number] = [51.505, -0.09]; // Latitude and Longitude of the center

  return (
    <MapContainer center={position} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
