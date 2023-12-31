import { m, useScroll } from 'framer-motion';
import { useEffect, useRef, useState, useCallback } from 'react';
// @mui
import { styled, alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
// routes
import { paths } from 'src/routes/paths';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// theme
import { secondaryFont } from 'src/theme/typography';
import { textGradient, bgGradient, bgBlur } from 'src/theme/css';
// layouts
import { HEADER } from 'src/layouts/config-layout';
// components
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { MotionContainer, varFade } from 'src/components/animate';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  ...bgGradient({
    color: alpha(theme.palette.background.default, theme.palette.mode === 'light' ? 0.9 : 0.94),
    imgUrl: '/assets/background/overlay_3.jpg',
  }),
  width: '100%',
  height: '100vh',
  position: 'relative',
  [theme.breakpoints.up('md')]: {
    top: 0,
    left: 0,
    position: 'fixed',
  },
}));

const StyledWrapper = styled('div')(({ theme }) => ({
  height: '100%',
  overflow: 'hidden',
  position: 'relative',
  [theme.breakpoints.up('md')]: {
    marginTop: HEADER.H_DESKTOP_OFFSET,
  },
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const StyledTextGradient = styled(m.h1)(({ theme }) => ({
  ...textGradient(
    `300deg, ${theme.palette.primary.main} 0%, ${theme.palette.warning.main} 25%, ${theme.palette.primary.main} 50%, ${theme.palette.warning.main} 75%, ${theme.palette.primary.main} 100%`
  ),
  padding: 0,
  marginTop: 8,
  lineHeight: 1,
  marginBottom: 24,
  letterSpacing: 8,
  textAlign: 'center',
  backgroundSize: '400%',
  fontSize: `${64 / 16}rem`,
  fontFamily: secondaryFont.style.fontFamily,
  [theme.breakpoints.up('md')]: {
    fontSize: `${96 / 16}rem`,
  },
}));

// ----------------------------------------------------------------------



const StyledEllipseTop = styled('div')(({ theme }) => ({
  top: -80,
  width: 480,
  right: -80,
  height: 480,
  borderRadius: '50%',
  position: 'absolute',
  filter: 'blur(100px)',
  WebkitFilter: 'blur(100px)',
  backgroundColor: alpha(theme.palette.primary.darker, 0.12),
}));

const StyledEllipseBottom = styled('div')(({ theme }) => ({
  height: 400,
  bottom: -200,
  left: '10%',
  right: '10%',
  borderRadius: '50%',
  position: 'absolute',
  filter: 'blur(100px)',
  WebkitFilter: 'blur(100px)',
  backgroundColor: alpha(theme.palette.primary.darker, 0.12),
}));

const StyledPolygon = styled('div')(({ opacity = 1, anchor = 'left', theme }) => ({
  ...bgBlur({
    opacity,
    color: theme.palette.background.default,
  }),
  zIndex: 9,
  bottom: 0,
  height: 80,
  width: '50%',
  position: 'absolute',
  clipPath: 'polygon(0% 0%, 100% 100%, 0% 100%)',
  ...(anchor === 'left' && {
    left: 0,
    ...(theme.direction === 'rtl' && {
      transform: 'scale(-1, 1)',
    }),
  }),
  ...(anchor === 'right' && {
    right: 0,
    transform: 'scaleX(-1)',
    ...(theme.direction === 'rtl' && {
      transform: 'scaleX(1)',
    }),
  }),
}));

// ----------------------------------------------------------------------

export default function HomeHero() {
  const mdUp = useResponsive('up', 'md');

  const theme = useTheme();

  const heroRef = useRef(null);

  const { scrollY } = useScroll();

  const [percent, setPercent] = useState(0);

  const isLight = theme.palette.mode === 'light';

  const getScroll = useCallback(() => {
    let heroHeight = 0;

    if (heroRef.current) {
      heroHeight = heroRef.current.offsetHeight;
    }

    scrollY.on('change', (scrollHeight) => {
      const scrollPercent = (scrollHeight * 100) / heroHeight;

      setPercent(Math.floor(scrollPercent));
    });
  }, [scrollY]);

  useEffect(() => {
    getScroll();
  }, [getScroll]);

  const transition = {
    repeatType: 'loop',
    ease: 'linear',
    duration: 60 * 4,
    repeat: Infinity,
  };

  const opacity = 1 - percent / 100;

  const hide = percent > 120;

  const renderDescription = (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        height: 1,
        mx: 'auto',
        mr: 10,
        maxWidth: 580,
        opacity: opacity > 0 ? opacity : 0,
        mt: {
          md: `-${HEADER.H_DESKTOP + percent * 2.5}px`,
        },
      }}
    >
      <m.div variants={varFade().in}>
        <Typography
          variant="h2"
          sx={{
            textAlign: 'center',
            whiteSpace: 'nowrap', // Prevents word wrapping
          }}
        >
          Stay ahead of Vulnerabilities with
        </Typography>
      </m.div>
  
      <m.div variants={varFade().in}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
  <svg
    height="160px"
    width="160px"
    viewBox="0 0 510 510"
    fill="#000000"
    style={{
      verticalAlign: 'middle',
      marginRight: '17px', // Debugging border
    }}
  >
    <g id="SVGRepo_bgCarrier" stroke-width="0"/>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
        <g id="SVGRepo_iconCarrier">
          <path style={{ fill: "#394049" }} d="M125.352,292.262l-58.078,70.291c-5.324,6.444-14.662,7.81-21.609,3.163l-10.211-6.831 c-4.834-3.234-5.654-10.013-1.73-14.306l67.528-73.888L125.352,292.262z"/>
          <path style={{ opacity: 0.3 }} d="M101.253,270.692l-67.528,73.888c-0.722,0.79-1.281,1.665-1.686,2.586 c11.054,6.631,24.23,9.625,38.859,11.004l54.454-65.907L101.253,270.692z"/>
          <path style={{ fill: "#394049" }} d="M386.648,292.262l58.077,70.291c5.324,6.444,14.662,7.81,21.609,3.163l10.211-6.831 c4.834-3.234,5.654-10.013,1.73-14.306l-67.528-73.888L386.648,292.262z"/>
          <path style={{ opacity: 0.3 }} d="M410.747,270.692l67.528,73.888c0.722,0.79,1.281,1.665,1.686,2.586 c-11.054,6.631-24.23,9.625-38.859,11.004l-54.454-65.907L410.747,270.692z"/>
          <path style={{ fill: "#C3C4C7" }} d="M255.999,143.512c40.958,0,105.538,1.162,138.119,3.897c33.132,2.219,59.301,3.972,78.966,17.69 c27.301,19.045,30.982,53.112,30.982,83.925c0,37.243-3.656,63.841-21.852,81.345c-18.519,17.814-45.803,19.557-76.942,19.91 c-1.502,0.018-2.984,0.026-4.435,0.026c-0.003,0-0.003,0-0.007,0c-26.623,0-54.312-2.506-76.434-20.673 c-18.542-15.227-30.011-37.966-43.552-72.098c-1.853-4.67-3.581-9.215-5.157-13.637c-5.04-13.314-11.037-14.465-19.687-14.465 c-8.65,0-14.647,1.151-19.687,14.465c-1.576,4.421-3.304,8.967-5.158,13.637c-13.541,34.132-25.01,56.87-43.552,72.098 c-22.123,18.167-49.811,20.673-76.435,20.673c-0.003,0-0.003,0-0.007,0c-1.451,0-2.933-0.008-4.435-0.026 c-31.139-0.353-58.423-2.096-76.942-19.91c-18.194-17.505-21.85-44.103-21.85-81.345c0-30.812,3.681-64.88,30.982-83.925 c19.665-13.718,45.834-15.471,78.966-17.69C150.462,144.674,215.041,143.512,255.999,143.512z"/>
          <path style={{ fill: "#FF6600" }} d="M131.614,169.6c-70.262,5.019-100.603,2.129-100.603,79.424c0,69.033,14.07,77.476,75.98,78.18 s77.085-13.582,102.715-78.18C240.371,171.728,220.257,163.267,131.614,169.6z"/>
          <path style={{ opacity: 0.15 }} d="M223.073,195.85c-0.579,11.87-5.145,27.642-13.368,48.37 c-25.629,64.598-40.804,78.883-102.715,78.18c-60.955-0.693-75.534-8.887-75.97-75.029c-0.003,0.551-0.011,1.093-0.011,1.652 c0,69.033,14.07,77.476,75.981,78.18c61.909,0.703,77.085-13.582,102.715-78.18C219.092,225.363,223.71,208.16,223.073,195.85z"/>
          <path style={{ fill: "#FF6600" }} d="M380.386,169.6c70.262,5.019,100.604,2.129,100.604,79.424c0,69.033-14.07,77.476-75.981,78.18 s-77.085-13.582-102.715-78.18C271.629,171.728,291.743,163.267,380.386,169.6z"/>
          <path style={{ fill: "#FFFFFF" }} d="M255.999,143.512c-2.557,0-5.206,0.004-7.933,0.014v51.173c0,4.381,3.551,7.933,7.933,7.933 c4.382,0,7.933-3.552,7.933-7.933v-51.173C261.206,143.516,258.557,143.512,255.999,143.512z"/>
          <path style={{ opacity: 0.15 }} d="M288.927,195.85c0.578,11.87,5.144,27.642,13.368,48.37 c25.629,64.598,40.804,78.883,102.715,78.18c60.955-0.693,75.534-8.887,75.97-75.029c0.003,0.551,0.011,1.093,0.011,1.652 c0,69.033-14.07,77.476-75.981,78.18s-77.085-13.582-102.715-78.18C292.908,225.363,288.29,208.16,288.927,195.85z"/>
          {/* Add any additional paths here */}
        </g>
  </svg>
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
</div>
      </m.div>
  

      <m.div variants={varFade().in}>
      <Typography variant="body2" sx={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', textAlign: 'center' }}>
  <strong style={{ fontSize: '34px', display: 'inline-block', marginBottom: '10px', whiteSpace: 'nowrap' }}>Hackers are smart, but AI is smarter.</strong>
  <div style={{ fontSize: '24px' }}>
    Invest in your cybersecurity with Threatvisor, a cybersecurity platform that leverages AI to equip your team with the expertise, tools, and skills to deter cyberattacks.
  </div>
</div>

</Typography>



      </m.div>

      <m.div variants={varFade().in}>
        <Stack
          spacing={0.75}
          direction="row"
          alignItems="center"
          justifyContent="center"
          sx={{ my: 3 }}
        >
          
        </Stack>
      </m.div>

      <m.div variants={varFade().in}>
        <Stack spacing={1.5} direction={{ xs: 'column-reverse', sm: 'row' }} sx={{ mb: 5 }}>
          <Stack alignItems="center" spacing={2}>
            <Button
              component={RouterLink}
              href={paths.dashboard.root}
              color="inherit"
              size="large"
              variant="contained"
              startIcon={<Iconify icon="eva:flash-fill" width={24} />}
            >
              Get Started for Free
            </Button>
          </Stack>

          <Button
            color="inherit"
            component={RouterLink}
            size="large"
            variant="outlined"
            startIcon={<Iconify icon="eva:external-link-fill" width={24} />}
            href={paths.about}
            sx={{ borderColor: 'text.primary' }}
          >
            Contact Us
          </Button>
        </Stack>
      </m.div>
    </Stack>
  );

  const renderSlides = (
    <Stack
      direction="row"
      alignItems="flex-start"
      sx={{
        height: '150%',
        position: 'absolute',
        opacity: opacity > 0 ? opacity : 0,
        transform: `skew(${-16 - percent / 24}deg, ${4 - percent / 16}deg)`,
        ...(theme.direction === 'rtl' && {
          transform: `skew(${16 + percent / 24}deg, ${4 + percent / 16}deg)`,
        }),
      }}
    >
      

      <Stack
        component={m.div}
        variants={varFade().in}
        sx={{ width: 730, position: 'relative', ml: 0 }}
      >
        <Box
          component={m.img}
          animate={{ y: ['100%', '0%'] }}
          transition={transition}
          alt={isLight ? 'light_2' : 'dark_2'}
          src={
            isLight
              ? `/assets/images/home/hero/light_2.webp`
              : `/assets/images/home/hero/dark_2.webp`
          }
          sx={{ position: 'absolute', mt: -5 }}
        />
        <Box
          component={m.img}
          animate={{ y: ['0%', '-100%'] }}
          transition={transition}
          alt={isLight ? 'light_2' : 'dark_2'}
          src={
            isLight
              ? `/assets/images/home/hero/light_2.webp`
              : `/assets/images/home/hero/dark_2.webp`
          }
          sx={{ position: 'absolute' }}
        />
      </Stack>
    </Stack>
  );

  const renderPolygons = (
    <>
      <StyledPolygon />
      <StyledPolygon anchor="right" opacity={0.48} />
      <StyledPolygon anchor="right" opacity={0.48} sx={{ height: 48, zIndex: 10 }} />
      <StyledPolygon anchor="right" sx={{ zIndex: 11, height: 24 }} />
    </>
  );

  const renderEllipses = (
    <>
      {mdUp && <StyledEllipseTop />}
      <StyledEllipseBottom />
    </>
  );

  return (
    <>
      <StyledRoot
        ref={heroRef}
        sx={{
          ...(hide && {
            opacity: 0,
          }),
        }}
      >
        <StyledWrapper>
          <Container component={MotionContainer} sx={{ height: 1 }}>
            <Grid container columnSpacing={{ md: 10 }} sx={{ height: 1 }}>
              <Grid xs={12} md={7.5}>
                {renderDescription}
              </Grid>
            
              {mdUp && (
                <Grid md={4.5}>
                  {renderSlides}
                </Grid>
              )}
            </Grid>

          </Container>

          {renderEllipses}
        </StyledWrapper>
      </StyledRoot>

      {mdUp && renderPolygons}

      <Box sx={{ height: { md: '100vh' } }} />
    </>
  );
}
