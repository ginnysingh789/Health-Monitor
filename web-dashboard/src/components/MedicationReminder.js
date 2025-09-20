import React, { useState, useEffect } from 'react';
import './MedicationReminder.css';

const MedicationReminder = () => {
  const [medications, setMedications] = useState(() => {
    const savedMeds = localStorage.getItem('medications');
    return savedMeds ? JSON.parse(savedMeds) : [
      {
        id: 1,
        name: 'Aspirin',
        dosage: '81mg',
        frequency: 'Daily',
        time: '08:00',
        taken: false,
        nextDose: new Date(new Date().setHours(8, 0, 0, 0)).toISOString()
      },
      {
        id: 2,
        name: 'Vitamin D',
        dosage: '1000 IU',
        frequency: 'Daily',
        time: '09:00',
        taken: false,
        nextDose: new Date(new Date().setHours(9, 0, 0, 0)).toISOString()
      }
    ];
  });

  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: 'Daily',
    time: '08:00',
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Save medications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('medications', JSON.stringify(medications));
  }, [medications]);

  // Calculate next dose time based on frequency and time
  const calculateNextDose = (frequency, time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const nextDose = new Date();
    nextDose.setHours(hours, minutes, 0, 0);
    
    // If the time has already passed today, set for tomorrow
    if (nextDose < new Date()) {
      nextDose.setDate(nextDose.getDate() + 1);
    }
    
    return nextDose.toISOString();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMedication(prev => ({ ...prev, [name]: value }));
  };

  const handleAddMedication = (e) => {
    e.preventDefault();
    
    if (!newMedication.name || !newMedication.dosage) {
      alert('Please fill in all required fields');
      return;
    }
    
    const newMed = {
      id: Date.now(),
      ...newMedication,
      taken: false,
      nextDose: calculateNextDose(newMedication.frequency, newMedication.time)
    };
    
    setMedications(prev => [...prev, newMed]);
    setNewMedication({
      name: '',
      dosage: '',
      frequency: 'Daily',
      time: '08:00',
    });
    setShowAddForm(false);
  };

  const handleToggleTaken = (id) => {
    setMedications(prev => 
      prev.map(med => {
        if (med.id === id) {
          // If marking as taken, calculate next dose
          if (!med.taken) {
            const nextDoseDate = new Date(med.nextDose);
            
            // Set next dose based on frequency
            if (med.frequency === 'Daily') {
              nextDoseDate.setDate(nextDoseDate.getDate() + 1);
            } else if (med.frequency === 'Twice Daily') {
              nextDoseDate.setHours(nextDoseDate.getHours() + 12);
            } else if (med.frequency === 'Weekly') {
              nextDoseDate.setDate(nextDoseDate.getDate() + 7);
            }
            
            return { 
              ...med, 
              taken: true,
              nextDose: nextDoseDate.toISOString()
            };
          }
          return { ...med, taken: !med.taken };
        }
        return med;
      })
    );
  };

  const handleDeleteMedication = (id) => {
    if (window.confirm('Are you sure you want to delete this medication?')) {
      setMedications(prev => prev.filter(med => med.id !== id));
    }
  };

  // Sort medications by next dose time
  const sortedMedications = [...medications].sort((a, b) => 
    new Date(a.nextDose) - new Date(b.nextDose)
  );

  // Check if a medication is due (within 30 minutes of next dose)
  const isDue = (nextDose) => {
    const doseTime = new Date(nextDose);
    const timeDiff = (doseTime - currentTime) / (1000 * 60); // difference in minutes
    return timeDiff <= 30 && timeDiff >= -60; // Due if within 30 min before or 60 min after
  };

  // Format time for display
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date for display
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="medication-reminder-container">
      <div className="medication-header">
        <h2>Medication Reminders</h2>
        <button 
          className="add-med-btn"
          onClick={() => setShowAddForm(!showAddForm)}
          aria-label={showAddForm ? "Cancel adding medication" : "Add new medication"}
        >
          {showAddForm ? 'Cancel' : '+ Add Medication'}
        </button>
      </div>

      {showAddForm && (
        <form className="add-medication-form" onSubmit={handleAddMedication}>
          <div className="form-group">
            <label htmlFor="med-name">Medication Name*</label>
            <input
              id="med-name"
              type="text"
              name="name"
              value={newMedication.name}
              onChange={handleInputChange}
              placeholder="Enter medication name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="med-dosage">Dosage*</label>
            <input
              id="med-dosage"
              type="text"
              name="dosage"
              value={newMedication.dosage}
              onChange={handleInputChange}
              placeholder="e.g., 10mg, 1 tablet"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="med-frequency">Frequency</label>
              <select
                id="med-frequency"
                name="frequency"
                value={newMedication.frequency}
                onChange={handleInputChange}
              >
                <option value="Daily">Daily</option>
                <option value="Twice Daily">Twice Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="As Needed">As Needed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="med-time">Time</label>
              <input
                id="med-time"
                type="time"
                name="time"
                value={newMedication.time}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn">Save Medication</button>
          </div>
        </form>
      )}

      {medications.length === 0 ? (
        <div className="no-medications">
          <p>No medications added yet. Click the button above to add your first medication.</p>
        </div>
      ) : (
        <div className="medications-list">
          <h3>Upcoming Doses</h3>
          {sortedMedications.map(med => (
            <div 
              key={med.id} 
              className={`medication-item ${isDue(med.nextDose) ? 'medication-due' : ''} ${med.taken ? 'medication-taken' : ''}`}
            >
              <div className="medication-info">
                <h4>{med.name}</h4>
                <p className="medication-dosage">{med.dosage}</p>
                <p className="medication-schedule">
                  <span className="schedule-label">Next dose:</span> 
                  <span className="schedule-time">
                    {formatDate(med.nextDose)} at {formatTime(med.nextDose)}
                  </span>
                  <span className="schedule-frequency">({med.frequency})</span>
                </p>
              </div>
              <div className="medication-actions">
                <button 
                  className={`take-btn ${med.taken ? 'taken' : ''}`}
                  onClick={() => handleToggleTaken(med.id)}
                  aria-label={med.taken ? "Mark as not taken" : "Mark as taken"}
                >
                  {med.taken ? '✓ Taken' : 'Take'}
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteMedication(med.id)}
                  aria-label={`Delete ${med.name}`}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="medication-tips">
        <h3>Medication Tips</h3>
        <ul>
          <li>Take medications at the same time each day to establish a routine.</li>
          <li>Use pill organizers to help keep track of daily medications.</li>
          <li>Always consult with your healthcare provider before starting or stopping any medication.</li>
          <li>Store medications in a cool, dry place away from direct sunlight.</li>
        </ul>
      </div>
    </div>
  );
};

export default MedicationReminder;
