import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { scaleSequential } from 'd3-scale';
import { interpolateRdYlGn } from 'd3-scale-chromatic';

const ImoveisPorArea = () => {
  const mapRef = useRef(null);
  const [apiData, setApiData] = useState(null);
  const [geoData, setGeoData] = useState(null);
  const [startDate, setStartDate] = useState("2024-09-01");
  const [endDate, setEndDate] = useState("2024-09-24");
  const [selectedDataKey, setSelectedDataKey] = useState("focal");

  // Fetch API data
  const fetchData = async () => {
    try {
      console.log(`Fetching data from ${startDate} to ${endDate}`); // Debug statement showing the selected period
      const response = await fetch(`https://vigent.saude.sp.gov.br/sisaweb_api/dados.php?tipo=4&id=471&inicio=${startDate}&final=${endDate}&exec=2&area=1`);
      const data = await response.json();
      setApiData(data);
    } catch (error) {
      console.error('Error fetching API data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  // Fetch GeoJSON data
  useEffect(() => {
    fetch('/geo_areas_sjrp.geojson')
      .then(res => res.json())
      .then(data => {
        setGeoData(data);
      })
      .catch(error => console.error('Error loading GeoJSON:', error));
  }, []);

  // Create a lookup for the API data
  const createApiDataLookup = (apiData) => {
    return apiData.reduce((acc, record) => {
      acc[record.area] = record; // Match GeoJSON 'COD_ABRG' to API data 'area'
      return acc;
    }, {});
  };

  // Helper function to determine color based on value
  const getColor = (value) => {
    const colorScale = scaleSequential(interpolateRdYlGn).domain([0, getMaxValue()]);
    return colorScale(value);
  };

  // Get the maximum value from the API data
  const getMaxValue = () => {
    const values = apiData.flatMap((record) => [
      record.focal, record.perifocal, record.nebulizacao, record.mecanico, record.alternativo
    ]);
    return Math.max(...values);
  };

  // Create a layer from GeoJSON data and API data
  const createLayer = (dataKey, geoData, apiDataLookup) => {
    return L.geoJSON(geoData, {
      style: (feature) => {
        const apiRecord = apiDataLookup[feature.properties.COD_ABRG];
        const color = apiRecord && apiRecord[dataKey] ? getColor(apiRecord[dataKey]) : 'lightgrey';
        return {
          color: 'grey',
          weight: 1,
          fillColor: color,
          fillOpacity: 0.7,
        };
      },
      onEachFeature: (feature, layer) => {
        const apiRecord = apiDataLookup[feature.properties.COD_ABRG];
        if (apiRecord && apiRecord[dataKey]) {
          layer.on('click', () => {
            const value = apiRecord[dataKey];
            layer.bindPopup(`
              <b>Area: ${feature.properties.ABRANGENCI}</b><br>
              ${dataKey}: ${value}
            `).openPopup();
          });
        }
      },
    });
  };

  // Function to create and add the legend to the map
  const addLegend = (map) => {
    const legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {
      const div = L.DomUtil.create("div", "info legend");

      const minValue = 0;
      const maxValue = getMaxValue();

      const colorScale = scaleSequential(interpolateRdYlGn).domain([minValue, maxValue]);

      // Create the gradient for the legend
      const gradientDiv = L.DomUtil.create('div', 'legend-gradient');
      gradientDiv.style.height = '50px';
      gradientDiv.style.width = '100px';
      gradientDiv.style.background = `linear-gradient(to right, ${colorScale(minValue)}, ${colorScale(maxValue / 4)}, ${colorScale(maxValue / 2)}, ${colorScale(3 * maxValue / 4)}, ${colorScale(maxValue)})`;

      div.appendChild(gradientDiv);

      // Create labels for the legend
      const labelsDiv = L.DomUtil.create('div', 'legend-labels');
      labelsDiv.innerHTML = `
        <span style="float: left;">${minValue}</span>
        <span style="float: right;">${maxValue}</span>
      `;

      div.appendChild(labelsDiv);

      return div;
    };

    legend.addTo(map);
  };

  useEffect(() => {
    if (mapRef.current && apiData && geoData) {
      console.log(`Map is initializing with data from ${startDate} to ${endDate}`); // Debug statement showing the selected period
      const map = L.map(mapRef.current);
      L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CartoDB</a>',
        maxZoom: 19,
        id: 'cartodb/light_all',
        tileSize: 512,
        zoomOffset: -1,
      }).addTo(map);

      console.log("Map initialized");

      // Create lookup for API data
      const apiDataLookup = createApiDataLookup(apiData);

      // Create layers for 'trabalhados' and 'nao_trabalhados'
      const geoLayerTrabalhados = createLayer('trabalhados', geoData, apiDataLookup);
      const geoLayerNaoTrabalhados = createLayer('nao_trabalhados', geoData, apiDataLookup);

      // Create layer groups for easy layer control
      const layerGroupTrabalhados = L.layerGroup([geoLayerTrabalhados]);
      const layerGroupNaoTrabalhados = L.layerGroup([geoLayerNaoTrabalhados]);

      // Add the layers to the map
      layerGroupTrabalhados.addTo(map);
      layerGroupNaoTrabalhados.addTo(map);

      // Add layer control to toggle between layers
      L.control.layers(
        { "Trabalhados": layerGroupTrabalhados, "Não Trabalhados": layerGroupNaoTrabalhados },
        {},
        { collapsed: false }
      ).addTo(map);

      // Add the legend to the map
      addLegend(map);

      // Set initial map bounds
      const bounds = L.geoJSON(geoData).getBounds();
      map.fitBounds(bounds); // Adjust the view to fit the bounds of the geoData

      // Cleanup function to remove the map when component unmounts
      return () => {
        map.remove(); // Removes the map instance from the DOM
      };
    } else {
      console.log("Map or API data is missing.");
    }
  }, [apiData, geoData]);

  return (
    <div>
      <h1>Mapa de Imóveis Trabalhados e Não Trabalhados</h1>
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
          Data de Fim:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
      </div>

      <div ref={mapRef} style={{ height: "600px", width: "100%" }}></div>
    </div>
  );
};

export default ImoveisPorArea;
