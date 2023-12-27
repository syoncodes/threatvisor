import PropTypes from 'prop-types';
import { forwardRef } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
// routes
import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  const theme = useTheme();

  // Embedded SVG code with original colors and paths
  const logo = (
    <Box
      ref={ref}
      component="div"
      sx={{
        width: 40,
        height: 40,
        display: 'inline-flex',
        ...sx,
      }}
      {...other}
    >
      <svg height="100%" width="100%" version="1.1" id="Layer_1" viewBox="0 0 512 512" fill="#000000">
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
    </Box>
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default Logo;
