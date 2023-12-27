import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Stack,
  InputBase,
  IconButton,
  Typography,
  Button,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ClearIcon from '@mui/icons-material/Clear'; // For unselecting the file
import Iconify from 'src/components/iconify';
import axios from 'axios';
import { useAuthContext } from 'src/auth/hooks';

function ChatMessageInput({ activeSessionId, onMessageSent }) {
  const [input, setInput] = useState('');
  const { user } = useAuthContext();
  const [selectedFile, setSelectedFile] = useState(null);
  const fileRef = useRef(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleRemoveSelectedFile = () => {
    setSelectedFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() && !selectedFile) return;

    try {
      const formData = new FormData();
      formData.append('text', input);
      formData.append('sessionId', activeSessionId);

      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const response = await axios.post('http://localhost:8080/api/ai/api/send/chat', formData, {
        headers: {
          'User-Email': user.email,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        onMessageSent(response.data);
        setSelectedFile(null);
        setInput('');
      } else {
        console.error('Error sending message:', response.data.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <>
      <InputBase
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message"
        startAdornment={
          <IconButton>
            <Iconify icon="eva:smiling-face-fill" />
          </IconButton>
        }
        endAdornment={
          <Stack direction="row" sx={{ flexShrink: 0 }}>
            <IconButton onClick={() => fileRef.current.click()}>
              <Iconify icon="eva:attach-2-fill" />
            </IconButton>
            <IconButton type="submit" onClick={handleSubmit}>
              <SendIcon />
            </IconButton>
          </Stack>
        }
        sx={{
          px: 1,
          height: 56,
          flexShrink: 0,
          borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
        }}
      />

      <input type="file" ref={fileRef} style={{ display: 'none' }} onChange={handleFileChange} />

      {selectedFile && (
        <Stack direction="row" alignItems="center" sx={{ padding: 2 }}>
          <Typography variant="body2" sx={{ flexGrow: 1 }}>
            Selected File: {selectedFile.name}
          </Typography>
          <Button size="small" startIcon={<ClearIcon />} onClick={handleRemoveSelectedFile}>
            Remove
          </Button>
        </Stack>
      )}
    </>
  );
}

ChatMessageInput.propTypes = {
  user: PropTypes.object.isRequired,
  activeSessionId: PropTypes.string.isRequired,
  onMessageSent: PropTypes.func.isRequired,
};

export default ChatMessageInput;
