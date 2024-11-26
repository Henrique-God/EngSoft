import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Papa from 'papaparse';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DataVisualization = () => {
  const [data, setData] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');

  // Load CSV data
  useEffect(() => {
    Papa.parse('/csv/grouped_by_abrangencia.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        setData(result.data);
        const areas = [...new Set(result.data.map(item => item.ABRANGENCI))];
        setSelectedArea(areas[0]); // Default to first area
      },
    });
  }, []);

  // Filter the data for a specific ABRANGENCI and year
  const filterData = (area, year) => {
    return data.filter(item => item.ABRANGENCI === area && item.mes_ano.toString().startsWith(year.toString()));
  };

  // Prepare chart data for both years
  const prepareChartData = (area) => {
    const data2022 = filterData(area, 2022);
    const data2023 = filterData(area, 2023);

    const labels2022 = data2022.map(item => item.mes_ano);
    const notificacoes2022 = data2022.map(item => item.notificacoes);

    const labels2023 = data2023.map(item => item.mes_ano);
    const notificacoes2023 = data2023.map(item => item.notificacoes);

    // Create a common set of labels (months in Portuguese) from Janeiro to Dezembro
    const months = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    return {
      labels: months,
      datasets: [
        {
          label: '2022',
          data: notificacoes2022,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
        {
          label: '2023',
          data: notificacoes2023,
          fill: false,
          borderColor: 'rgb(153, 102, 255)',
          tension: 0.1,
        },
      ],
    };
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Notificações por Mês',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.raw} notificações`,
        },
        // Tooltip styling
        titleFont: {
          size: 18, // Increase font size for tooltip title
        },
        bodyFont: {
          size: 16, // Increase font size for tooltip body
        },
      },
      legend: {
        labels: {
          font: {
            size: 16, // Increase the font size for the legend
          },
        },
      },
    },
    scales: {
      y: {
        min: 0, // Fixed minimum Y-axis value
        max: 700, // Fixed maximum Y-axis value
        ticks: {
          stepSize: 50, // Step size for Y-axis ticks
          font: {
            size: 16, // Increase the font size for Y-axis ticks
          },
        },
      },
      x: {
        ticks: {
          autoSkip: false, // Ensure no skipping of labels
          maxRotation: 0, // No label rotation
          stepSize: 1, // Place a label for every month
          font: {
            size: 16, // Increase the font size for X-axis labels
          },
        },
      },
    },
  };
  

  return (
    <div>
      <div>
        <h1>Gráfico de casos para {selectedArea} </h1>
        {/* Dropdown to select ABRANGENCI */}
        <select onChange={(e) => setSelectedArea(e.target.value)} value={selectedArea}>
          {Array.from(new Set(data.map(item => item.ABRANGENCI))).map((area, index) => (
            <option key={index} value={area}>{area}</option>
          ))}
        </select>
      </div>

      <div style={{ width: '100%', height: '600px' }}>
        {/* Combined line graph for both years */}
        <Line data={prepareChartData(selectedArea)} options={options} />
      </div>
    </div>
  );
};

export default DataVisualization;
