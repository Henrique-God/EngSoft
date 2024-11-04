"use client";

import React, { useEffect, useRef } from 'react';
import { addressPoints } from '@/src/app/components/randomAdressPoints';

const MapComponent = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Import Leaflet and its styles inside useEffect to ensure they run only in the browser
    const L = require('leaflet');
    require('leaflet/dist/leaflet.css');
    require('leaflet.heat');

    // Initialize the map only in the browser
    if (mapRef.current) {
      const map = L.map(mapRef.current).setView([-37.88, 175.4], 10);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const heatmapPoints = addressPoints
        .filter(([lat, lng]) => lat !== null && lng !== null)
        .map(([lat, lng]) => [lat, lng, 0.5]);

      L.heatLayer(heatmapPoints, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
        max: 1,
      }).addTo(map);

      return () => {
        map.remove();
      };
    }
  }, []);

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',  // Full width of the container
        height: '600px' // Increased height for the map
      }}
    />
  );
};

export default MapComponent;
