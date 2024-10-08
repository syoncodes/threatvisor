// routes
import { paths } from 'src/routes/paths';
// config
import { PATH_AFTER_LOGIN } from 'src/config-global';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export const navConfig = [
  {
    title: 'Home',
    icon: <Iconify icon="solar:home-2-bold-duotone" />,
    path: '/',
  },
  {
    title: 'Demo',
    icon: <Iconify icon="solar:notebook-bold-duotone" />,
    path: paths.components,
  },
  {
    title: 'Contact/About Us',
    icon: <Iconify icon="solar:notebook-bold-duotone" />,
    path: paths.about,
  },
];
