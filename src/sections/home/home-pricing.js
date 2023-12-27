import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
import { m } from 'framer-motion';
// @mui
import { alpha } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Image from 'src/components/image';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _homePlans } from 'src/_mock';
// components
import Iconify from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';
import { RouterLink } from 'src/routes/components';
// ----------------------------------------------------------------------

export default function HomePricing() {
  const mdUp = useResponsive('up', 'md');

  const [currentTab, setCurrentTab] = useState('Standard');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const renderDescription = (
    <Stack spacing={3} sx={{ mb: 10, textAlign: 'center' }}>
      <m.div variants={varFade().inUp}>
        <Typography component="div" variant="overline" sx={{ mb: 2, color: 'text.disabled' }}>
          Threatvisor
        </Typography>
      </m.div>

      <m.div variants={varFade().inDown}>
        <Typography variant="h2">
          Cybersecurity is not a luxury, it’s a necessity.
        </Typography>
      </m.div>

    </Stack>
  );
  const renderDescription2 = (
    <Stack spacing={3} sx={{ mb: 10, textAlign: 'center' }}>

      <m.div variants={varFade().inDown}>
        <Typography sx={{ color: 'text.secondary' }}>
        In today’s digital age, cybersecurity is more important than ever. With the increasing reliance on technology and online services, organizations are constantly exposed to a variety of cyber threats. These threats can lead to data breaches, financial losses, and damage to an organization’s reputation. That’s why it’s crucial for organizations to invest in robust cybersecurity measures. By using a platform like Threatvisor, organizations can proactively detect and mitigate cyber threats, safeguard their sensitive data, and maintain the trust of their customers and stakeholders.
        </Typography>
      </m.div>
    </Stack>
  );

  const renderImg = (
    <m.div variants={varFade().inUp}>
      <Image
        alt="darkmode"
        src="/assets/illustrations/characters/character_7.png"
        sx={{
          borderRadius: 2,
          my: { xs: 5, md: 10 },
          boxShadow: (theme) => `-40px 40px 80px ${alpha(theme.palette.common.black, 0.24)}`,
        }}
      />
    </m.div>
  );
  
  const renderContent = (
    <>
      {mdUp ? (
        <Box
          display="grid"
          gridTemplateColumns="repeat(3, 1fr)"
          sx={{
            borderRadius: 2,
            border: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {_homePlans.map((plan) => (
            <m.div key={plan.license} variants={varFade().in}>
              <PlanCard key={plan.license} plan={plan} />
            </m.div>
          ))}
        </Box>
      ) : (
        <>
          <Stack alignItems="center" sx={{ mb: 5 }}>
            <Tabs value={currentTab} onChange={handleChangeTab}>
              {_homePlans.map((tab) => (
                <Tab key={tab.license} value={tab.license} label={tab.license} />
              ))}
            </Tabs>
          </Stack>

          <Box
            sx={{
              borderRadius: 2,
              border: (theme) => `dashed 1px ${theme.palette.divider}`,
            }}
          >
            {_homePlans.map(
              (tab) =>
                tab.license === currentTab && (
                  <PlanCard
                    key={tab.license}
                    plan={tab}
                    sx={{
                      borderLeft: (theme) => `dashed 1px ${theme.palette.divider}`,
                    }}
                  />
                )
            )}
          </Box>
        </>
      )}

      <m.div variants={varFade().in}>
        <Box
          sx={{
            textAlign: 'center',
            mt: {
              xs: 5,
              md: 10,
            },
          }}
        >
          <m.div variants={varFade().inDown}>
            <Typography variant="h4">Join us on the journey to a more secure and resilient future. </Typography>
          </m.div>

          <m.div variants={varFade().inDown}>
            <Typography sx={{ mt: 2, mb: 5, color: 'text.secondary' }}>
             Contact us for any inquiries and to get started with Threatvisor.
            </Typography>
          </m.div>

          <m.div variants={varFade().inUp}>
          <Button
  color="inherit"
  size="large"
  variant="contained"
  component={RouterLink}
  href={paths.about}
  sx={{
    fontSize: '1.0rem', // Adjust the font size as needed
    padding: '16px 34px', // Adjust the padding as needed
  }}
>
              Contact us
            </Button>
          </m.div>
        </Box>
      </m.div>
    </>
  );
  
  return (
    <Box
      sx={{
        py: { xs: 10, md: 15 },
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
      }}
    >
      <Container component={MotionViewport}>
      {renderDescription}
      <Grid container direction={{ xs: 'column', md: 'row-reverse' }} spacing={5}>
        <Grid xs={12} md={8} pt={15}>
        
        {renderDescription2}
        </Grid>

        <Grid xs={12} md={4} pt ={0}>
        {renderImg}
        </Grid>

      </Grid>

        {renderContent}
        
      </Container>
    </Box>
  );
}

// ----------------------------------------------------------------------

function PlanCard({ plan, sx, ...other }) {
  const { license, commons, options, icons } = plan;

  const standard = license === 'Standard';

  const plus = license === 'Standard Plus';

  return (
    null
  );
}

PlanCard.propTypes = {
  plan: PropTypes.object,
  sx: PropTypes.object,
};
