import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './map.module.css';

// Dynamically import the Map component
const Map = dynamic(() => import('./MapComponent'), { ssr: false });

// Import d3 for color interpolation
import { scaleSequential } from 'd3-scale';
import {interpolateRdYlBu } from 'd3-scale-chromatic'; // Example color scale

const MapComponentAction = () => {
  const mapRef = useRef(null);
  const [apiData, setApiData] = useState(null);
  const [startDate, setStartDate] = useState("2024-09-01"); // Default start date
  const [endDate, setEndDate] = useState("2024-09-24");   // Default end date

  // Fetch API data based on selected date range
  const fetchData = async () => {
    try {
      console.log("Fetching data...");
      const response = await fetch(`https://vigent.saude.sp.gov.br/sisaweb_api/dados.php?tipo=4&id=471&inicio=${startDate}&final=${endDate}&exec=2&censitario=1`);
      const data = await response.json();
      setApiData(data);
      console.log("Data fetched:", data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Call fetchData whenever startDate or endDate changes
  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  // Function to create a GeoJSON layer based on data
  const createLayer = (dataKey, geoData, apiData) => {
    return L.geoJSON(geoData, {
      style: (feature) => {
        // Find the matching record in apiData based on the sector code
        const apiRecord = apiData.find((d) => `${d.censitario}P` === feature.properties.CD_SETOR);

        // Determine color based on the selected data key (e.g., 'focal', 'perifocal', etc.)
        const color = apiRecord && apiRecord[dataKey]
          ? getColor(apiRecord[dataKey])
          : "lightgrey";

        return {
          color: "grey",
          weight: 1,
          fillColor: color,
          fillOpacity: 0.7,
        };
      },
      onEachFeature: (feature, layer) => {
        // Find the matching apiRecord for the current feature
        const apiRecord = apiData.find((d) => `${d.censitario}P` === feature.properties.CD_SETOR);

        if (apiRecord && apiRecord[dataKey]) {
          // Add an event listener to show data on click
          layer.on('click', () => {
            const value = apiRecord[dataKey];
            layer.bindPopup(`
              <b>Sector: ${feature.properties.CD_SETOR}</b><br>
              ${dataKey}: ${value}
            `).openPopup();
          });
        }
      },
    });
  };

  // Helper function to determine color based on value
  const getColor = (value) => {
    // Define the color scale using d3's scaleSequential
    const colorScale = scaleSequential(interpolateRdYlBu).domain([0, getMaxValue()]);
    return colorScale(value); // Return the color for the given value
  };

  // Get the maximum value from the API data
  const getMaxValue = () => {
    const values = apiData.flatMap((record) => [
      record.focal, record.perifocal, record.nebulizacao, record.mecanico, record.alternativo
    ]);
    return Math.max(...values);
  };

  // Create and add the legend to the map
  const addLegend = (map) => {
    const legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {
      const div = L.DomUtil.create("div", "info legend");

      // Get min and max values from the dataset
      const minValue = 0;
      const maxValue = getMaxValue(); // Dynamically calculate max value based on data

      // Create a continuous color scale
      const colorScale = scaleSequential(interpolateRdYlBu).domain([minValue, maxValue]);

      // Create a div for the gradient bar
      const gradientDiv = L.DomUtil.create('div', 'legend-gradient');
      gradientDiv.style.height = '50px';  // Height of the gradient bar
      gradientDiv.style.width = '100px';   // Full width of the legend container
      gradientDiv.style.background = `linear-gradient(to right, ${colorScale(minValue)},${colorScale(maxValue/4)},${colorScale(maxValue/2)}, ${colorScale(3*maxValue/4)},${colorScale(maxValue)})`;

      // Add the gradient bar to the legend
      div.appendChild(gradientDiv);

      // Add labels at the start and end of the gradient
      const labelsDiv = L.DomUtil.create('div', 'legend-labels');
      labelsDiv.innerHTML = `
        <span style="float: left;">${minValue}</span>
        <span style="float: right;">${maxValue}</span>
      `;

      // Append the labels to the legend
      div.appendChild(labelsDiv);

      return div;
    };

    legend.addTo(map);
  };

  useEffect(() => {
    if (mapRef.current && apiData) {
      console.log("Initializing map...");

      const map = L.map(mapRef.current);

      L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CartoDB</a>',
        maxZoom: 19,
        id: 'cartodb/light_all',
        tileSize: 512,
        zoomOffset: -1,
      }).addTo(map);

      console.log("Map initialized");

      // Load GeoJSON and style features based on any of the selected parameters (e.g., 'focal', 'perifocal', etc.)
      fetch("/geo_setores.geojson")
        .then((res) => res.json())
        .then((geoData) => {
          console.log("GeoJSON data loaded:", geoData);

          // Set initial map bounds
          const bounds = L.geoJSON(geoData).getBounds();
          map.fitBounds(bounds); // Adjust the view to fit the bounds of the geoData

          // Create GeoJSON layers for each parameter (e.g., 'focal', 'perifocal', etc.)
          const geoLayerFocal = createLayer('focal', geoData, apiData);
          const geoLayerPerifocal = createLayer('perifocal', geoData, apiData);
          const geoLayerNebulizacao = createLayer('nebulizacao', geoData, apiData);
          const geoLayerMecanico = createLayer('mecanico', geoData, apiData);
          const geoLayerAlternativo = createLayer('alternativo', geoData, apiData);

          // Create layer groups for easy layer control
          const layerGroupFocal = L.layerGroup([geoLayerFocal]);
          const layerGroupPerifocal = L.layerGroup([geoLayerPerifocal]);
          const layerGroupNebulizacao = L.layerGroup([geoLayerNebulizacao]);
          const layerGroupMecanico = L.layerGroup([geoLayerMecanico]);
          const layerGroupAlternativo = L.layerGroup([geoLayerAlternativo]);

          // Add the layers to the map
          layerGroupFocal.addTo(map);
          layerGroupPerifocal.addTo(map);
          layerGroupNebulizacao.addTo(map);
          layerGroupMecanico.addTo(map);
          layerGroupAlternativo.addTo(map);

          // Add layer control to toggle between layers
          L.control.layers(
            { 
              "Focal": layerGroupFocal, 
              "Perifocal": layerGroupPerifocal,
              "Nebulizacao": layerGroupNebulizacao,
              "Mecanico": layerGroupMecanico,
              "Alternativo": layerGroupAlternativo
            },
            {},
            { collapsed: false }
          ).addTo(map);

          // Add the legend to the map
          addLegend(map);
        })
        .catch((error) => console.error("Error loading GeoJSON:", error));

      return () => map.remove();
    } else {
      console.log("Map or API data is missing.");
    }
  }, [apiData]);

  return (
    <div>
      <h1>Mapa de Dados de Ações</h1>

      {/* Date selection inputs */}
      <div>
        <label>
          Data de Início:
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
          />
        </label>

        <label>
          Data Final:
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
          />
        </label>
      </div>

      {/* Map container */}
      <div ref={mapRef} className={styles.map} style={{ height: '750px', width: '100%' }} />
    </div>
  );
};

export default MapComponentAction;
