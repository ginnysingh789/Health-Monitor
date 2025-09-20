import React, { useState, useEffect } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './NutritionLog.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const NutritionLog = () => {
  const [nutritionData, setNutritionData] = useState(() => {
    const savedNutrition = localStorage.getItem('nutritionData');
    return savedNutrition ? JSON.parse(savedNutrition) : [
      {
        id: 1,
        date: new Date().toISOString().split('T')[0],
        meal: 'Breakfast',
        food: 'Oatmeal with berries',
        calories: 320,
        protein: 12,
        carbs: 58,
        fat: 6,
        fiber: 8,
        time: '08:00'
      },
      {
        id: 2,
        date: new Date().toISOString().split('T')[0],
        meal: 'Lunch',
        food: 'Grilled chicken salad',
        calories: 450,
        protein: 35,
        carbs: 15,
        fat: 28,
        fiber: 5,
        time: '12:30'
      }
    ];
  });

  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    meal: 'Breakfast',
    food: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    time: new Date().toTimeString().slice(0, 5)
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('today');
  const [dailyGoals] = useState({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 67,
    fiber: 25
  });

  const [commonFoods] = useState([
    { name: 'Apple (medium)', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4 },
    { name: 'Banana (medium)', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3 },
    { name: 'Chicken breast (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
    { name: 'Brown rice (1 cup)', calories: 216, protein: 5, carbs: 45, fat: 1.8, fiber: 4 },
    { name: 'Broccoli (1 cup)', calories: 25, protein: 3, carbs: 5, fat: 0.3, fiber: 2 },
    { name: 'Salmon (100g)', calories: 208, protein: 22, carbs: 0, fat: 13, fiber: 0 },
    { name: 'Greek yogurt (1 cup)', calories: 130, protein: 23, carbs: 9, fat: 0, fiber: 0 },
    { name: 'Almonds (28g)', calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 4 },
    { name: 'Whole wheat bread (1 slice)', calories: 81, protein: 4, carbs: 14, fat: 1.1, fiber: 2 },
    { name: 'Avocado (half)', calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 7 }
  ]);

  // Save nutrition data to localStorage
  useEffect(() => {
    localStorage.setItem('nutritionData', JSON.stringify(nutritionData));
  }, [nutritionData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEntry(prev => ({ ...prev, [name]: value }));
  };

  const handleFoodSelect = (food) => {
    setNewEntry(prev => ({
      ...prev,
      food: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      fiber: food.fiber
    }));
  };

  const handleAddEntry = (e) => {
    e.preventDefault();
    
    if (!newEntry.food || newEntry.calories <= 0) {
      alert('Please enter food name and calories');
      return;
    }
    
    const entry = {
      id: Date.now(),
      ...newEntry,
      calories: parseFloat(newEntry.calories),
      protein: parseFloat(newEntry.protein),
      carbs: parseFloat(newEntry.carbs),
      fat: parseFloat(newEntry.fat),
      fiber: parseFloat(newEntry.fiber)
    };
    
    setNutritionData(prev => [...prev, entry]);
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      meal: 'Breakfast',
      food: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      time: new Date().toTimeString().slice(0, 5)
    });
    setShowAddForm(false);
  };

  const handleDeleteEntry = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setNutritionData(prev => prev.filter(entry => entry.id !== id));
    }
  };

  // Get today's entries
  const today = new Date().toISOString().split('T')[0];
  const todayEntries = nutritionData.filter(entry => entry.date === today);

  // Calculate daily totals
  const dailyTotals = todayEntries.reduce((totals, entry) => ({
    calories: totals.calories + entry.calories,
    protein: totals.protein + entry.protein,
    carbs: totals.carbs + entry.carbs,
    fat: totals.fat + entry.fat,
    fiber: totals.fiber + entry.fiber
  }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

  // Calculate weekly averages
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    last7Days.push(date.toISOString().split('T')[0]);
  }

  const weeklyData = last7Days.map(date => {
    const dayEntries = nutritionData.filter(entry => entry.date === date);
    return dayEntries.reduce((totals, entry) => ({
      date,
      calories: totals.calories + entry.calories,
      protein: totals.protein + entry.protein,
      carbs: totals.carbs + entry.carbs,
      fat: totals.fat + entry.fat,
      fiber: totals.fiber + entry.fiber
    }), { date, calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
  });

  // Group entries by meal
  const mealGroups = todayEntries.reduce((groups, entry) => {
    if (!groups[entry.meal]) {
      groups[entry.meal] = [];
    }
    groups[entry.meal].push(entry);
    return groups;
  }, {});

  // Chart data for macronutrients
  const macroData = {
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [
      {
        data: [
          dailyTotals.protein * 4, // protein calories
          dailyTotals.carbs * 4,   // carb calories
          dailyTotals.fat * 9      // fat calories
        ],
        backgroundColor: [
          'rgba(255, 71, 87, 0.8)',
          'rgba(0, 255, 136, 0.8)',
          'rgba(255, 165, 2, 0.8)'
        ],
        borderColor: [
          '#ff4757',
          '#00ff88',
          '#ffa502'
        ],
        borderWidth: 1
      }
    ]
  };

  // Chart data for weekly calories
  const weeklyCaloriesData = {
    labels: weeklyData.map(day => {
      const date = new Date(day.date);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }),
    datasets: [
      {
        label: 'Daily Calories',
        data: weeklyData.map(day => day.calories),
        backgroundColor: 'rgba(0, 255, 136, 0.7)',
        borderColor: '#00ff88',
        borderWidth: 3,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: 'Goal',
        data: new Array(7).fill(dailyGoals.calories),
        type: 'line',
        borderColor: '#ffa502',
        backgroundColor: 'rgba(255, 165, 2, 0.1)',
        borderWidth: 3,
        borderDash: [5, 5],
        pointBackgroundColor: '#ffa502',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
      }
    ]
  };

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
            return `${context.label}: ${context.parsed} cal`;
          }
        }
      }
    }
  };

  const getProgressColor = (current, goal) => {
    const percentage = (current / goal) * 100;
    if (percentage >= 90 && percentage <= 110) return '#4CAF50';
    if (percentage >= 70 && percentage <= 130) return '#FF9800';
    return '#f44336';
  };

  const getNutritionRecommendations = () => {
    const recommendations = [];
    
    const caloriePercentage = (dailyTotals.calories / dailyGoals.calories) * 100;
    const proteinPercentage = (dailyTotals.protein / dailyGoals.protein) * 100;
    const fiberPercentage = (dailyTotals.fiber / dailyGoals.fiber) * 100;
    
    if (caloriePercentage < 80) {
      recommendations.push({
        icon: '🍽️',
        text: 'You\'re under your calorie goal. Consider adding healthy snacks like nuts or fruits.'
      });
    } else if (caloriePercentage > 120) {
      recommendations.push({
        icon: '⚖️',
        text: 'You\'ve exceeded your calorie goal. Try smaller portions or lighter meals.'
      });
    }
    
    if (proteinPercentage < 70) {
      recommendations.push({
        icon: '🥩',
        text: 'Increase protein intake with lean meats, fish, eggs, or legumes.'
      });
    }
    
    if (fiberPercentage < 60) {
      recommendations.push({
        icon: '🥬',
        text: 'Add more fiber with vegetables, fruits, and whole grains.'
      });
    }
    
    if (todayEntries.length < 3) {
      recommendations.push({
        icon: '📱',
        text: 'Log more meals to get better nutrition insights and recommendations.'
      });
    }
    
    return recommendations;
  };

  return (
    <div className="nutrition-log-container">
      <div className="nutrition-header">
        <h2>Nutrition Log</h2>
        <button 
          className="add-food-btn"
          onClick={() => setShowAddForm(!showAddForm)}
          aria-label={showAddForm ? "Cancel adding food" : "Add new food entry"}
        >
          {showAddForm ? 'Cancel' : '+ Add Food'}
        </button>
      </div>

      {showAddForm && (
        <form className="add-food-form" onSubmit={handleAddEntry}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="food-date">Date</label>
              <input
                id="food-date"
                type="date"
                name="date"
                value={newEntry.date}
                onChange={handleInputChange}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="meal-type">Meal</label>
              <select
                id="meal-type"
                name="meal"
                value={newEntry.meal}
                onChange={handleInputChange}
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="meal-time">Time</label>
              <input
                id="meal-time"
                type="time"
                name="time"
                value={newEntry.time}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="common-foods">
            <label>Quick Add (click to select):</label>
            <div className="food-buttons">
              {commonFoods.map((food, index) => (
                <button
                  key={index}
                  type="button"
                  className="food-btn"
                  onClick={() => handleFoodSelect(food)}
                >
                  {food.name}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="food-name">Food Name*</label>
            <input
              id="food-name"
              type="text"
              name="food"
              value={newEntry.food}
              onChange={handleInputChange}
              placeholder="Enter food name"
              required
            />
          </div>

          <div className="nutrition-inputs">
            <div className="form-group">
              <label htmlFor="calories">Calories*</label>
              <input
                id="calories"
                type="number"
                name="calories"
                min="0"
                step="0.1"
                value={newEntry.calories}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="protein">Protein (g)</label>
              <input
                id="protein"
                type="number"
                name="protein"
                min="0"
                step="0.1"
                value={newEntry.protein}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="carbs">Carbs (g)</label>
              <input
                id="carbs"
                type="number"
                name="carbs"
                min="0"
                step="0.1"
                value={newEntry.carbs}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="fat">Fat (g)</label>
              <input
                id="fat"
                type="number"
                name="fat"
                min="0"
                step="0.1"
                value={newEntry.fat}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="fiber">Fiber (g)</label>
              <input
                id="fiber"
                type="number"
                name="fiber"
                min="0"
                step="0.1"
                value={newEntry.fiber}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn">Save Entry</button>
          </div>
        </form>
      )}

      <div className="nutrition-tabs">
        <button 
          className={activeTab === 'today' ? 'active' : ''}
          onClick={() => setActiveTab('today')}
          aria-pressed={activeTab === 'today'}
        >
          Today
        </button>
        <button 
          className={activeTab === 'weekly' ? 'active' : ''}
          onClick={() => setActiveTab('weekly')}
          aria-pressed={activeTab === 'weekly'}
        >
          Weekly
        </button>
        <button 
          className={activeTab === 'insights' ? 'active' : ''}
          onClick={() => setActiveTab('insights')}
          aria-pressed={activeTab === 'insights'}
        >
          Insights
        </button>
      </div>

      {activeTab === 'today' && (
        <div className="today-nutrition">
          <div className="daily-summary">
            <div className="summary-card">
              <h3>Daily Progress</h3>
              <div className="progress-items">
                <div className="progress-item">
                  <span className="label">Calories</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${Math.min((dailyTotals.calories / dailyGoals.calories) * 100, 100)}%`,
                        backgroundColor: getProgressColor(dailyTotals.calories, dailyGoals.calories)
                      }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {Math.round(dailyTotals.calories)} / {dailyGoals.calories}
                  </span>
                </div>
                <div className="progress-item">
                  <span className="label">Protein</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${Math.min((dailyTotals.protein / dailyGoals.protein) * 100, 100)}%`,
                        backgroundColor: getProgressColor(dailyTotals.protein, dailyGoals.protein)
                      }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {Math.round(dailyTotals.protein)}g / {dailyGoals.protein}g
                  </span>
                </div>
                <div className="progress-item">
                  <span className="label">Carbs</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${Math.min((dailyTotals.carbs / dailyGoals.carbs) * 100, 100)}%`,
                        backgroundColor: getProgressColor(dailyTotals.carbs, dailyGoals.carbs)
                      }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {Math.round(dailyTotals.carbs)}g / {dailyGoals.carbs}g
                  </span>
                </div>
                <div className="progress-item">
                  <span className="label">Fat</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${Math.min((dailyTotals.fat / dailyGoals.fat) * 100, 100)}%`,
                        backgroundColor: getProgressColor(dailyTotals.fat, dailyGoals.fat)
                      }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {Math.round(dailyTotals.fat)}g / {dailyGoals.fat}g
                  </span>
                </div>
                <div className="progress-item">
                  <span className="label">Fiber</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${Math.min((dailyTotals.fiber / dailyGoals.fiber) * 100, 100)}%`,
                        backgroundColor: getProgressColor(dailyTotals.fiber, dailyGoals.fiber)
                      }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {Math.round(dailyTotals.fiber)}g / {dailyGoals.fiber}g
                  </span>
                </div>
              </div>
            </div>

            {dailyTotals.calories > 0 && (
              <div className="macro-chart">
                <h3>Macronutrient Breakdown</h3>
                <div className="chart-container">
                  <Doughnut data={macroData} options={doughnutOptions} />
                </div>
              </div>
            )}
          </div>

          <div className="meals-section">
            {Object.keys(mealGroups).length === 0 ? (
              <div className="no-meals">
                <p>No meals logged for today. Click "Add Food" to start tracking your nutrition.</p>
              </div>
            ) : (
              Object.entries(mealGroups).map(([meal, entries]) => (
                <div key={meal} className="meal-group">
                  <h3>{meal}</h3>
                  <div className="meal-entries">
                    {entries.map(entry => (
                      <div key={entry.id} className="food-entry">
                        <div className="food-info">
                          <h4>{entry.food}</h4>
                          <div className="food-details">
                            <span>{entry.calories} cal</span>
                            <span>P: {entry.protein}g</span>
                            <span>C: {entry.carbs}g</span>
                            <span>F: {entry.fat}g</span>
                            {entry.fiber > 0 && <span>Fiber: {entry.fiber}g</span>}
                          </div>
                          <div className="food-time">{entry.time}</div>
                        </div>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteEntry(entry.id)}
                          aria-label={`Delete ${entry.food}`}
                        >
                          <span aria-hidden="true">×</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'weekly' && (
        <div className="weekly-nutrition">
          <div className="weekly-chart">
            <h3>Weekly Calorie Intake</h3>
            <div className="chart-container">
              <Bar data={weeklyCaloriesData} options={chartOptions} />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="nutrition-insights">
          <div className="recommendations">
            <h3>Personalized Recommendations</h3>
            {getNutritionRecommendations().length === 0 ? (
              <div className="no-recommendations">
                <p>Great job! Your nutrition looks balanced for today. Keep up the good work!</p>
              </div>
            ) : (
              <div className="recommendations-list">
                {getNutritionRecommendations().map((rec, index) => (
                  <div key={index} className="recommendation-item">
                    <div className="recommendation-icon">{rec.icon}</div>
                    <div className="recommendation-text">{rec.text}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="nutrition-tips">
            <h3>Nutrition Tips</h3>
            <ul>
              <li>Eat a variety of colorful fruits and vegetables</li>
              <li>Choose whole grains over refined grains</li>
              <li>Include lean protein sources in every meal</li>
              <li>Stay hydrated by drinking plenty of water</li>
              <li>Limit processed foods and added sugars</li>
              <li>Practice portion control and mindful eating</li>
              <li>Plan your meals ahead of time</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionLog;
