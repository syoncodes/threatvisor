'use client';
import { m } from 'framer-motion';
// @mui
import Box from '@mui/material/Box';
import { alpha, useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import { MotionViewport, varFade } from 'src/components/animate';
import Grid from '@mui/material/Unstable_Grid2';
import { useResponsive } from 'src/hooks/use-responsive';
import Image from 'src/components/image';
// _mock
import { _mapContact } from 'src/_mock';
//
import ContactMap from './contact-map';
import ContactForm from './contact-form';

// ----------------------------------------------------------------------

export default function ContactView() {
  const theme = useTheme();
  const mdUp = useResponsive('up', 'md');
  const isLight = theme.palette.mode === 'light';
  const shadow = `-40px 40px 80px ${alpha(
    isLight ? theme.palette.grey[500] : theme.palette.common.black,
    0.24
  )}`;
  return (
    null
  );

}
