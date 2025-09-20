import React, { useState, useEffect } from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import 'chartjs-adapter-moment';
import moment from 'moment';
import './SleepAnalysis.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const SleepAnalysis = ({ data = [] }) => {
  const [sleepData, setSleepData] = useState(() => {
    const savedSleep = localStorage.getItem('sleepData');
    return savedSleep ? JSON.parse(savedSleep) : [
      {
        id: 1,
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        bedtime: '22:30',
        wakeTime: '07:00',
        sleepDuration: 8.5,
        sleepQuality: 85,
        deepSleep: 2.1,
        lightSleep: 5.4,
        remSleep: 1.0,
        awakenings: 2,
        notes: 'Good night sleep'
      },
      {
        id: 2,
        date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
        bedtime: '23:15',
        wakeTime: '06:45',
        sleepDuration: 7.5,
        sleepQuality: 72,
        deepSleep: 1.8,
        lightSleep: 4.9,
        remSleep: 0.8,
        awakenings: 3,
        notes: 'Woke up a few times'
      },
      {
        id: 3,
        date: new Date(Date.now() - 259200000).toISOString().split('T')[0],
        bedtime: '22:00',
        wakeTime: '07:30',
        sleepDuration: 9.5,
        sleepQuality: 92,
        deepSleep: 2.8,
        lightSleep: 5.7,
        remSleep: 1.0,
        awakenings: 1,
        notes: 'Excellent sleep'
      }
    ];
  });

  const [newSleepEntry, setNewSleepEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    bedtime: '22:30',
    wakeTime: '07:00',
    sleepQuality: 80,
    awakenings: 1,
    notes: ''
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [sleepInsights, setSleepInsights] = useState({});

  // Save sleep data to localStorage
  useEffect(() => {
    localStorage.setItem('sleepData', JSON.stringify(sleepData));
  }, [sleepData]);

  // Calculate sleep insights
  useEffect(() => {
    calculateSleepInsights();
  }, [sleepData]);

  const calculateSleepDuration = (bedtime, wakeTime) => {
    const bedtimeDate = moment(bedtime, 'HH:mm');
    let wakeTimeDate = moment(wakeTime, 'HH:mm');
    
    // If wake time is earlier than bedtime, it's the next day
    if (wakeTimeDate.isBefore(bedtimeDate)) {
      wakeTimeDate.add(1, 'day');
    }
    
    const duration = moment.duration(wakeTimeDate.diff(bedtimeDate));
    return duration.asHours();
  };

  const calculateSleepStages = (duration, quality) => {
    // Estimate sleep stages based on duration and quality
    const deepSleepPercentage = Math.max(0.15, Math.min(0.25, quality / 400));
    const remSleepPercentage = Math.max(0.10, Math.min(0.15, quality / 600));
    const lightSleepPercentage = 1 - deepSleepPercentage - remSleepPercentage;
    
    return {
      deepSleep: parseFloat((duration * deepSleepPercentage).toFixed(1)),
      lightSleep: parseFloat((duration * lightSleepPercentage).toFixed(1)),
      remSleep: parseFloat((duration * remSleepPercentage).toFixed(1))
    };
  };

  const calculateSleepInsights = () => {
    if (sleepData.length === 0) return;

    const avgDuration = sleepData.reduce((sum, entry) => sum + entry.sleepDuration, 0) / sleepData.length;
    const avgQuality = sleepData.reduce((sum, entry) => sum + entry.sleepQuality, 0) / sleepData.length;
    const avgAwakenings = sleepData.reduce((sum, entry) => sum + entry.awakenings, 0) / sleepData.length;
    
    // Calculate sleep consistency (how consistent bedtime is)
    const bedtimes = sleepData.map(entry => {
      const [hours, minutes] = entry.bedtime.split(':').map(Number);
      return hours * 60 + minutes;
    });
    const avgBedtime = bedtimes.reduce((sum, time) => sum + time, 0) / bedtimes.length;
    const bedtimeVariance = bedtimes.reduce((sum, time) => sum + Math.pow(time - avgBedtime, 2), 0) / bedtimes.length;
    const consistency = Math.max(0, 100 - Math.sqrt(bedtimeVariance) / 2);

    setSleepInsights({
      avgDuration: parseFloat(avgDuration.toFixed(1)),
      avgQuality: parseFloat(avgQuality.toFixed(1)),
      avgAwakenings: parseFloat(avgAwakenings.toFixed(1)),
      consistency: parseFloat(consistency.toFixed(1))
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSleepEntry(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSleepEntry = (e) => {
    e.preventDefault();
    
    const duration = calculateSleepDuration(newSleepEntry.bedtime, newSleepEntry.wakeTime);
    const stages = calculateSleepStages(duration, newSleepEntry.sleepQuality);
    
    const newEntry = {
      id: Date.now(),
      ...newSleepEntry,
      sleepDuration: parseFloat(duration.toFixed(1)),
      ...stages,
      sleepQuality: parseInt(newSleepEntry.sleepQuality),
      awakenings: parseInt(newSleepEntry.awakenings)
    };
    
    setSleepData(prev => [...prev, newEntry]);
    setNewSleepEntry({
      date: new Date().toISOString().split('T')[0],
      bedtime: '22:30',
      wakeTime: '07:00',
      sleepQuality: 80,
      awakenings: 1,
      notes: ''
    });
    setShowAddForm(false);
  };

  const handleDeleteEntry = (id) => {
    if (window.confirm('Are you sure you want to delete this sleep entry?')) {
      setSleepData(prev => prev.filter(entry => entry.id !== id));
    }
  };

  // Sort sleep data by date (newest first)
  const sortedSleepData = [...sleepData].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Prepare chart data
  const last7Days = sleepData
    .filter(entry => moment(entry.date).isAfter(moment().subtract(7, 'days')))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const sleepTrendsData = {
    labels: last7Days.map(entry => moment(entry.date).format('MMM D')),
    datasets: [
      {
        label: 'Sleep Duration (hours)',
        data: last7Days.map(entry => entry.sleepDuration),
        borderColor: '#00ff88',
        backgroundColor: 'rgba(0, 255, 136, 0.2)',
        borderWidth: 3,
        pointBackgroundColor: '#00ff88',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        tension: 0.3
      },
      {
        label: 'Sleep Quality (%)',
        data: last7Days.map(entry => entry.sleepQuality),
        borderColor: '#ffa502',
        backgroundColor: 'rgba(255, 165, 2, 0.2)',
        borderWidth: 3,
        pointBackgroundColor: '#ffa502',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        tension: 0.3,
        yAxisID: 'y1'
      }
    ]
  };

  const sleepStagesData = sleepData.length > 0 ? {
    labels: ['Deep Sleep', 'Light Sleep', 'REM Sleep'],
    datasets: [
      {
        data: [
          sleepData.reduce((sum, entry) => sum + entry.deepSleep, 0) / sleepData.length,
          sleepData.reduce((sum, entry) => sum + entry.lightSleep, 0) / sleepData.length,
          sleepData.reduce((sum, entry) => sum + entry.remSleep, 0) / sleepData.length
        ],
        backgroundColor: [
          'rgba(0, 255, 136, 0.8)',
          'rgba(255, 165, 2, 0.8)',
          'rgba(255, 71, 87, 0.8)'
        ],
        borderColor: [
          '#00ff88',
          '#ffa502',
          '#ff4757'
        ],
        borderWidth: 1
      }
    ]
  } : { labels: [], datasets: [] };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        grid: { 
          color: 'rgba(0, 255, 136, 0.2)',
          borderColor: 'rgba(0, 255, 136, 0.3)'
        },
        ticks: { 
          color: '#00ff88',
          font: { size: 12, weight: 'bold' }
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: { drawOnChartArea: false },
        ticks: { 
          color: '#ffa502',
          font: { size: 12, weight: 'bold' }
        }
      },
      x: {
        grid: { 
          color: 'rgba(0, 255, 136, 0.1)',
          borderColor: 'rgba(0, 255, 136, 0.3)'
        },
        ticks: { 
          color: '#ffffff',
          font: { size: 12, weight: 'bold' }
        }
      }
    },
    plugins: {
      legend: {
        labels: { 
          color: '#ffffff',
          font: { size: 14, weight: 'bold' },
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#00ff88',
        bodyColor: '#ffffff',
        borderColor: '#00ff88',
        borderWidth: 2
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { 
          color: '#ffffff', 
          padding: 15,
          font: { size: 14, weight: 'bold' }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#00ff88',
        bodyColor: '#ffffff',
        borderColor: '#00ff88',
        borderWidth: 2,
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed.toFixed(1)} hours`;
          }
        }
      }
    }
  };

  const getSleepQualityColor = (quality) => {
    if (quality >= 85) return '#4CAF50';
    if (quality >= 70) return '#FF9800';
    return '#f44336';
  };

  const getSleepRecommendations = () => {
    const recommendations = [];
    
    if (sleepInsights.avgDuration < 7) {
      recommendations.push({
        icon: '⏰',
        text: `Your average sleep duration is ${sleepInsights.avgDuration} hours. Aim for 7-9 hours per night.`
      });
    }
    
    if (sleepInsights.avgQuality < 75) {
      recommendations.push({
        icon: '💤',
        text: 'Your sleep quality could be improved. Consider a consistent bedtime routine and limiting screen time before bed.'
      });
    }
    
    if (sleepInsights.consistency < 70) {
      recommendations.push({
        icon: '🕐',
        text: 'Try to maintain a consistent sleep schedule by going to bed and waking up at the same time daily.'
      });
    }
    
    if (sleepInsights.avgAwakenings > 2) {
      recommendations.push({
        icon: '🌙',
        text: 'You wake up frequently during the night. Consider optimizing your sleep environment (temperature, noise, light).'
      });
    }
    
    return recommendations;
  };

  return (
    <div className="sleep-analysis-container">
      <div className="sleep-header">
        <h2>Sleep Analysis</h2>
        <button 
          className="add-sleep-btn"
          onClick={() => setShowAddForm(!showAddForm)}
          aria-label={showAddForm ? "Cancel adding sleep entry" : "Add new sleep entry"}
        >
          {showAddForm ? 'Cancel' : '+ Add Sleep Entry'}
        </button>
      </div>

      {showAddForm && (
        <form className="add-sleep-form" onSubmit={handleAddSleepEntry}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="sleep-date">Date</label>
              <input
                id="sleep-date"
                type="date"
                name="date"
                value={newSleepEntry.date}
                onChange={handleInputChange}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="sleep-quality">Sleep Quality (1-100)</label>
              <input
                id="sleep-quality"
                type="range"
                name="sleepQuality"
                min="1"
                max="100"
                value={newSleepEntry.sleepQuality}
                onChange={handleInputChange}
              />
              <span className="range-value">{newSleepEntry.sleepQuality}%</span>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="bedtime">Bedtime</label>
              <input
                id="bedtime"
                type="time"
                name="bedtime"
                value={newSleepEntry.bedtime}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="wake-time">Wake Time</label>
              <input
                id="wake-time"
                type="time"
                name="wakeTime"
                value={newSleepEntry.wakeTime}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="awakenings">Number of Awakenings</label>
              <input
                id="awakenings"
                type="number"
                name="awakenings"
                min="0"
                max="20"
                value={newSleepEntry.awakenings}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="sleep-notes">Notes (optional)</label>
              <input
                id="sleep-notes"
                type="text"
                name="notes"
                value={newSleepEntry.notes}
                onChange={handleInputChange}
                placeholder="How did you sleep?"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn">Save Sleep Entry</button>
          </div>
        </form>
      )}

      <div className="sleep-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
          aria-pressed={activeTab === 'overview'}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'trends' ? 'active' : ''}
          onClick={() => setActiveTab('trends')}
          aria-pressed={activeTab === 'trends'}
        >
          Trends
        </button>
        <button 
          className={activeTab === 'entries' ? 'active' : ''}
          onClick={() => setActiveTab('entries')}
          aria-pressed={activeTab === 'entries'}
        >
          Sleep Log
        </button>
        <button 
          className={activeTab === 'insights' ? 'active' : ''}
          onClick={() => setActiveTab('insights')}
          aria-pressed={activeTab === 'insights'}
        >
          Insights
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="sleep-overview">
          <div className="sleep-stats">
            <div className="stat-card">
              <h3>Average Duration</h3>
              <div className="stat-value">{sleepInsights.avgDuration || 0}h</div>
              <div className="stat-label">per night</div>
            </div>
            <div className="stat-card">
              <h3>Average Quality</h3>
              <div className="stat-value" style={{ color: getSleepQualityColor(sleepInsights.avgQuality || 0) }}>
                {sleepInsights.avgQuality || 0}%
              </div>
              <div className="stat-label">sleep quality</div>
            </div>
            <div className="stat-card">
              <h3>Sleep Consistency</h3>
              <div className="stat-value">{sleepInsights.consistency || 0}%</div>
              <div className="stat-label">schedule consistency</div>
            </div>
            <div className="stat-card">
              <h3>Avg Awakenings</h3>
              <div className="stat-value">{sleepInsights.avgAwakenings || 0}</div>
              <div className="stat-label">per night</div>
            </div>
          </div>

          {sleepData.length > 0 && (
            <div className="sleep-stages-chart">
              <h3>Average Sleep Stages</h3>
              <div className="chart-container">
                <Doughnut data={sleepStagesData} options={doughnutOptions} />
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'trends' && (
        <div className="sleep-trends">
          {last7Days.length > 0 ? (
            <div className="trend-chart">
              <h3>7-Day Sleep Trends</h3>
              <div className="chart-container">
                <Line data={sleepTrendsData} options={chartOptions} />
              </div>
            </div>
          ) : (
            <div className="no-data">
              <p>Not enough data to show trends. Add more sleep entries to see your patterns.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'entries' && (
        <div className="sleep-entries">
          {sortedSleepData.length === 0 ? (
            <div className="no-entries">
              <p>No sleep entries yet. Click the button above to add your first entry.</p>
            </div>
          ) : (
            <div className="entries-list">
              {sortedSleepData.map(entry => (
                <div key={entry.id} className="sleep-entry">
                  <div className="entry-date">
                    <h4>{moment(entry.date).format('MMM D, YYYY')}</h4>
                    <span className="day-of-week">{moment(entry.date).format('dddd')}</span>
                  </div>
                  <div className="entry-details">
                    <div className="sleep-time">
                      <span className="label">Sleep:</span>
                      <span className="value">{entry.bedtime} - {entry.wakeTime}</span>
                    </div>
                    <div className="sleep-duration">
                      <span className="label">Duration:</span>
                      <span className="value">{entry.sleepDuration}h</span>
                    </div>
                    <div className="sleep-quality">
                      <span className="label">Quality:</span>
                      <span className="value" style={{ color: getSleepQualityColor(entry.sleepQuality) }}>
                        {entry.sleepQuality}%
                      </span>
                    </div>
                    <div className="awakenings">
                      <span className="label">Awakenings:</span>
                      <span className="value">{entry.awakenings}</span>
                    </div>
                    {entry.notes && (
                      <div className="sleep-notes">
                        <span className="label">Notes:</span>
                        <span className="value">{entry.notes}</span>
                      </div>
                    )}
                  </div>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteEntry(entry.id)}
                    aria-label={`Delete sleep entry for ${moment(entry.date).format('MMM D')}`}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="sleep-insights">
          <div className="recommendations">
            <h3>Personalized Recommendations</h3>
            {getSleepRecommendations().length === 0 ? (
              <div className="no-recommendations">
                <p>Great job! Your sleep patterns look healthy. Keep maintaining your good sleep habits.</p>
              </div>
            ) : (
              <div className="recommendations-list">
                {getSleepRecommendations().map((rec, index) => (
                  <div key={index} className="recommendation-item">
                    <div className="recommendation-icon">{rec.icon}</div>
                    <div className="recommendation-text">{rec.text}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="sleep-tips">
            <h3>Sleep Hygiene Tips</h3>
            <ul>
              <li>Maintain a consistent sleep schedule, even on weekends</li>
              <li>Create a relaxing bedtime routine</li>
              <li>Keep your bedroom cool, dark, and quiet</li>
              <li>Avoid caffeine, alcohol, and large meals before bedtime</li>
              <li>Limit screen time 1-2 hours before bed</li>
              <li>Get regular exercise, but not close to bedtime</li>
              <li>Expose yourself to natural light during the day</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SleepAnalysis;
