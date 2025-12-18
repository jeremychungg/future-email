import React, { useState } from 'react';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Demo mode - GitHub Pages doesn't support backend
    const scheduledDate = new Date(scheduleTime);
    const now = new Date();
    const delay = scheduledDate - now;
    
    if (delay < 0) {
      alert('Please select a future date and time.');
      return;
    }

    const days = Math.floor(delay / (1000 * 60 * 60 * 24));
    const hours = Math.floor((delay % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    alert(`✉️ Demo Mode\n\nYour email would be scheduled to:\n📧 ${email}\n📝 Subject: ${subject}\n📅 In ${days} days and ${hours} hours\n\n⚠️ Note: This is a demo. To actually send emails, you'll need to deploy a backend service (like Netlify Functions, Vercel, or AWS Lambda).`);
    
    // Reset form
    setEmail('');
    setSubject('');
    setMessage('');
    setScheduleTime('');
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
