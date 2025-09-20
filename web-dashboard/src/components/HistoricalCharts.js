import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import 'chartjs-adapter-moment';
import moment from 'moment';
import './HistoricalCharts.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const HistoricalCharts = ({ data = [] }) => {
  const [timeRange, setTimeRange] = useState('7d');
  const [chartData, setChartData] = useState({
    heartRate: { labels: [], datasets: [] },
    spo2: { labels: [], datasets: [] },
    temperature: { labels: [], datasets: [] }
  });

  useEffect(() => {
    if (data.length > 0) {
      prepareChartData();
    }
  }, [data, timeRange]);

  const prepareChartData = () => {
    // Filter data based on selected time range
    const now = moment();
    const filteredData = data.filter(item => {
      const itemDate = moment(item.timestamp);
      if (timeRange === '7d') {
        return itemDate.isAfter(now.clone().subtract(7, 'days'));
      } else if (timeRange === '30d') {
        return itemDate.isAfter(now.clone().subtract(30, 'days'));
      }
      return true; // Default to all data
    });

    // Reduce data density by taking every nth point to avoid congestion
    const maxPoints = 50; // Limit to 50 points for better visibility
    const step = Math.max(1, Math.floor(filteredData.length / maxPoints));
    const sampledData = filteredData.filter((_, index) => index % step === 0);

    // Extract timestamps and values
    const timestamps = sampledData.map(item => moment(item.timestamp).format('MMM D, HH:mm'));
    const heartRates = sampledData.map(item => item.heart_rate);
    const spo2Values = sampledData.map(item => item.spo2);
    const temperatures = sampledData.map(item => item.temperature);

    // Prepare chart data objects
    setChartData({
      heartRate: {
        labels: timestamps,
        datasets: [
          {
            label: 'Heart Rate (BPM)',
            data: heartRates,
            borderColor: '#00ff88',
            backgroundColor: 'rgba(0, 255, 136, 0.1)',
            borderWidth: 4,
            pointBackgroundColor: '#00ff88',
            pointBorderColor: '#000000',
            pointBorderWidth: 3,
            pointRadius: 8,
            pointHoverRadius: 12,
            tension: 0.3,
            fill: false
          }
        ]
      },
      spo2: {
        labels: timestamps,
        datasets: [
          {
            label: 'SpO₂ (%)',
            data: spo2Values,
            borderColor: '#ffa502',
            backgroundColor: 'rgba(255, 165, 2, 0.1)',
            borderWidth: 4,
            pointBackgroundColor: '#ffa502',
            pointBorderColor: '#000000',
            pointBorderWidth: 3,
            pointRadius: 8,
            pointHoverRadius: 12,
            tension: 0.3,
            fill: false
          }
        ]
      },
      temperature: {
        labels: timestamps,
        datasets: [
          {
            label: 'Temperature (°F)',
            data: temperatures,
            borderColor: '#ff4757',
            backgroundColor: 'rgba(255, 71, 87, 0.1)',
            borderWidth: 4,
            pointBackgroundColor: '#ff4757',
            pointBorderColor: '#000000',
            pointBorderWidth: 3,
            pointRadius: 8,
            pointHoverRadius: 12,
            tension: 0.3,
            fill: false
          }
        ]
      }
    });
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index'
    },
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Date/Time',
          color: '#ffffff',
          font: { size: 14, weight: 'bold' }
        },
        grid: {
          color: 'rgba(0, 255, 136, 0.3)',
          borderColor: 'rgba(0, 255, 136, 0.5)',
          lineWidth: 1
        },
        ticks: {
          color: '#ffffff',
          font: { size: 11, weight: 'bold' },
          maxTicksLimit: 10,
          maxRotation: 45
        }
      },
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 255, 136, 0.3)',
          borderColor: 'rgba(0, 255, 136, 0.5)',
          lineWidth: 1
        },
        ticks: {
          color: '#00ff88',
          font: { size: 12, weight: 'bold' }
        }
      }
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 6,
        hoverRadius: 10,
        borderWidth: 3,
        hoverBorderWidth: 4
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#ffffff',
          font: { size: 16, weight: 'bold' },
          padding: 25,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        titleColor: '#00ff88',
        bodyColor: '#ffffff',
        borderColor: '#00ff88',
        borderWidth: 3,
        cornerRadius: 10,
        displayColors: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y;
            }
            return label;
          }
        }
      }
    }
  };

  // If no data available yet
  if (data.length === 0) {
    return (
      <div className="historical-charts-container">
        <div className="chart-controls">
          <h2>Historical Health Data</h2>
          <div className="time-range-selector">
            <button 
              className={`time-btn ${timeRange === '7d' ? 'active' : ''}`}
              onClick={() => setTimeRange('7d')}
            >
              7 Days
            </button>
            <button 
              className={`time-btn ${timeRange === '30d' ? 'active' : ''}`}
              onClick={() => setTimeRange('30d')}
            >
              30 Days
            </button>
          </div>
        </div>
        <div className="no-data-message">
          <p>No historical data available. Start the simulation to generate data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="historical-charts-container">
      <div className="chart-controls">
        <h2>Historical Health Data</h2>
        <div className="time-range-selector">
          <button 
            className={`time-btn ${timeRange === '7d' ? 'active' : ''}`}
            onClick={() => setTimeRange('7d')}
            aria-pressed={timeRange === '7d'}
          >
            7 Days
          </button>
          <button 
            className={`time-btn ${timeRange === '30d' ? 'active' : ''}`}
            onClick={() => setTimeRange('30d')}
            aria-pressed={timeRange === '30d'}
          >
            30 Days
          </button>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Heart Rate Trends</h3>
          <div className="chart-container">
            <Line options={chartOptions} data={chartData.heartRate} />
          </div>
          <div className="chart-insights">
            <p>Average: {data.length > 0 ? (data.reduce((sum, item) => sum + item.heart_rate, 0) / data.length).toFixed(1) : 0} BPM</p>
            <p>Normal Range: 60-100 BPM</p>
          </div>
        </div>

        <div className="chart-card">
          <h3>Oxygen Saturation Trends</h3>
          <div className="chart-container">
            <Line options={chartOptions} data={chartData.spo2} />
          </div>
          <div className="chart-insights">
            <p>Average: {data.length > 0 ? (data.reduce((sum, item) => sum + item.spo2, 0) / data.length).toFixed(1) : 0}%</p>
            <p>Normal Range: 95-100%</p>
          </div>
        </div>

        <div className="chart-card">
          <h3>Temperature Trends</h3>
          <div className="chart-container">
            <Line options={chartOptions} data={chartData.temperature} />
          </div>
          <div className="chart-insights">
            <p>Average: {data.length > 0 ? (data.reduce((sum, item) => sum + item.temperature, 0) / data.length).toFixed(1) : 0}°F</p>
            <p>Normal Range: 97.0-99.5°F</p>
          </div>
        </div>
      </div>

      <div className="chart-comparison">
        <h3>Comparative Analysis</h3>
        <p>Your metrics compared to population averages:</p>
        <div className="comparison-stats">
          <div className="stat-item">
            <span className="stat-label">Heart Rate:</span>
            <span className="stat-value">
              {data.length > 0 ? 
                `${((data.reduce((sum, item) => sum + item.heart_rate, 0) / data.length) / 72 * 100 - 100).toFixed(1)}% ${
                  (data.reduce((sum, item) => sum + item.heart_rate, 0) / data.length) > 72 ? 'higher' : 'lower'
                } than average` : 'No data'}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">SpO₂:</span>
            <span className="stat-value">
              {data.length > 0 ? 
                `${((data.reduce((sum, item) => sum + item.spo2, 0) / data.length) / 97.5 * 100 - 100).toFixed(1)}% ${
                  (data.reduce((sum, item) => sum + item.spo2, 0) / data.length) > 97.5 ? 'higher' : 'lower'
                } than average` : 'No data'}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Temperature:</span>
            <span className="stat-value">
              {data.length > 0 ? 
                `${((data.reduce((sum, item) => sum + item.temperature, 0) / data.length) / 98.6 * 100 - 100).toFixed(1)}% ${
                  (data.reduce((sum, item) => sum + item.temperature, 0) / data.length) > 98.6 ? 'higher' : 'lower'
                } than average` : 'No data'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoricalCharts;
