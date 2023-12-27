import { m } from 'framer-motion';
// @mui
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
// utils
import { fToNow } from 'src/utils/format-time';
// _mock
import { _contacts } from 'src/_mock';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { varHover } from 'src/components/animate';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useRouter } from 'src/routes/hooks'; // Import useRouter

// ----------------------------------------------------------------------

export default function ContactsPopover() {
  const popover = usePopover();
  const router = useRouter(); // Use the useRouter hook

  const handleViewAllClick = () => {
    router.push('/dashboard/org'); // Replace '/your-desired-path' with the actual path you want to navigate to
  };
  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        color={popover.open ? 'inherit' : 'default'}
        onClick={handleViewAllClick}
        sx={{
          ...(popover.open && {
            bgcolor: (theme) => theme.palette.action.selected,
          }),
        }}
      >
        <Iconify icon="solar:users-group-rounded-bold-duotone" width={24} />
      </IconButton>
    </>
  );
}
