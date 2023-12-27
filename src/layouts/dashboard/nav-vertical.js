'use client';

import PropTypes from 'prop-types';
import { useEffect } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import { styled, alpha, useTheme } from '@mui/material/styles';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// components
import Logo from 'src/components/logo';
import Scrollbar from 'src/components/scrollbar';
import Link from '@mui/material/Link';
import { usePathname } from 'src/routes/hooks';
import { NavSectionVertical } from 'src/components/nav-section';
import { secondaryFont } from 'src/theme/typography';
import { textGradient, bgGradient, bgBlur } from 'src/theme/css';
import { m, useScroll } from 'framer-motion';
//
import { NAV } from '../config-layout';
import { RouterLink } from 'src/routes/components';

import { useNavData } from './config-navigation';
import { NavToggleButton, NavUpgrade } from '../_common';

// ----------------------------------------------------------------------
const StyledTextGradient = styled(m.h1)(({ theme }) => ({
  ...textGradient(
    `300deg, ${theme.palette.primary.main} 0%, ${theme.palette.warning.main} 25%, ${theme.palette.primary.main} 50%, ${theme.palette.warning.main} 75%, ${theme.palette.primary.main} 100%`
  ),
  padding: 0,
  marginTop: 8,
  lineHeight: 1,
  marginBottom: 24,
  marginLeft: -40,
  marginTop: 20,
  letterSpacing: 1,
  textAlign: 'center',
  backgroundSize: '400%',
  fontSize: `${9 / 7}rem`, // Adjust the font size here
  fontFamily: secondaryFont.style.fontFamily,
  [theme.breakpoints.up('md')]: {
    fontSize: `${15 / 11}rem`, // Adjust the font size for larger screens
  },
}));
const StyledLogoContainer = styled(Box)(({ theme }) => ({
  marginTop: 3,
  marginLeft: 30,
  marginBottom: 1,
}));

const StyledTextContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledNavContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginTop: 10,
  flexDirection: 'row', // Changed to row
  alignItems: 'center', // Adjust alignment as needed
  height: '100%',
  paddingRight: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column', // Revert to column layout on smaller screens
  },
}));

export default function NavVertical({ openNav, onCloseNav }) {
  const { user } = useMockedUser();

  const pathname = usePathname();

  const lgUp = useResponsive('up', 'lg');

  const navData = useNavData();

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
      <StyledNavContent>
        <StyledLogoContainer>
          <Logo />
        </StyledLogoContainer>
        <StyledTextContainer>
          <StyledTextGradient
            animate={{ backgroundPosition: '200% center' }}
            transition={{
              repeatType: 'reverse',
              ease: 'linear',
              duration: 20,
              repeat: Infinity,
            }}
          >
            Threatvisor
          </StyledTextGradient>
        </StyledTextContainer>
      </StyledNavContent>
      </Link>
      <NavSectionVertical
        data={navData}
        config={{
          currentRole: user?.role || 'admin',
        }}
      />

      <Box sx={{ flexGrow: 1 }} />

      
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_VERTICAL },
      }}
    >
      <NavToggleButton />

      {lgUp ? (
        <Stack
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.W_VERTICAL,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Stack>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.W_VERTICAL,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

NavVertical.propTypes = {
  onCloseNav: PropTypes.func,
  openNav: PropTypes.bool,
};
