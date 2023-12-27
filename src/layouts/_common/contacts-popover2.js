import { m } from 'framer-motion';
import Badge, { badgeClasses } from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import Iconify from 'src/components/iconify';
import { varHover } from 'src/components/animate';
import React, { useState, useEffect } from 'react';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useRouter } from 'src/routes/hooks'; // Import useRouter

export default function ContactsPopover2() {
  const [walktourVisible, setWalktourVisible] = useState(false);
  const popover = usePopover();
  const router = useRouter();
  const [path, setPath] = useState('');

  const redirectToStoredPath = async () => {
    const storedPath = localStorage.getItem('currentPath');
    const partialPath = '/dashboard/blank/'; // Replace with your partial path
    if (storedPath) {
      await router.replace(partialPath);
      setTimeout(() => {
        router.replace(storedPath);
        setPath(storedPath); // Update the state
      }, 100); // Adjust delay as needed
    } else {
      await router.replace(partialPath);
      setTimeout(() => {
        router.replace('/dashboard'); // Replace '/default-path' with your default path
        setPath('/dashboard'); // Update the state
      }, 1); // Adjust delay as needed
    }
  };

  const toggleWalktour = () => {
    setWalktourVisible(!walktourVisible);
    localStorage.setItem('walktourVisible', JSON.stringify(!walktourVisible));
    console.log('Button clicked');
  };

  useEffect(() => {
    const storedWalktourVisible = localStorage.getItem('walktourVisible');
    if (storedWalktourVisible) {
      setWalktourVisible(JSON.parse(storedWalktourVisible));
    }
  }, []);

  const handleClick = () => {
    toggleWalktour();
    redirectToStoredPath();
  };

  return (
    <Badge
      color="error"
      variant="dot"
      sx={{
        [`& .${badgeClasses.badge}`]: {
          top: 8,
          right: 8,
          bgcolor: walktourVisible ? 'orange' : 'transparent',
        },
      }}
    >
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        color={popover.open ? 'inherit' : 'default'}
        onClick={handleClick}
        sx={{
          ...(popover.open && {
            bgcolor: (theme) => theme.palette.action.selected,
          }),
        }}
      >
        <Iconify icon="solar:lightbulb-bold-duotone" width={24} />
      </IconButton>
    </Badge>
  );
}
