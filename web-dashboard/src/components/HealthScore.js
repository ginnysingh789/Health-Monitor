import React, { useState, useEffect } from 'react';
import { Doughnut, Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import './HealthScore.css';

// Register ChartJS components
ChartJS.register(ArcElement, LinearScale, PointElement, Tooltip, Legend);

const HealthScore = ({ data, historicalData = [] }) => {
  const [healthScore, setHealthScore] = useState(0);
  const [scoreBreakdown, setScoreBreakdown] = useState({
    heartRate: 0,
    spo2: 0,
    temperature: 0,
    activity: 0
  });
  const [correlationData, setCorrelationData] = useState({
    heartRateVsActivity: { datasets: [] },
    spo2VsHeartRate: { datasets: [] }
  });

  useEffect(() => {
    if (data) {
      calculateHealthScore();
    }
  }, [data]);

  useEffect(() => {
    if (historicalData.length > 10) {
      prepareCorrelationData();
    }
  }, [historicalData]);

  const calculateHealthScore = () => {
    // Heart rate score (0-25)
    let hrScore = 0;
    if (data.heart_rate >= 60 && data.heart_rate <= 100) {
      hrScore = 25; // Normal range
    } else if (data.heart_rate >= 50 && data.heart_rate < 60) {
      hrScore = 20; // Slightly low
    } else if (data.heart_rate > 100 && data.heart_rate <= 110) {
      hrScore = 20; // Slightly high
    } else if (data.heart_rate >= 40 && data.heart_rate < 50) {
      hrScore = 15; // Low
    } else if (data.heart_rate > 110 && data.heart_rate <= 120) {
      hrScore = 15; // High
    } else {
      hrScore = 10; // Very abnormal
    }

    // SpO2 score (0-25)
    let spo2Score = 0;
    if (data.spo2 >= 97) {
      spo2Score = 25; // Excellent
    } else if (data.spo2 >= 95 && data.spo2 < 97) {
      spo2Score = 23; // Normal
    } else if (data.spo2 >= 92 && data.spo2 < 95) {
      spo2Score = 18; // Slightly low
    } else if (data.spo2 >= 90 && data.spo2 < 92) {
      spo2Score = 15; // Low
    } else {
      spo2Score = 10; // Very low
    }

    // Temperature score (0-25)
    let tempScore = 0;
    if (data.temperature >= 97.5 && data.temperature <= 99.0) {
      tempScore = 25; // Normal
    } else if ((data.temperature >= 97.0 && data.temperature < 97.5) || 
               (data.temperature > 99.0 && data.temperature <= 99.5)) {
      tempScore = 22; // Slightly off
    } else if ((data.temperature >= 96.5 && data.temperature < 97.0) || 
               (data.temperature > 99.5 && data.temperature <= 100.0)) {
      tempScore = 18; // Moderately off
    } else if (data.temperature > 100.0 && data.temperature <= 101.0) {
      tempScore = 15; // Fever
    } else {
      tempScore = 10; // High fever or hypothermia
    }

    // Activity score (0-25)
    let activityScore = 0;
    switch (data.activity_level) {
      case 'active':
        activityScore = 25;
        break;
      case 'walking':
        activityScore = 22;
        break;
      case 'resting':
        activityScore = 20;
        break;
      case 'sleeping':
        activityScore = 18;
        break;
      default:
        activityScore = 20;
    }

    // Fall detection penalty
    if (data.fall_detected) {
      activityScore = Math.max(0, activityScore - 15);
    }

    // Update score breakdown
    setScoreBreakdown({
      heartRate: hrScore,
      spo2: spo2Score,
      temperature: tempScore,
      activity: activityScore
    });

    // Calculate total health score (0-100)
    const totalScore = hrScore + spo2Score + tempScore + activityScore;
    setHealthScore(totalScore);
  };

  const prepareCorrelationData = () => {
    // Heart Rate vs Activity Level correlation
    const activityLevels = {
      'sleeping': 1,
      'resting': 2,
      'walking': 3,
      'active': 4
    };

    const hrVsActivityData = historicalData.map(item => ({
      x: activityLevels[item.activity_level] || 2,
      y: item.heart_rate
    }));

    // SpO2 vs Heart Rate correlation
    const spo2VsHrData = historicalData.map(item => ({
      x: item.heart_rate,
      y: item.spo2
    }));

    setCorrelationData({
      heartRateVsActivity: {
        datasets: [
          {
            label: 'Heart Rate vs Activity',
            data: hrVsActivityData,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            pointRadius: 5,
            pointHoverRadius: 7
          }
        ]
      },
      spo2VsHeartRate: {
        datasets: [
          {
            label: 'SpO₂ vs Heart Rate',
            data: spo2VsHrData,
            backgroundColor: 'rgba(53, 162, 235, 0.6)',
            pointRadius: 5,
            pointHoverRadius: 7
          }
        ]
      }
    });
  };

  const doughnutData = {
    labels: ['Heart Rate', 'SpO₂', 'Temperature', 'Activity'],
    datasets: [
      {
        data: [
          scoreBreakdown.heartRate,
          scoreBreakdown.spo2,
          scoreBreakdown.temperature,
          scoreBreakdown.activity
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#fff',
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
      }
    }
  };

  const scatterOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Activity Level (1-4)',
          color: '#fff'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#fff'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Heart Rate (BPM)',
          color: '#fff'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#fff'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
      }
    }
  };

  const spo2VsHrOptions = {
    ...scatterOptions,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Heart Rate (BPM)',
          color: '#fff'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#fff'
        }
      },
      y: {
        title: {
          display: true,
          text: 'SpO₂ (%)',
          color: '#fff'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#fff'
        }
      }
    }
  };

  const getScoreCategory = () => {
    if (healthScore >= 90) return { text: 'Excellent', color: '#4CAF50' };
    if (healthScore >= 80) return { text: 'Very Good', color: '#8BC34A' };
    if (healthScore >= 70) return { text: 'Good', color: '#CDDC39' };
    if (healthScore >= 60) return { text: 'Fair', color: '#FFC107' };
    if (healthScore >= 50) return { text: 'Needs Attention', color: '#FF9800' };
    return { text: 'Concerning', color: '#F44336' };
  };

  const scoreCategory = getScoreCategory();

  if (!data) {
    return (
      <div className="health-score-container">
        <div className="no-data-message">
          <p>No health data available. Start the simulation to generate data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="health-score-container">
      <div className="score-overview">
        <div className="score-card">
          <h2>Overall Health Score</h2>
          <div className="score-display">
            <div className="score-circle" style={{ borderColor: scoreCategory.color }}>
              <span className="score-number">{healthScore}</span>
              <span className="score-max">/100</span>
            </div>
            <div className="score-category" style={{ color: scoreCategory.color }}>
              {scoreCategory.text}
            </div>
          </div>
        </div>

        <div className="score-breakdown-card">
          <h2>Score Breakdown</h2>
          <div className="chart-container">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
          <div className="breakdown-legend">
            <div className="breakdown-item">
              <span className="legend-color" style={{ backgroundColor: 'rgba(255, 99, 132, 0.7)' }}></span>
              <span className="legend-label">Heart Rate: {scoreBreakdown.heartRate}/25</span>
            </div>
            <div className="breakdown-item">
              <span className="legend-color" style={{ backgroundColor: 'rgba(54, 162, 235, 0.7)' }}></span>
              <span className="legend-label">SpO₂: {scoreBreakdown.spo2}/25</span>
            </div>
            <div className="breakdown-item">
              <span className="legend-color" style={{ backgroundColor: 'rgba(255, 206, 86, 0.7)' }}></span>
              <span className="legend-label">Temperature: {scoreBreakdown.temperature}/25</span>
            </div>
            <div className="breakdown-item">
              <span className="legend-color" style={{ backgroundColor: 'rgba(75, 192, 192, 0.7)' }}></span>
              <span className="legend-label">Activity: {scoreBreakdown.activity}/25</span>
            </div>
          </div>
        </div>
      </div>

      <div className="correlation-section">
        <h2>Correlation Analysis</h2>
        <p>Understanding relationships between your health metrics</p>
        
        <div className="correlation-grid">
          {historicalData.length > 10 ? (
            <>
              <div className="correlation-card">
                <h3>Heart Rate vs Activity Level</h3>
                <div className="chart-container">
                  <Scatter data={correlationData.heartRateVsActivity} options={scatterOptions} />
                </div>
                <div className="correlation-insight">
                  <p>Higher activity levels typically correlate with increased heart rates.</p>
                </div>
              </div>

              <div className="correlation-card">
                <h3>SpO₂ vs Heart Rate</h3>
                <div className="chart-container">
                  <Scatter data={correlationData.spo2VsHeartRate} options={spo2VsHrOptions} />
                </div>
                <div className="correlation-insight">
                  <p>SpO₂ levels may decrease with very high heart rates during intense activity.</p>
                </div>
              </div>
            </>
          ) : (
            <div className="no-data-message">
              <p>Not enough historical data for correlation analysis. Continue simulation to gather more data.</p>
            </div>
          )}
        </div>
      </div>

      <div className="health-recommendations">
        <h2>Personalized Recommendations</h2>
        <ul className="recommendations-list">
          {healthScore < 80 && scoreBreakdown.heartRate < 20 && (
            <li>
              <span className="recommendation-icon">❤️</span>
              <span className="recommendation-text">Monitor your heart rate. Consider consulting a healthcare provider if consistently abnormal.</span>
            </li>
          )}
          {healthScore < 80 && scoreBreakdown.spo2 < 20 && (
            <li>
              <span className="recommendation-icon">🫁</span>
              <span className="recommendation-text">Your oxygen levels are below optimal. Practice deep breathing exercises.</span>
            </li>
          )}
          {healthScore < 80 && scoreBreakdown.temperature < 20 && (
            <li>
              <span className="recommendation-icon">🌡️</span>
              <span className="recommendation-text">Your body temperature is outside normal range. Rest and monitor for changes.</span>
            </li>
          )}
          {healthScore < 80 && scoreBreakdown.activity < 20 && (
            <li>
              <span className="recommendation-icon">🏃</span>
              <span className="recommendation-text">Consider increasing your daily activity level for better overall health.</span>
            </li>
          )}
          {healthScore >= 80 && (
            <li>
              <span className="recommendation-icon">👍</span>
              <span className="recommendation-text">Your health metrics look good! Maintain your current habits.</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default HealthScore;
