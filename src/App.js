// src/App.js
import React, { useState } from 'react';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [datetime, setDatetime] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/.netlify/functions/schedule-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, message, datetime })
    });
    const result = await response.json();
    alert(result.message);
  };

  return (
    <div className="App">
      <h1>Send an Email to the Future</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Message:
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Date and Time:
          <input
            type="datetime-local"
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Send to Future</button>
      </form>
    </div>
  );
}

export default App;