import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './map.module.css';
import { csv } from 'd3-fetch';
import { scaleSequential } from 'd3-scale';
import { interpolateYlOrRd } from 'd3-scale-chromatic'; // Green to Blue color scale

const MapPlot = () => {
  const mapRef = useRef(null);
  const [csvData, setCsvData] = useState([]);
  const [geoData, setGeoData] = useState(null);
  const [selectedDate, setSelectedDate] = useState('202201');
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const generateDateOptions = () => {
    const options = [];
    for (let year = 2022; year <= 2023; year++) {
      for (let month = 0; month < 12; month++) {
        const date = `${year}${String(month + 1).padStart(2, '0')}`;
        const label = `${monthNames[month]} ${year}`;
        options.push(
          <option key={date} value={date}>
            {label}
          </option>
        );
      }
    }
    return options;
  };

  useEffect(() => {
    fetch('/geo_setores.geojson')
      .then(res => res.json())
      .then(data => {
        setGeoData(data);
        console.log('GeoJSON loaded:', data); // Debugging
      })
      .catch(error => console.error('Error loading GeoJSON:', error));
  }, []);

  useEffect(() => {
    csv(`/csv/periodo/output_${selectedDate}.csv`)
      .then(data => {
        setCsvData(data);
        console.log('CSV loaded:', data); // Debugging
      })
      .catch(error => console.error('Error loading CSV:', error));
  }, [selectedDate]);

  const createLayer = (geoData, csvData) => {
    return L.geoJSON(geoData, {
      style: feature => {
        const sectorCode = feature.properties.CD_SETOR;
        const record = csvData.find(d => `${d.censitario}` === sectorCode);

        const color = record ? getColor(record.notificacoes) : 'lightgrey';
        console.log('Feature color:', color); // Debugging to check if the color is applied
        return {
          color: 'grey',
          weight: 1,
          fillColor: color,
          fillOpacity: 0.7,
        };
      },
      onEachFeature: (feature, layer) => {
        const sectorCode = feature.properties.CD_SETOR;
        const record = csvData.find(d => `${d.censitario}` === sectorCode);

        if (record) {
          layer.on('click', () => {
            layer.bindPopup(`
              <b>Setor: ${feature.properties.CD_SETOR}</b><br>
              Notificações: ${record.notificacoes}
            `).openPopup();
          });
        }
      },
    });
  };

  const getColor = value => {
    const colorScale = scaleSequential(interpolateYlOrRd).domain([0, 200]);  // Scale from yellow (0) to red (200)
    return colorScale(value);
  };

  const addLegend = (map) => {
    // Remove existing legends before adding a new one
    const existingLegends = document.querySelectorAll('.legend');
    existingLegends.forEach(legend => legend.remove());

    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'info legend');
      const colorScale = scaleSequential(interpolateYlOrRd).domain([0, 200]); // Fixed scale from 0 to 200

      const gradientDiv = L.DomUtil.create('div', 'legend-gradient');
      gradientDiv.style.height = '30px'; // Height of the gradient
      gradientDiv.style.width = '200px'; // Width of the gradient
      gradientDiv.style.background = `linear-gradient(to right, ${colorScale(0)}, ${colorScale(50)}, ${colorScale(100)}, ${colorScale(150)}, ${colorScale(200)})`;

      div.appendChild(gradientDiv);

      const labelsDiv = L.DomUtil.create('div', 'legend-labels');
      labelsDiv.style.display = 'flex';
      labelsDiv.style.justifyContent = 'space-between';
      labelsDiv.innerHTML = `
        <span>0</span>
        <span>50</span>
        <span>100</span>
        <span>150</span>
        <span>200</span>
      `;
      div.appendChild(labelsDiv);

      return div;
    };

    legend.addTo(map);
  };

  useEffect(() => {
    if (mapRef.current && geoData) {
      const map = L.map(mapRef.current, { zoomControl: false });
      const pane = map.createPane('customPane');
      pane.style.zIndex = 650; // Set the z-index for layering order

      // Set up the map instance
      setMapInstance(map);

      L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CartoDB</a>',
        maxZoom: 19,
        id: 'cartodb/light_all',
        tileSize: 512,
        zoomOffset: -1,
      }).addTo(map);

      // Ensure the map fits the bounds of the GeoJSON data
      const bounds = L.geoJSON(geoData).getBounds();
      console.log('GeoJSON Bounds:', bounds); // Debugging to check the bounds
      map.fitBounds(bounds);

      // Listen for the map to finish loading before performing further actions
      map.on('load', () => {
        // Now that the map is fully loaded, proceed with adding layers
        if (csvData.length && geoData) {
          const newLayer = createLayer(geoData, csvData);
          newLayer.addTo(map); // Add the layer to the map
          addLegend(map); // Add the legend to the map
        }
      });

      // Cleanup function to remove the map when unmounted
      return () => map.remove();
    }
  }, [geoData]);

  useEffect(() => {
    // Ensure that mapInstance is available and only add the layer when it's ready
    if (mapInstance && csvData.length && geoData) {
      const newLayer = createLayer(geoData, csvData);
      newLayer.addTo(mapInstance); // Add the layer after map is fully initialized
      addLegend(mapInstance); // Add or update the legend
    }
  }, [csvData, geoData, mapInstance]);

  return (
    <div>
      <h1>Notificações por Período</h1>
      <label>
        Selecionar Data:{' '}
        <select
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
        >
          {generateDateOptions()}
        </select>
      </label>
      <div ref={mapRef} style={{ height: '650px', marginTop: '20px' }}></div>
    </div>
  );
};

export default MapPlot;
