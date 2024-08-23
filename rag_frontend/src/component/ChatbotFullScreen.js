import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { Send } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CircularProgress } from '@mui/material';

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
  const [input, setInput] = useState('');
  const [inputtext, setInputtext] = useState('');
  const [messages, setMessages] = useState(() => [
    {
      text: "Hello! I am AHAM, your personal assistant here to help you navigate through Aayush's professional background. Whether you're interested in his education, projects, skills, achievements, coding profiles, or work experience, I'm here to answer any questions you may have. How can I assist you today?",
      sender: 'bot',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false); // State to manage typing indicator
  const [activeButton, setActiveButton] = useState(null);

  const chatBodyRef = useRef(null);
  const lastMessageRef = useRef(null);

  const buttons = [
    { label: 'Education', message: 'Tell me about Aayush\'s education.' },
    { label: 'Projects', message: 'What projects has Aayush worked on?' },
    { label: 'Skills', message: 'What skills does Aayush have?' },
    { label: 'Work Experience', message: 'Share your internship experiences' },
    { label: 'Coding Profiles', message: 'Show me about Aayush\'s coding profiles?' },
    { label: 'Achievements', message: 'What are Aayush\'s achievements?' },
  ];
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
    setIsTyping(true); // Show typing indicator

    const data = { input };

    try {
      const response = await axios.post('https://aham-chatbot.onrender.com/ask/', data, {
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
    } finally {
      setIsTyping(false); // Hide typing indicator
    }

    setInput('');
  };

  const handleButtonClick = (message) => {
    setActiveButton(message);
    setMessages([...messages, { text: message, sender: 'user' }]);
    setIsTyping(true); // Show typing indicator

    const data = { input: message };

    axios.post('https://aham-chatbot.onrender.com/ask/', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      const { answer } = response.data;
      setMessages([
        ...messages,
        { text: message, sender: 'user' },
        { text: answer, sender: 'bot' },
      ]);
    })
    .catch(error => {
      console.error('Error sending message:', error);
      setMessages([...messages, { text: message, sender: 'user' }, { text: 'Sorry, something went wrong.', sender: 'bot' }]);
    })
    .finally(() => {
      setIsTyping(false); // Hide typing indicator
    });
  };

  return (
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
            borderRadius: '8px',
          }}
        >
          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <Box
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '10px',
                  backgroundColor: '#6200ea',
                  color: '#fff',
                }}
              >
                <Typography
                  variant="h6"
                  style={{ textAlign: 'center', flex: 1, fontWeight: 1000 }}
                >
                  A H A M
                </Typography>
              </Box>
              <Box
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-around',
                  padding: '10px',
                  backgroundColor: '#f1f1f1',
                  borderBottom: '1px solid #ddd',
                }}
              >
                {buttons.map((button, index) => (
                  <Button
                    key={index}
                    variant="contained"
                    color="primary"
                    style={{ margin: '5px' }}
                    onClick={() => handleButtonClick(button.message)}
                  >
                    {button.label}
                  </Button>
                ))}
              </Box>
            </Box>
            <Box
              ref={chatBodyRef}
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '10px',
              }}
            >
              {messages.map((message, index) => (
                <Box
                  key={index}
                  ref={index === messages.length - 1 ? lastMessageRef : null}
                  style={{
                    display: 'flex',
                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                    marginBottom: '10px',
                  }}
                >
                  {message.sender === 'bot' && (
                    <Box
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginRight: '10px',
                      }}
                    >
                      <Typography
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          backgroundColor: '#6200ea',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px',
                          fontWeight: 'bold',
                        }}
                      >
                        A
                      </Typography>
                    </Box>
                  )}
                  <Paper
                    elevation={1}
                    style={{
                      padding: '10px',
                      backgroundColor: message.sender === 'user' ? '#6200ea' : '#f1f1f1',
                      color: message.sender === 'user' ? '#fff' : '#000',
                      borderRadius: '10px',
                      maxWidth: '70%',
                      display: 'flex',
                      alignItems: 'center',
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
              {isTyping && (
                <Box
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    marginBottom: '10px',
                  }}
                >
                  <Paper
                    elevation={1}
                    style={{
                      padding: '10px',
                      backgroundColor: '#f1f1f1',
                      color: '#000',
                      borderRadius: '10px',
                      maxWidth: '70%',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <CircularProgress size={20} style={{ marginRight: '10px' }} />
                    <Typography variant="body1">Bot is typing...</Typography>
                  </Paper>
                </Box>
              )}
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
                variant="outlined"
                fullWidth
                value={inputtext}
                onChange={handleInputChange}
                placeholder="Type your message..."
                style={{ marginRight: '10px' }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                endIcon={<Send />}
              >
                Send
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default ChatbotFullScreen;
