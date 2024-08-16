import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Box, Button, TextField, Typography, Paper, IconButton } from '@mui/material';
import { Close, Send } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import chatbotlogo from "../assets/images/chatbotlogo.png";

const theme = createTheme({
  palette: {
    primary: {
      main: '#6200ea',
    },
    secondary: {
      main: '#03dac6',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

const ChatbotFullScreen = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [input, setInput] = useState('');
  const [inputtext, setInputtext] = useState('');
  const [messages, setMessages] = useState(() => {
    return [{ text: 'Welcome to ProcurEngine! We simplify procurement processes, boost business profits and offer 3X adoption in various industry sectors. Ready to revolutionize your B2B experience?', sender: 'bot' }];
  });

  const chatBodyRef = useRef(null);
  const lastMessageRef = useRef(null);

  useEffect(() => {
    sessionStorage.setItem('chatMessages', JSON.stringify(messages));
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setInputtext(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setInputtext('');
    if (!input.trim()) return;

    setMessages([...messages, { text: input, sender: 'user' }]);
    const data = { input };

    try {
      const response = await axios.post('http://127.0.0.1:8000/ask/', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { answer } = response.data;

      setMessages([
        ...messages,
        { text: input, sender: 'user' },
        { text: answer, sender: 'bot' },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages([...messages, { text: input, sender: 'user' }, { text: 'Sorry, something went wrong.', sender: 'bot' }]);
    }

    setInput('');
  };

  return (
    <>
      {(
        <ThemeProvider theme={theme}>
          <Box
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 999,
            }}
          >
            <Paper
              elevation={3}
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#fff',
              }}
            >
              <Box
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px',
                  backgroundColor: '#6200ea',
                  color: '#fff',
                }}
              >
                <Typography variant="h6">Samiksha</Typography>
                {/* <IconButton size="small" onClick={() => setIsOpen(false)} style={{ color: '#fff' }}>
                  <Close />
                </IconButton> */}
              </Box>
              <Box
                ref={chatBodyRef}
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '10px',
                }}
              >
                {messages?.map((message, index) => (
                  <Box
                    key={index}
                    ref={index === messages.length - 1 ? lastMessageRef : null}
                    style={{
                      display: 'flex',
                      justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                      marginBottom: '10px',
                    }}
                  >
                    <Paper
                      elevation={1}
                      style={{
                        padding: '10px',
                        backgroundColor: message.sender === 'user' ? '#6200ea' : '#f1f1f1',
                        color: message.sender === 'user' ? '#fff' : '#000',
                        borderRadius: '10px',
                        maxWidth: '70%',
                      }}
                    >
                      <Typography variant="body1">
                        {typeof message.text === 'string' ? (
                          <ReactMarkdown>{message.text}</ReactMarkdown>
                        ) : (
                          message.text
                        )}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
              </Box>
              <Box
                component="form"
                onSubmit={handleSubmit}
                style={{
                  display: 'flex',
                  padding: '10px',
                  borderTop: '1px solid #ddd',
                }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={inputtext}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  style={{ marginRight: '10px', borderRadius: '20px' }}
                />
                <Button type="submit" variant="contained" color="primary" endIcon={<Send />}>
                  Send
                </Button>
              </Box>
            </Paper>
          </Box>
        </ThemeProvider>
      )}
    </>
  );
};

export default ChatbotFullScreen;