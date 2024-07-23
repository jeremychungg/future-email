import React, { useState } from 'react';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      email,
      subject,
      message,
      scheduleTime
    };

    try {
      const response = await fetch('/.netlify/functions/schedule-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      alert(result.message || 'Email scheduled successfully!');
    } catch (error) {
      alert('Failed to schedule email: ' + error.message);
    }
  };

  return (
    <div className="App">
      <h1>Schedule an Email</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            required
          />
        </div>
        <div>
          <label htmlFor="subject">Subject:</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            required
          />
        </div>
        <div>
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your message"
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="scheduleTime">Schedule Time:</label>
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
