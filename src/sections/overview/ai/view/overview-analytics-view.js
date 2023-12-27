'use client';
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Paper,
  Typography,
  Button,
  Stack,
  Divider,
  InputAdornment,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AndroidIcon from '@mui/icons-material/Android';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useAuthContext } from 'src/auth/hooks';
import Iconify from 'src/components/iconify';
import { UploadBox } from 'src/components/upload';

function ChatMessage({ isBot, text, isFile }) {
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar>{isBot ? <AndroidIcon /> : <AccountCircleIcon />}</Avatar>
      </ListItemAvatar>
      <ListItemText primary={isFile ? `File: ${text}` : text} />
    </ListItem>
  );
}



ChatMessage.propTypes = {
  isBot: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  isFile: PropTypes.bool,
};
const ChatBubble = styled(ListItem)(({ theme, isbot }) => ({
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: theme.spacing(1),
  margin: theme.spacing(1),
  borderRadius: '20px',
  backgroundColor: isbot ? '#e0e0e0' : '#3f51b5',
  color: isbot ? 'black' : 'white',
  maxWidth: '75%',
  marginLeft: isbot ? 'auto' : '0',
  '&:before': {
    display: 'none', // Remove the arrow
  },
}));
export default function ChatInterface() {
  const { user } = useAuthContext();
  const [selectedFile, setSelectedFile] = useState(null);
  const [chatSessions, setChatSessions] = useState([]);
  const [activeSessionIndex, setActiveSessionIndex] = useState(0);
  const [input, setInput] = useState('');
  const chatContainerRef = useRef(null);
  const maxMessageLength = 8000;
  const maxMessagesPerSession = 40;
  const [remainingChars, setRemainingChars] = useState(8000);
  const [remainingChats, setRemainingChats] = useState(40);
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    setCurrentPath(window.location.pathname);
    localStorage.setItem('currentPath', window.location.pathname);
    console.log(window.location.pathname);
  }, []);
  useEffect(() => {
    const currentSession = chatSessions[activeSessionIndex];
    if (currentSession) {
      setRemainingChats(maxMessagesPerSession - currentSession.messages.length);
    }
  }, [chatSessions, activeSessionIndex, maxMessagesPerSession]);

  useEffect(() => {
    fetchChatSessions();
  }, [user.email]);
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files && e.target.files[0];
    setSelectedFile(selectedFile);
  };
  
  useEffect(() => {
    // Update to count only user messages
    const userMessages = chatSessions[activeSessionIndex]?.messages.filter(msg => !msg.isBot).length || 0;
    setRemainingChats(maxMessagesPerSession - userMessages);
  }, [chatSessions, activeSessionIndex, maxMessagesPerSession]);

  const handleInputChange = (e) => {
    const inputLength = e.target.value.length;
    const fileLength = selectedFile ? selectedFile.name.length : 0;
    const totalLength = inputLength + fileLength;
    setInput(e.target.value);
    setRemainingChars(8000 - totalLength);
  };
  const fetchChatSessions = async () => {
    try {
      const response = await fetch('https://threatvisor-api.vercel.app/api/ai/api/get/chat-sessions', {
        headers: {
          'Content-Type': 'application/json',
          'User-Email': user.email,
        },
      });
      const data = await response.json();

      if (data.length === 0) {
        await createNewChatSession();
        fetchChatSessions();
      } else {
        setChatSessions(data);
      }
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
    }
  };

  const createNewChatSession = async () => {
    try {
      await fetch('https://threatvisor-api.vercel.app/api/ai/api/create/chat-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Email': user.email,
        },
      });
    } catch (error) {
      console.error('Error creating chat session:', error);
    }
  };

  const switchChatSession = (index) => {
    setActiveSessionIndex(index);
  };

  const deleteChatSession = async (sessionId) => {
    try {
      await fetch(`https://threatvisor-api.vercel.app/api/ai/api/delete/chat-session/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'User-Email': user.email,
        },
      });
      fetchChatSessions();
    } catch (error) {
      console.error('Error deleting chat session:', error);
    }
  };

  const addChatSession = async () => {
    try {
      await fetch('https://threatvisor-api.vercel.app/api/ai/api/add/chat-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Email': user.email,
        },
      });
      fetchChatSessions();
    } catch (error) {
      console.error('Error adding chat session:', error);
    }
  };

  const clearChatSession = async (sessionId) => {
    try {
      await fetch(`https://threatvisor-api.vercel.app/api/ai/api/clear/chat-session/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'User-Email': user.email,
        },
      });
      const updatedSessions = [...chatSessions];
      updatedSessions[activeSessionIndex].messages = [];
      setChatSessions(updatedSessions);
    } catch (error) {
      console.error('Error clearing chat session:', error);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() && !selectedFile) return;
    if (input.length > maxMessageLength) {
      alert('Message too long. Maximum 5000 characters allowed.');
      return;
    }
    if (chatSessions[activeSessionIndex].messages.length >= maxMessagesPerSession) {
      alert('Maximum messages per session reached. Please start a new session.');
      return;
    }
  
    // Retrieve the current chat session's messages and construct the conversation history
    const currentSessionMessages = chatSessions[activeSessionIndex].messages;
    const conversationHistory = currentSessionMessages.map((msg) => msg.text).join('\n');
  
    const formData = new FormData();
    formData.append('text', input);
    formData.append('conversationHistory', conversationHistory); // Append the constructed conversation history
    formData.append('sessionId', chatSessions[activeSessionIndex].sessionId);
  
    if (selectedFile) {
      formData.append('file', selectedFile);
    }
  
    try {
      const response = await axios.post('https://threatvisor-api.vercel.app/api/ai/api/send/chat', formData, {
        headers: {
          'User-Email': user.email,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status === 200) {
        const responseData = response.data;
        const updatedSessions = [...chatSessions];
        updatedSessions[activeSessionIndex].messages.push({
          text: input,
          isBot: false,
          isFile: false,
        });
  
        if (selectedFile) {
          updatedSessions[activeSessionIndex].messages.push({
            text: selectedFile.name, // Display the file name
            isBot: false,
            isFile: true,
          });
        }
  
        updatedSessions[activeSessionIndex].messages.push({
          text: responseData.bot,
          isBot: true,
          isFile: false,
        });
  
        setChatSessions(updatedSessions);
        setSelectedFile(null);
        setRemainingChats(prev => prev - 1);
      } else {
        console.error('Error sending message:', response.data.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  
    setInput('');
  };
  

  return (
    <Paper sx={{ display: 'flex', height: '90vh' }}>
      <Box sx={{ width: '25%', p: 2, overflowY: 'auto' }}>
        <Typography variant="h6" gutterBottom>
          Chat Sessions
        </Typography>
        <List>
          {chatSessions.map((session, index) => (
            <ListItem key={session.sessionId} sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                variant={index === activeSessionIndex ? "contained" : "outlined"}
                color="primary"
                onClick={() => switchChatSession(index)}
                sx={{ flexGrow: 1, mr: 1, fontWeight: index === activeSessionIndex ? 'bold' : 'normal' }}
              >
                Chat {index + 1}
              </Button>
              <IconButton
                color="error"
                onClick={() => deleteChatSession(session.sessionId)}
                aria-label="delete"
              >
                <DeleteIcon />
              </IconButton>
              {index === chatSessions.length - 1 && (
                <IconButton
                  color="primary"
                  onClick={addChatSession}
                  aria-label="add chat session"
                >
                  <Iconify icon="eva:plus-fill" />
                </IconButton>
              )}
            </ListItem>
          ))}
        </List>
      </Box>
      <Divider orientation="vertical" />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
      <List sx={{ flexGrow: 1, overflowY: 'auto' }} ref={chatContainerRef}>
          {chatSessions.length > 0 && activeSessionIndex >= 0 && activeSessionIndex < chatSessions.length && chatSessions[activeSessionIndex]?.messages.length > 0 ? (
            chatSessions[activeSessionIndex].messages.map((message, index) => (
              <ChatBubble key={index} isbot={message.isBot}>
                  <ListItemText primary={message.text} />
                </ChatBubble>
            ))
          ) : (
            <Typography variant="subtitle1" sx={{ m: 2 }}>Start talking by sending your request...</Typography>
          )}
        </List>
        {selectedFile && (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        p: 1, 
        backgroundColor: 'transparent', 
        borderRadius: '4px', 
        mt: 2, 
        border: '1px solid #bdbdbd', 
        color: '#757575'
      }}
    >
      <ListItemText 
        primary={`Selected File: ${selectedFile.name}`} 
        sx={{ flexGrow: 1, fontSize: '0.875rem' }} 
      />
      <IconButton
        color="error"
        onClick={handleRemoveFile}
        aria-label="remove selected file"
      >
        <ClearIcon />
      </IconButton>
    </Box>
  )}
        <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', padding: 2 }}>
          <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center' }}>
            <UploadBox
              onDrop={handleFileChange}
              placeholder={
                <Stack spacing={0.5} alignItems="center" sx={{ color: 'text.disabled' }}>
                  <Iconify icon="eva:cloud-upload-fill" width={24} />
                </Stack>
              }
              sx={{
                mr: 1,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'primary.main',
                cursor: 'pointer',
                padding: '10px',
              }}
            />
             <TextField
      variant="outlined"
      label={`Type your message (Remaining: ${remainingChars} chars)`}
      helperText={`Chats remaining in this session: ${remainingChats}`}
      value={input}
      onChange={handleInputChange}
      sx={{ flexGrow: 1, mx: 1 }}
      InputProps={{
        endAdornment: (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton type="submit" color="primary">
              <SendIcon />
            </IconButton>
          </Box>
        ),
      }}
    />
          </Box>
        </form>
      </Box>
    </Paper>
  );
}
