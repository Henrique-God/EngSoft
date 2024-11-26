import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { csv } from 'd3-fetch';
import { scaleSequential } from 'd3-scale';
import { interpolateYlOrRd } from 'd3-scale-chromatic'; // Yellow-Orange-Red color scale
import styles from './map.module.css';

const MapArea = () => {
  const mapRef = useRef(null);
  const [csvData, setCsvData] = useState([]);
  const [geoData, setGeoData] = useState(null);
  const [selectedDate, setSelectedDate] = useState('202201');
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
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
    fetch('/geo_areas_sjrp.geojson')
      .then(res => res.json())
      .then(data => {
        console.log('GeoJSON Data Loaded:', data); // Debugging GeoJSON data
        setGeoData(data);
      })
      .catch(error => console.error('Error loading GeoJSON:', error));
  }, []);

  useEffect(() => {
    csv(`/csv/periodo_area/output_${selectedDate}.csv`)
      .then(data => {
        console.log('CSV Data Loaded:', data); // Debugging CSV data
        setCsvData(data);
      })
      .catch(error => console.error('Error loading CSV:', error));
  }, [selectedDate]);

  const createLayer = (geoData, csvData) => {
    console.log('Creating Layer with GeoJSON and CSV Data'); // Debugging layer creation

    return L.geoJSON(geoData, {
      style: feature => {
        const areaName = feature.properties.ABRANGENCI; // Match 'ABRANGENCI' property from GeoJSON
        const record = csvData.find(d => d.ABRANGENCI === areaName); // Find matching area in CSV

        const color = record ? getColor(record.notificacoes) : 'lightgrey'; // Assuming 'notificacoes' is in CSV
        console.log(`Area: ${areaName}, Color: ${color}`); // Debugging color assignment
        return {
          color: 'grey',
          weight: 1,
          fillColor: color,
          fillOpacity: 0.7,
        };
      },
      onEachFeature: (feature, layer) => {
        const areaName = feature.properties.ABRANGENCI; // Match 'ABRANGENCI' property from GeoJSON
        const record = csvData.find(d => d.ABRANGENCI === areaName); // Find matching area in CSV

        if (record) {
          layer.on('click', () => {
            layer.bindPopup(`
              <b>Área: ${areaName}</b><br>
              Notificações: ${record.notificacoes}
            `).openPopup();
          });
        }
      },
    });
  };

  const getColor = value => {
    const colorScale = scaleSequential(interpolateYlOrRd).domain([0, 200]); // Scale from yellow to red (0-200 range)
    return colorScale(value);
  };

  const addLegend = map => {
    const existingLegends = document.querySelectorAll('.legend');
    existingLegends.forEach(legend => legend.remove());

    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'info legend');
      const colorScale = scaleSequential(interpolateYlOrRd).domain([0, 200]);

      const gradientDiv = L.DomUtil.create('div', 'legend-gradient');
      gradientDiv.style.height = '30px';
      gradientDiv.style.width = '200px';
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

      setMapInstance(map);

      L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CartoDB</a>',
        maxZoom: 19,
      }).addTo(map);

      const bounds = L.geoJSON(geoData).getBounds();
      map.fitBounds(bounds);

      return () => map.remove();
    }
  }, [geoData]);

  useEffect(() => {
    if (mapInstance && geoData && csvData.length) {
      const newLayer = createLayer(geoData, csvData);
      newLayer.addTo(mapInstance);
      addLegend(mapInstance);
    }
  }, [geoData, csvData, mapInstance]);

  return (
    <div>
      <h1>Mapa de Notificações por Período e por Área</h1>
      <label>
        Selecionar Data:{' '}
        <select
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
        >
          {generateDateOptions()}
        </select>
      </label>
      <div ref={mapRef} style={{ height: '600px', marginTop: '20px' }}></div>
    </div>
  );
};

export default MapArea;
