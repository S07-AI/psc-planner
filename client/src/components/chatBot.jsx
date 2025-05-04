import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Typography, List, ListItem } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const ChatBot = ({ pdfContent }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // TODO: Replace with your actual Gemini API call
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          pdfContent: pdfContent
        }),
      });

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        text: data.response,
        sender: 'bot'
      }]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 3, width: '100%', maxWidth: 600, mx: 'auto' }}>
      <Paper elevation={3} sx={{ p: 2, height: 400, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom>
          Ask about your schedule
        </Typography>
        
        <List sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
          {messages.map((message, index) => (
            <ListItem 
              key={index}
              sx={{
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                mb: 1
              }}
            >
              <Paper 
                elevation={1}
                sx={{
                  p: 1,
                  backgroundColor: message.sender === 'user' ? '#e3f2fd' : '#f5f5f5',
                  maxWidth: '70%'
                }}
              >
                <Typography>{message.text}</Typography>
              </Paper>
            </ListItem>
          ))}
        </List>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your schedule..."
            disabled={isLoading}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button
            variant="contained"
            onClick={handleSend}
            disabled={isLoading}
            endIcon={<SendIcon />}
          >
            Send
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatBot;
