import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Box, Button, TextField, Typography, Paper, IconButton } from '@mui/material';
import { ChatBubbleOutline, Close, Send } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FaComments } from 'react-icons/fa6';
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

const ChatbotEmbedded = () => {
  const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
      const [inputtext, setInputtext] = useState('');
    const [messages, setMessages] = useState(() => {
      return [ { text: 'Welcome to ProcurEngine! We simplify procurement processes, boost business profits and offer 3X adoption in various industry sectors. Ready to revolutionize your B2B experience? ', sender: 'bot' }]
        //const savedMessages = sessionStorage.getItem('chatMessages');
       
   // return savedMessages ? JSON.parse(savedMessages) : [];
  });

  useEffect(() => {
    sessionStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const handleInputChange = (e) => {
      setInput(e.target.value);
      setInputtext(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      setInputtext('')
    if (!input.trim()) return;

    setMessages([...messages, { text: input, sender: 'user' }]);
    const data = { input };

    try {
      const response = await axios.post('http://127.0.0.1:8000/ask/', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
     
      const { answer, context } = response.data;

    //   const contextContent = context.map((doc, index) => (
    //     <div key={index} className="context-content">
    //       <ReactMarkdown>{doc.page_content}</ReactMarkdown>
    //     </div>
    //   ));

      setMessages([
        ...messages,
        { text: input, sender: 'user' },
        { text: answer, sender: 'bot' },
        // { text: contextContent, sender: 'bot' },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages([...messages, { text: input, sender: 'user' }, { text: 'Sorry, something went wrong.', sender: 'bot' }]);
    }

    setInput('');
  };
 
    return (
        <>
             {/* Chatbot Icon */}
      {/* <div
                onClick={() => setIsOpen(!isOpen)}
                className='css-chatbot ZoomIn'
    
      >
        <FaComments size={30} color="#fff" />
            </div> */}
            <div
    onClick={() => setIsOpen(!isOpen)}
    className='css-chatbot ZoomIn'
>
                <img src={chatbotlogo}  alt="Chatbot" style={{ width: 30, height: 30 }} />
</div>

            
            {/* Chatbot Window */}
      {isOpen && (
       
          <ThemeProvider theme={theme}>
      <Box>
        <Paper elevation={3} className={`chat-container ZoomIn ${isOpen ? 'open' : ''}`} style={{ display: isOpen ? 'flex' : 'none' }}>
                            <Box className="chat-header">
                                <div className='css-1hibz0x'>
                                   <Typography  className='css-tveybr fw600'>Abby</Typography>
                                <span className='css-1y79z6g '>online</span>
                                </div>
                                
            <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: '#fff' }}>
              <Close />
            </IconButton>
          </Box>
          <Box className="chat-body">
            {messages?.map((message, index) => (
              <Box key={index} className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}>
                <Paper elevation={1} className={`message-text ${message.sender === 'user' ? 'user-message-text' : 'bot-message-text'}`}>
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
          <Box component="form" onSubmit={handleSubmit} className="chat-input">
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              value={inputtext}
              onChange={handleInputChange}
              placeholder="Type your message..."
              sx={{ marginRight: 1, borderRadius: '20px' }}
            />
            <Button type="submit" variant="contained" color="primary" endIcon={<Send />}>Send</Button>
          </Box>
        </Paper>
       
          </Box>
      </ThemeProvider>
    
      )}
           
      </>
    
      
  );
};

export default ChatbotEmbedded;
