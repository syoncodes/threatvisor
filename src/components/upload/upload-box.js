import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Iconify from '../iconify';

export default function UploadBox({ placeholder, error, disabled, sx, onDrop }) {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragEnter = () => {
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    setIsDragActive(false);
    onDrop(e);
  };

  const hasError = error || (isDragActive && !disabled);

  return (
    <label
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      htmlFor="upload-input"
    >
      <input
        type="file"
        id="upload-input"
        accept="image/*, application/pdf" // You can specify the accepted file types
        style={{ display: 'none' }}
        disabled={disabled}
        onChange={onDrop} // Pass the onChange event to handle file selection
      />
      <Box
        sx={{
          m: 0.5,
          width: 64,
          height: 64,
          flexShrink: 0,
          display: 'flex',
          borderRadius: 1,
          cursor: 'pointer',
          alignItems: 'center',
          color: 'text.disabled',
          justifyContent: 'center',
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
          border: (theme) => `dashed 1px ${alpha(theme.palette.grey[500], 0.16)}`,
          ...(isDragActive && {
            opacity: 0.72,
          }),
          ...(disabled && {
            opacity: 0.48,
            pointerEvents: 'none',
          }),
          ...(hasError && {
            color: 'error.main',
            borderColor: 'error.main',
            bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
          }),
          '&:hover': {
            opacity: 0.72,
          },
          ...sx,
        }}
      >
        {placeholder || (
          <>
            <Iconify icon="eva:cloud-upload-fill" width={28} />
            <Typography variant="body2">Upload file</Typography>
          </>
        )}
      </Box>
    </label>
  );
}

UploadBox.propTypes = {
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  placeholder: PropTypes.node,
  sx: PropTypes.object,
  onDrop: PropTypes.func.isRequired, // Pass a callback function to handle file drop
};
