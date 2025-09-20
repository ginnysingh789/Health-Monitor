import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './ExerciseTracker.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const ExerciseTracker = ({ data }) => {
  const [exercises, setExercises] = useState(() => {
    const savedExercises = localStorage.getItem('exercises');
    return savedExercises ? JSON.parse(savedExercises) : [
      {
        id: 1,
        type: 'Walking',
        duration: 30,
        calories: 150,
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0] // Yesterday
      },
      {
        id: 2,
        type: 'Running',
        duration: 20,
        calories: 200,
        date: new Date().toISOString().split('T')[0] // Today
      },
      {
        id: 3,
        type: 'Cycling',
        duration: 45,
        calories: 300,
        date: new Date(Date.now() - 172800000).toISOString().split('T')[0] // 2 days ago
      }
    ];
  });

  const [newExercise, setNewExercise] = useState({
    type: 'Walking',
    duration: 30,
    calories: 150,
    date: new Date().toISOString().split('T')[0]
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('activities');
  const [weeklyStats, setWeeklyStats] = useState({
    labels: [],
    calories: [],
    duration: []
  });
  const [recommendations, setRecommendations] = useState([]);

  // Exercise types with their average calorie burn per minute
  const exerciseTypes = [
    { name: 'Walking', caloriesPerMinute: 5 },
    { name: 'Running', caloriesPerMinute: 10 },
    { name: 'Cycling', caloriesPerMinute: 7 },
    { name: 'Swimming', caloriesPerMinute: 8 },
    { name: 'Yoga', caloriesPerMinute: 3 },
    { name: 'Strength Training', caloriesPerMinute: 6 },
    { name: 'HIIT', caloriesPerMinute: 12 },
    { name: 'Dancing', caloriesPerMinute: 7 },
    { name: 'Pilates', caloriesPerMinute: 4 },
    { name: 'Elliptical', caloriesPerMinute: 6 }
  ];

  // Save exercises to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('exercises', JSON.stringify(exercises));
  }, [exercises]);

  // Calculate weekly stats
  useEffect(() => {
    calculateWeeklyStats();
    generateRecommendations();
  }, [exercises, data]);

  const calculateWeeklyStats = () => {
    // Get dates for the last 7 days
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }

    // Calculate calories and duration for each day
    const calories = dates.map(date => {
      const dayExercises = exercises.filter(ex => ex.date === date);
      return dayExercises.reduce((sum, ex) => sum + ex.calories, 0);
    });

    const duration = dates.map(date => {
      const dayExercises = exercises.filter(ex => ex.date === date);
      return dayExercises.reduce((sum, ex) => sum + ex.duration, 0);
    });

    // Format dates for display (e.g., "Mon", "Tue", etc.)
    const formattedDates = dates.map(date => {
      const day = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
      return day;
    });

    setWeeklyStats({
      labels: formattedDates,
      calories,
      duration
    });
  };

  const generateRecommendations = () => {
    const newRecommendations = [];
    
    // Check if there's health data available
    if (data) {
      // Recommend based on heart rate
      if (data.heart_rate > 100) {
        newRecommendations.push({
          icon: '❤️',
          text: 'Your heart rate is elevated. Consider low-intensity activities like walking or yoga today.'
        });
      } else if (data.heart_rate < 60) {
        newRecommendations.push({
          icon: '❤️',
          text: 'Your heart rate is lower than usual. A moderate cardio session could be beneficial.'
        });
      }
      
      // Recommend based on activity level
      if (data.activity_level === 'resting' || data.activity_level === 'sleeping') {
        newRecommendations.push({
          icon: '🏃',
          text: 'You\'ve been mostly inactive today. Consider a short walk or stretching session.'
        });
      }
    }
    
    // Check exercise history
    const today = new Date().toISOString().split('T')[0];
    const todayExercises = exercises.filter(ex => ex.date === today);
    
    if (todayExercises.length === 0) {
      newRecommendations.push({
        icon: '📅',
        text: 'No exercises logged today. Try to get at least 30 minutes of physical activity.'
      });
    }
    
    // Check weekly activity
    const totalWeeklyMinutes = weeklyStats.duration.reduce((sum, min) => sum + min, 0);
    if (totalWeeklyMinutes < 150) {
      newRecommendations.push({
        icon: '⏱️',
        text: `You've logged ${totalWeeklyMinutes} minutes this week. Aim for at least 150 minutes of moderate activity.`
      });
    }
    
    // Add variety recommendation if same exercise type multiple days in a row
    const recentTypes = exercises
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3)
      .map(ex => ex.type);
      
    if (recentTypes.length >= 3 && recentTypes[0] === recentTypes[1] && recentTypes[1] === recentTypes[2]) {
      newRecommendations.push({
        icon: '🔄',
        text: `You've done ${recentTypes[0]} several times recently. Try mixing up your routine with different activities.`
      });
    }
    
    setRecommendations(newRecommendations);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'type') {
      // Auto-calculate calories based on exercise type and duration
      const exerciseType = exerciseTypes.find(type => type.name === value);
      const caloriesPerMinute = exerciseType ? exerciseType.caloriesPerMinute : 5;
      const calories = Math.round(caloriesPerMinute * newExercise.duration);
      
      setNewExercise(prev => ({ 
        ...prev, 
        [name]: value,
        calories
      }));
    } else if (name === 'duration') {
      // Auto-calculate calories based on duration and current exercise type
      const exerciseType = exerciseTypes.find(type => type.name === newExercise.type);
      const caloriesPerMinute = exerciseType ? exerciseType.caloriesPerMinute : 5;
      const calories = Math.round(caloriesPerMinute * value);
      
      setNewExercise(prev => ({ 
        ...prev, 
        [name]: parseInt(value),
        calories
      }));
    } else {
      setNewExercise(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddExercise = (e) => {
    e.preventDefault();
    
    if (!newExercise.type || !newExercise.duration) {
      alert('Please fill in all required fields');
      return;
    }
    
    const newEx = {
      id: Date.now(),
      ...newExercise
    };
    
    setExercises(prev => [...prev, newEx]);
    setNewExercise({
      type: 'Walking',
      duration: 30,
      calories: 150,
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddForm(false);
  };

  const handleDeleteExercise = (id) => {
    if (window.confirm('Are you sure you want to delete this exercise?')) {
      setExercises(prev => prev.filter(ex => ex.id !== id));
    }
  };

  // Sort exercises by date (newest first)
  const sortedExercises = [...exercises].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  // Calculate total stats
  const totalCalories = exercises.reduce((sum, ex) => sum + ex.calories, 0);
  const totalDuration = exercises.reduce((sum, ex) => sum + ex.duration, 0);
  const totalActivities = exercises.length;

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: { 
          color: 'rgba(0, 255, 136, 0.2)',
          borderColor: 'rgba(0, 255, 136, 0.3)'
        },
        ticks: { 
          color: '#00ff88',
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

  // Chart data
  const caloriesChartData = {
    labels: weeklyStats.labels,
    datasets: [
      {
        label: 'Calories Burned',
        data: weeklyStats.calories,
        backgroundColor: 'rgba(0, 255, 136, 0.7)',
        borderColor: '#00ff88',
        borderWidth: 3,
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  };

  const durationChartData = {
    labels: weeklyStats.labels,
    datasets: [
      {
        label: 'Exercise Duration (minutes)',
        data: weeklyStats.duration,
        backgroundColor: 'rgba(255, 165, 0, 0.7)',
        borderColor: '#ffa502',
        borderWidth: 3,
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  };

  return (
    <div className="exercise-tracker-container">
      <div className="exercise-header">
        <h2>Exercise Tracker</h2>
        <button 
          className="add-exercise-btn"
          onClick={() => setShowAddForm(!showAddForm)}
          aria-label={showAddForm ? "Cancel adding exercise" : "Add new exercise"}
        >
          {showAddForm ? 'Cancel' : '+ Add Exercise'}
        </button>
      </div>

      {showAddForm && (
        <form className="add-exercise-form" onSubmit={handleAddExercise}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="exercise-type">Exercise Type*</label>
              <select
                id="exercise-type"
                name="type"
                value={newExercise.type}
                onChange={handleInputChange}
                required
              >
                {exerciseTypes.map(type => (
                  <option key={type.name} value={type.name}>{type.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="exercise-duration">Duration (minutes)*</label>
              <input
                id="exercise-duration"
                type="number"
                name="duration"
                min="1"
                max="300"
                value={newExercise.duration}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="exercise-calories">Calories Burned</label>
              <input
                id="exercise-calories"
                type="number"
                name="calories"
                value={newExercise.calories}
                onChange={handleInputChange}
                disabled
              />
              <small className="form-help">Auto-calculated based on exercise type and duration</small>
            </div>

            <div className="form-group">
              <label htmlFor="exercise-date">Date</label>
              <input
                id="exercise-date"
                type="date"
                name="date"
                value={newExercise.date}
                onChange={handleInputChange}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn">Save Exercise</button>
          </div>
        </form>
      )}

      <div className="exercise-tabs">
        <button 
          className={activeTab === 'activities' ? 'active' : ''}
          onClick={() => setActiveTab('activities')}
          aria-pressed={activeTab === 'activities'}
        >
          Activities
        </button>
        <button 
          className={activeTab === 'stats' ? 'active' : ''}
          onClick={() => setActiveTab('stats')}
          aria-pressed={activeTab === 'stats'}
        >
          Statistics
        </button>
        <button 
          className={activeTab === 'recommendations' ? 'active' : ''}
          onClick={() => setActiveTab('recommendations')}
          aria-pressed={activeTab === 'recommendations'}
        >
          Recommendations
        </button>
      </div>

      {activeTab === 'activities' && (
        <div className="exercise-activities">
          {sortedExercises.length === 0 ? (
            <div className="no-exercises">
              <p>No exercises logged yet. Click the button above to add your first exercise.</p>
            </div>
          ) : (
            <div className="exercises-list">
              {sortedExercises.map(exercise => (
                <div key={exercise.id} className="exercise-item">
                  <div className="exercise-icon">
                    {exercise.type === 'Walking' && '🚶'}
                    {exercise.type === 'Running' && '🏃'}
                    {exercise.type === 'Cycling' && '🚴'}
                    {exercise.type === 'Swimming' && '🏊'}
                    {exercise.type === 'Yoga' && '🧘'}
                    {exercise.type === 'Strength Training' && '🏋️'}
                    {exercise.type === 'HIIT' && '⚡'}
                    {exercise.type === 'Dancing' && '💃'}
                    {exercise.type === 'Pilates' && '🤸'}
                    {exercise.type === 'Elliptical' && '🔄'}
                  </div>
                  <div className="exercise-info">
                    <h4>{exercise.type}</h4>
                    <div className="exercise-details">
                      <span className="exercise-duration">{exercise.duration} min</span>
                      <span className="exercise-calories">{exercise.calories} cal</span>
                      <span className="exercise-date">{new Date(exercise.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteExercise(exercise.id)}
                    aria-label={`Delete ${exercise.type} exercise`}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="exercise-stats">
          <div className="stats-summary">
            <div className="stat-card">
              <h3>Total Activities</h3>
              <div className="stat-value">{totalActivities}</div>
            </div>
            <div className="stat-card">
              <h3>Total Duration</h3>
              <div className="stat-value">{totalDuration} min</div>
            </div>
            <div className="stat-card">
              <h3>Total Calories</h3>
              <div className="stat-value">{totalCalories} cal</div>
            </div>
          </div>

          <div className="stats-charts">
            <div className="chart-container">
              <h3>Weekly Calories Burned</h3>
              <div className="chart">
                <Bar options={chartOptions} data={caloriesChartData} />
              </div>
            </div>
            <div className="chart-container">
              <h3>Weekly Exercise Duration</h3>
              <div className="chart">
                <Bar options={chartOptions} data={durationChartData} />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="exercise-recommendations">
          {recommendations.length === 0 ? (
            <div className="no-recommendations">
              <p>No personalized recommendations available. Add more exercises or connect your health data for tailored advice.</p>
            </div>
          ) : (
            <div className="recommendations-list">
              {recommendations.map((rec, index) => (
                <div key={index} className="recommendation-item">
                  <div className="recommendation-icon">{rec.icon}</div>
                  <div className="recommendation-text">{rec.text}</div>
                </div>
              ))}
            </div>
          )}

          <div className="exercise-tips">
            <h3>Exercise Tips</h3>
            <ul>
              <li>Aim for at least 150 minutes of moderate activity per week.</li>
              <li>Include both cardio and strength training in your routine.</li>
              <li>Stay hydrated before, during, and after exercise.</li>
              <li>Always warm up before and cool down after your workout.</li>
              <li>Listen to your body and rest when needed.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseTracker;
