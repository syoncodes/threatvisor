import { m } from 'framer-motion';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// components
import Image from 'src/components/image';
import { useSettingsContext } from 'src/components/settings';
import { MotionViewport, varFade } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function HomeDarkMode() {
  const settings = useSettingsContext();

  const renderDescription = (
    <Stack alignItems="center" spacing={3}>
      <m.div variants={varFade().inUp}>
        <Typography component="div" variant="overline" sx={{ color: 'primary.main' }}>
          Threatvisor vulnerability algorithm
        </Typography>
      </m.div>

      <m.div variants={varFade().inUp}>
        <Typography variant="h2" sx={{ color: 'common.white' }}>
          Comprehensive Vulnerability Analysis
        </Typography>
      </m.div>

      <m.div variants={varFade().inUp}>
        <Typography sx={{ color: 'grey.500' }}>
        Our sophisticated vulnerability analysis is a crucial component of our cybersecurity platform. It systematically examines your organization’s IT infrastructure to identify security weaknesses. This comprehensive process involves scanning your systems and devices, checking for known vulnerabilities from the most reliable databases. Our vulnerability analysis not only identifies security flaws but also ranks them based on their severity, providing your team with a prioritized list of vulnerabilities to address. By leveraging our vulnerability analysis, organizations can proactively address security weaknesses, thereby reducing the risk of cyberattacks and enhancing their overall security posture.
        </Typography>
      </m.div>
    </Stack>
  );

  const renderImg = (
    <m.div variants={varFade().inUp}>
      <Image
        alt="darkmode"
        src="/assets/images/home/darkmode2.webp"
        sx={{
          borderRadius: 2,
          my: { xs: 5, md: 10 },
          boxShadow: (theme) => `-40px 40px 80px ${alpha(theme.palette.common.black, 0.24)}`,
        }}
      />
    </m.div>
  );

  return (
    <Box
      sx={{
        textAlign: 'center',
        bgcolor: 'grey.900',
        pt: { xs: 10, md: 15 },
        pb: { xs: 10, md: 20 },
      }}
    >
      <Container component={MotionViewport}>
        {renderDescription}

        {renderImg}
      </Container>
    </Box>
  );
}
