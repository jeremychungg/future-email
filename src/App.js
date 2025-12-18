import React, { useState } from 'react';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const scheduledDate = new Date(scheduleTime);
    const now = new Date();
    const delay = scheduledDate - now;
    
    if (delay < 0) {
      alert('Please select a future date and time.');
      return;
    }

    // Use default subject and message
    const subject = 'Message from the past';
    const message = `This email was scheduled on ${now.toLocaleString()} to arrive at ${scheduledDate.toLocaleString()}.`;

    // Use backend API if configured, otherwise show demo message
    const API_URL = process.env.REACT_APP_API_URL || '';
    
    if (API_URL) {
      try {
        const response = await fetch(`${API_URL}/.netlify/functions/schedule-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, subject, message, scheduleTime })
        });

        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.message || 'Failed to schedule email');
        }

        alert('✉️ ' + result.message);
        
        // Reset form
        setEmail('');
        setScheduleTime('');
      } catch (error) {
        alert('❌ Error: ' + error.message);
      }
    } else {
      // Demo mode
      const days = Math.floor(delay / (1000 * 60 * 60 * 24));
      const hours = Math.floor((delay % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      alert(`✉️ Demo Mode\n\nYour email would be scheduled to:\n📧 ${email}\n📅 In ${days} days and ${hours} hours\n\n⚠️ Note: Deploy the backend to actually send emails. See README for instructions.`);
      
      // Reset form
      setEmail('');
      setScheduleTime('');
    }
  };

  return (
    <div className="App">
      <h1>Send Email to Future</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />
        </div>
        <div>
          <label htmlFor="scheduleTime">When:</label>
          <input
            type="datetime-local"
            id="scheduleTime"
            value={scheduleTime}
            onChange={(e) => setScheduleTime(e.target.value)}
            required
          />
        </div>
        <button type="submit">Send to Future</button>
      </form>
    </div>
  );
}

export default App;
