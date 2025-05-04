import React, { useState } from 'react';
import './chatBot.css';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi there! Ask me anything about GryphPlanner.' },
  ]);
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMessage = { from: 'user', text: input };
    const botReply = {
      from: 'bot',
      text: "I'm just a demo bot for now — real answers coming soon!",
    };
    setMessages([...messages, userMessage, botReply]);
    setInput('');
  };

  return (
    <>
      {/* Toggle Button */}
      {!open && (
      <button className="chatbot-toggle" onClick={() => setOpen(true)}>
        <span role="img" aria-label="chat">💬</span>
      </button>
    )}



      {/* Chatbot Panel */}
      <div className={`chatbot-panel ${open ? 'open' : ''}`}>
      <div className="chatbot-header">
        GryphBot
        <button className="chatbot-minimize" onClick={() => setOpen(false)}>−</button>
      </div>

        <div className="chatbot-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chatbot-message ${msg.from}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="chatbot-input">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
