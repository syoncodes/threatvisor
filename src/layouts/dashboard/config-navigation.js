import { useMemo } from 'react';
// routes
import { paths } from 'src/routes/paths';
// locales
import { useLocales } from 'src/locales';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
import AccessibleForwardIcon from '@mui/icons-material/AccessibleForward';
import SearchIcon from '@mui/icons-material/Search';
import BugReportIcon from '@mui/icons-material/BugReport';
import SecurityIcon from '@mui/icons-material/Security';
import AndroidIcon from '@mui/icons-material/Android';
import PersonIcon from '@mui/icons-material/Person';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  robot: <AndroidIcon sx={{ width: 1, height: 1 }} />,
  magnifyingGlass: <SearchIcon sx={{ width: 1, height: 1 }} />,
  bug: <BugReportIcon sx={{ width: 1, height: 1 }} />,
  shield: <SecurityIcon sx={{ width: 1, height: 1 }} />,
  hacker: <PersonIcon sx={{ width: 1, height: 1 }} />,
  endpoint: (
    <Iconify
      icon="solar:translation-2-bold-duotone"
      // You can adjust the size and other props as needed
      sx={{ width: 1, height: 1 }}
    />
  ),
  ai: (
    <Iconify
      icon="ri:robot-2-fill"
      // You can adjust the size and other props as needed
      sx={{ width: 1, height: 1 }}
    />
  ),
  report: (
    <Iconify
      icon="icon-park-solid:table-report"
      // You can adjust the size and other props as needed
      sx={{ width: 1, height: 1 }}
    />
  ),
  phishing: (
    <Iconify
      icon="mdi:email"
      // You can adjust the size and other props as needed
      sx={{ width: 1, height: 1 }}
    />
  ),
  admin: (
    <Iconify
      icon="ri:admin-fill"
      // You can adjust the size and other props as needed
      sx={{ width: 1, height: 1 }}
    />
  ),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useLocales();

  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: t('Main'),
        items: [
          {
            title: t('App'),
            path: paths.dashboard.root,
            icon: ICONS.dashboard,
          },
          {
            title: t('report'),
            path: paths.dashboard.general.report,
            icon: ICONS.report,
          },
          {
            title: t('Threatvisor Ai'),
            path: paths.dashboard.general.ai,
            icon: ICONS.ai,
          },
          {
            title: t('Vulnerability Details'),
            path: paths.dashboard.general.vulnerabilitydetails,
            icon: ICONS.shield,
          },
          {
            title: t('Vulnerability IDs'),
            path: paths.dashboard.general.vulnerabilityids,
            icon: ICONS.magnifyingGlass,
          },
          {
            title: t('exploits'),
            path: paths.dashboard.general.exploits,
            icon: ICONS.bug,
          },
          {
            title: t('Phishing'),
            path: paths.dashboard.general.file,
            icon: ICONS.phishing,
          },
          {
            title: t('News'),
            path: paths.dashboard.post.root,
            icon: ICONS.blog,
          },
          {
            title: t('Cloud SIEM'),
            path: '#disabled',
            icon: ICONS.disabled,
            disabled: true,
          },
          
          
        ],
      },

      // MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: t('management'),
        
        items: [
          // ENDPOINTS
          {
            title: t('Endpoints'),
            path: paths.dashboard.endpoints.root,
            icon: ICONS.endpoint,
            children: [
              { title: t('list'), path: paths.dashboard.endpoints.root },
              { title: t('create'), path: paths.dashboard.endpoints.new },
            ],
          },
          // ORGANIZATION
          {
            title: t('Administrator'),
            path: paths.dashboard.general.org,
            icon: ICONS.admin,
          },
          // USER
          {
            title: t('user'),
            path: paths.dashboard.user.account,
            icon: ICONS.user,
          },
        ],
      },
    ],
    [t]
  );

  return data;
}
