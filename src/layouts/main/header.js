import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Badge, { badgeClasses } from '@mui/material/Badge';
import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive';
import { bgBlur } from 'src/theme/css';
import { paths } from 'src/routes/paths';
import Logo from 'src/components/logo';
import Label from 'src/components/label';
import { HEADER } from '../config-layout';
import { navConfig } from './config-navigation';
import NavMobile from './nav/mobile';
import NavDesktop from './nav/desktop';
import { secondaryFont } from 'src/theme/typography';
import { textGradient, bgGradient } from 'src/theme/css';
import { m, useScroll } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { SettingsButton, HeaderShadow, LoginButton } from '../_common';
import { RouterLink } from 'src/routes/components';

const StyledTextGradient = styled(m.h1)(({ theme }) => ({
  ...textGradient(
    `300deg, ${theme.palette.primary.main} 0%, ${theme.palette.warning.main} 25%, ${theme.palette.primary.main} 50%, ${theme.palette.warning.main} 75%, ${theme.palette.primary.main} 100%`
  ),
  padding: 0,
  paddingTop: 15, // Adjust the top padding for the logo
  marginTop: 10,
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

export default function Header() {
  const theme = useTheme();
  const mdUp = useResponsive('up', 'md');
  const offsetTop = useOffSetTop(HEADER.H_DESKTOP);

  return (
    <AppBar>
      <Toolbar
        disableGutters
        sx={{
          height: {
            xs: HEADER.H_MOBILE,
            md: HEADER.H_DESKTOP,
          },
          transition: theme.transitions.create(['height'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.shorter,
          }),
          ...(offsetTop && {
            ...bgBlur({
              color: theme.palette.background.default,
            }),
            height: {
              md: HEADER.H_DESKTOP_OFFSET,
            },
          }),
        }}
      >
        <Container sx={{ height: 1, display: 'flex', alignItems: 'center' }}>
        <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              sx={{
                [`& .${badgeClasses.badge}`]: {
                  top: 10, // Adjust the top margin for the badge containing the logo
                  right: -150,
                },
              }}
              badgeContent={
                <Label color="info" sx={{ textTransform: 'unset', height: 22, px: 0.5 }}>
                  Pre-Alpha
                </Label>
              }
            >
              <Logo />
            </Badge>

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
          </Link>
          <Box sx={{ flexGrow: 1 }} />

          {mdUp && <NavDesktop offsetTop={offsetTop} data={navConfig} />}

          <Stack alignItems="center" direction={{ xs: 'row', md: 'row-reverse' }}>
            <Button variant="contained" href={paths.auth.jwt.register}>
              Sign Up
            </Button>

            {mdUp && <LoginButton />}

            <SettingsButton
              sx={{
                ml: { xs: 1, md: 0 },
                mr: { md: 2 },
              }}
            />

            {!mdUp && <NavMobile offsetTop={offsetTop} data={navConfig} />}
          </Stack>
        </Container>
      </Toolbar>

      {offsetTop && <HeaderShadow />}
    </AppBar>
  );
}
