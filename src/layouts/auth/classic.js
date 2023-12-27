import PropTypes from 'prop-types';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
// auth
import { useAuthContext } from 'src/auth/hooks';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// theme
import { bgGradient } from 'src/theme/css';
// components
import Logo from 'src/components/logo';
import { secondaryFont } from 'src/theme/typography';
import { textGradient } from 'src/theme/css';
import { m, useScroll } from 'framer-motion';
// ----------------------------------------------------------------------

const METHODS = [
  {
    id: 'jwt',
    label: 'Jwt',
    path: paths.auth.jwt.login,
    icon: '/assets/icons/auth/ic_jwt.svg',
  },
  {
    id: 'firebase',
    label: 'Firebase',
    path: paths.auth.firebase.login,
    icon: '/assets/icons/auth/ic_firebase.svg',
  },
  {
    id: 'amplify',
    label: 'Amplify',
    path: paths.auth.amplify.login,
    icon: '/assets/icons/auth/ic_amplify.svg',
  },
  {
    id: 'auth0',
    label: 'Auth0',
    path: paths.auth.auth0.login,
    icon: '/assets/icons/auth/ic_auth0.svg',
  },
];
const StyledTextGradient = styled(m.h1)(({ theme }) => ({
  ...textGradient(
    `300deg, ${theme.palette.primary.main} 0%, ${theme.palette.warning.main} 25%, ${theme.palette.primary.main} 50%, ${theme.palette.warning.main} 75%, ${theme.palette.primary.main} 100%`
  ),
  padding: 0,
  marginTop: 8,
  lineHeight: 1,
  marginBottom: 24,
  marginLeft: 10, // Adjust the margin to control the space between logo and text
  letterSpacing: 1,
  textAlign: 'center',
  backgroundSize: '400%',
  fontSize: `${9 / 7}rem`, // Adjust the font size here
  fontFamily: secondaryFont.style.fontFamily,
  [theme.breakpoints.up('md')]: {
    fontSize: `${15 / 11}rem`, // Adjust the font size for larger screens
  },
}));

export default function AuthClassicLayout({ children, image, title }) {
  const theme = useTheme();
  const upMd = useResponsive('up', 'md');

  const renderLogo = (
    <Box
      sx={{
        zIndex: 9,
        position: 'absolute',
        m: { xs: 2, md: 5 },
        display: 'flex',
        flexDirection: 'row', // Stack logo and text vertically
        alignItems: 'flex-start', // Align logo and text to the left

        paddingBottom: '13spx', // Add bottom padding for the logo
      }}
    >
      
      <Logo />
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
    </Box>
  );

  const renderContent = (
    <Stack
      sx={{
        width: 1,
        mx: 'auto',
        maxWidth: 480,
        px: { xs: 2, md: 8 },
        py: { xs: 15, md: 30 },
      }}
    >
      {children}
    </Stack>
  );

  const renderSection = (
    <Stack
      flexGrow={1}
      alignItems="center"
      justifyContent="center"
      spacing={10}
      sx={{
        ...bgGradient({
          color: alpha(
            theme.palette.background.default,
            theme.palette.mode === 'light' ? 0.88 : 0.94
          ),
          imgUrl: '/assets/background/overlay_2.jpg',
        }),
      }}
    >
      <Typography variant="h3" sx={{ maxWidth: 480, textAlign: 'center' }}>
        {title || 'Hi, Welcome back'}
      </Typography>

      <Box
        component="img"
        alt="auth"
        src={image || '/assets/illustrations/illustration_dashboard.png'}
        sx={{ maxWidth: 720 }}
      />
    </Stack>
  );

  return (
    <Stack
      component="main"
      direction="row"
      sx={{
        minHeight: '100vh',
      }}
    >
      {upMd && renderSection}
      <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
      {renderLogo}
      </Link>
      {renderContent}
    </Stack>
  );
}

AuthClassicLayout.propTypes = {
  children: PropTypes.node,
  image: PropTypes.string,
  title: PropTypes.string,
};