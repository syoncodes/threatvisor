import { m } from 'framer-motion';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import CardActionArea from '@mui/material/CardActionArea';
import { alpha } from '@mui/material/styles';
// components
import { primaryPresets } from 'src/theme/options/presets';
// components
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { MotionViewport, varFade } from 'src/components/animate';
import { useResponsive } from 'src/hooks/use-responsive';
// ----------------------------------------------------------------------

export default function HomeColorPresets() {
  const settings = useSettingsContext();
  const mdUp = useResponsive('up', 'md');

  const options = primaryPresets.map((color) => ({
    name: color.name,
    value: color.main,
  }));

  const renderDescription = (
    <Stack spacing={3} sx={{ textAlign: 'center' }}>
      <m.div variants={varFade().inDown}>
        <Typography component="div" variant="overline" sx={{ color: 'text.disabled' }}>
          Threatvisor Social Engineering Engine
        </Typography>
      </m.div>

      <m.div variants={varFade().inDown}>
        <Typography variant="h2"> Automated Organization Phishing Tests </Typography>
      </m.div>

      <m.div variants={varFade().inDown}>
        <Typography sx={{ color: 'text.secondary' }}>
        Automated organization phishing tests are a critical component of Threatvisor’s AI powered cybersecurity platform. These tests simulate phishing attacks on your organization to assess the readiness of your team against such threats. The tests are personalized and automated, meaning they can mimic real-world phishing scenarios that are relevant to your organization and industry and customizable.
        </Typography>
      </m.div>
    </Stack>
  );

  const renderContent = (
    <Box sx={{ position: 'relative' }}>
      <Image disabledEffect alt="grid" src="/assets/images/home/presets/grid.webp" />

      <Box sx={{ position: 'absolute', top: 0 }}>
        <m.div variants={varFade().inUp}>
          <Image
            disabledEffect
            alt="screen"
            src={`/assets/images/home/presets/screen_${settings.themeColorPresets}.webp`}
          />
        </m.div>
      </Box>

      <Box sx={{ position: 'absolute', top: 0 }}>
        <m.div variants={varFade().inDown}>
          <m.div animate={{ y: [0, -15, 0] }} transition={{ duration: 8, repeat: Infinity }}>
            <Image
              disabledEffect
              alt="sidebar"
              src={`/assets/images/home/presets/block_${settings.themeColorPresets}.webp`}
            />
          </m.div>
        </m.div>
      </Box>

      <Box sx={{ position: 'absolute', top: 0 }}>
        <m.div variants={varFade().inDown}>
          <m.div animate={{ y: [-5, 10, -5] }} transition={{ duration: 8, repeat: Infinity }}>
            <Image
              disabledEffect
              alt="chart"
              src={`/assets/images/home/presets/chart_${settings.themeColorPresets}.webp`}
            />
          </m.div>
        </m.div>
      </Box>

      <Box sx={{ position: 'absolute', top: 0 }}>
        <m.div variants={varFade().inDown}>
          <m.div animate={{ y: [-25, 5, -25] }} transition={{ duration: 10, repeat: Infinity }}>
            <Image
              disabledEffect
              alt="sidebar"
              src={`/assets/images/home/presets/sidebar_${settings.themeColorPresets}.webp`}
            />
          </m.div>
        </m.div>
      </Box>
    </Box>
  );

  const renderOptions = (
    <m.div variants={varFade().inDown}>
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{
          my: 5,
          width: 100,
          height: 88,
          mx: 'auto',
          position: 'relative',
        }}
      >
        {options.map((color, index) => {
          const { name, value } = color;

          const selected = settings.themeColorPresets === name;

          return (
            <CardActionArea
              key={name}
              onClick={() => settings.onUpdate('themeColorPresets', name)}
              sx={{
                width: 24,
                height: 24,
                bgcolor: value,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                position: 'absolute',
                color: 'common.white',
                ...(index === 0 && { bottom: 0 }),
                ...(index === 1 && { left: 19 }),
                ...(index === 2 && { right: 19 }),
                ...(index === 3 && { top: 0, left: 0 }),
                ...(index === 4 && { top: 0 }),
                ...(index === 5 && { top: 0, right: 0 }),
              }}
            >
              {selected && <Iconify icon="eva:color-picker-fill" width={16} />}
            </CardActionArea>
          );
        })}
      </Stack>
    </m.div>
  );

  const renderImg = (
    <m.div variants={varFade().inUp}>
      <Image
        alt="darkmode"
        src="/assets/images/home/darkmode3.webp"
        sx={{
          borderRadius: 2,
          my: { xs: 5, md: 10 },
          boxShadow: (theme) => `-40px 40px 80px ${alpha(theme.palette.common.black, 0.24)}`,
        }}
      />
    </m.div>
  );
  const renderDescription2 = (
    <Stack
      sx={{
        textAlign: { xs: 'center', md: 'unset' },
        pl: { md: 4 },
        pt: { md: 15 },
      }}
    >
      

      <m.div variants={varFade().inUp}>
        <Typography
          sx={{
            mb: 5,
            color: 'text.secondary',
          }}
        >These automated tests help to create a culture of cybersecurity awareness within your organization. When your team members regularly encounter simulated phishing attacks, they become more alert and prepared to identify and report real phishing attempts. Phishing attacks one of the most prevalent and successful cyberattacks, causing 22% of data breaches in 2020. By increasing your team’s awareness of phishing, you can lower the risk of being targeted by such attacks, which can endanger your data, reputation, and finances.  Automated phishing tests not only evaluate your team’s cybersecurity knowledge, but also educate them to be more cautious and accountable online.
        </Typography>
      </m.div>

      {mdUp}
    </Stack>
  );
  return (
    <Container
      component={MotionViewport}
      sx={{
        position: 'relative',
        py: { xs: 10, md: 15 },
      }}
    >
      {renderDescription}
      <Grid container direction={{ xs: 'column', md: 'row-reverse' }} spacing={5}>
        <Grid xs={12} md={4.2}>
        
        {renderDescription2}
        </Grid>

        <Grid xs={12} md={7.8} pt ={8}>
        {renderImg}
        </Grid>

      </Grid>
    </Container>
  );
}

