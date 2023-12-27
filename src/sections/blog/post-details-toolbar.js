import PropTypes from 'prop-types';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
// routes
import { RouterLink } from 'src/routes/components';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function PostDetailsToolbar({
  publish,
  onBackClick, // New prop for the back button click handler
  editLink,
  liveLink,
  publishOptions,
  onChangePublish,
  sx,
  ...other
}) {
  const popover = usePopover();

  return (
    <>
      <Stack
        spacing={1.5}
        direction="row"
        sx={{
          mb: { xs: 3, md: 5 },
          ...sx,
        }}
        {...other}
      >
        <Button
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          onClick={onBackClick} // Use the provided callback function
        >
          Back
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        
      </Stack>

      
    </>
  );
}

PostDetailsToolbar.propTypes = {
  onBackClick: PropTypes.func, // New prop for the back button click handler
  editLink: PropTypes.string,
  liveLink: PropTypes.string,
  onChangePublish: PropTypes.func,
  publish: PropTypes.string,
  publishOptions: PropTypes.array,
  sx: PropTypes.object,
};
