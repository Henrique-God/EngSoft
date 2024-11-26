import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Papa from 'papaparse';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const NotificationRankingChart = () => {
  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(2022);

  // Load CSV data
  useEffect(() => {
    Papa.parse('/csv/summed_by_year_and_abrangencia.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        setData(result.data);
      },
    });
  }, []);

  // Filter data by year and sort areas based on notifications
  const getSortedDataForYear = (year) => {
    const filteredData = data.filter(item => item.year === year);
    const sortedData = filteredData.sort((a, b) => b.notificacoes - a.notificacoes);
    return sortedData;
  };

  // Prepare chart data for a specific year
  const prepareChartData = (year) => {
    const sortedData = getSortedDataForYear(year);
    const areas = sortedData.map(item => item.ABRANGENCI);
    const notificacoes = sortedData.map(item => item.notificacoes);

    return {
      labels: areas,
      datasets: [
        {
          label: `${year} - Notificações por Área`,
          data: notificacoes,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1,
        },
      ],
    };
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Ranking de Áreas por Notificações (${selectedYear})`,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.raw} notificações`,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          stepSize: 500, // Set step size for y-axis ticks
        },
      },
    },
  };

  return (
    <div>
      <h1>Ranking de Áreas por Notificações</h1>
      <select onChange={(e) => setSelectedYear(Number(e.target.value))} value={selectedYear}>
        <option value={2022}>2022</option>
        <option value={2023}>2023</option>
      </select>

      <div style={{ width: '100%', height: '600px' }}>
        {/* Bar chart for ranking notifications */}
        <Bar data={prepareChartData(selectedYear)} options={options} />
      </div>
    </div>
  );
};

export default NotificationRankingChart;
