import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// utils
import { fDate } from 'src/utils/format-time';
import { fShortenNumber } from 'src/utils/format-number';
// components
import { Grid, Typography} from '@mui/material';

import Label from 'src/components/label';
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import TextMaxLine from 'src/components/text-max-line';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------
const transformDriveLink = (url) => {
  const fileId = url.split('/d/')[1].split('/view')[0];
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
};
export default function PostItemHorizontal({ post, onSelectPost }) {
  const popover = usePopover();
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  
  const {
    title,
    description,
    date,
    coverUrl,
  } = post;
  const transformedCoverUrl = transformDriveLink(post.coverUrl);

  return (
    <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, marginBottom: 3 }}>
      <Box sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <Typography variant="caption" sx={{ color: 'text.disabled', mb: 1 }}>
            {fDate(date)}
          </Typography>
          <Link color="inherit" onClick={() => onSelectPost(post)} underline="hover" sx={{ cursor: 'pointer' }}>
            <Typography variant="subtitle2" noWrap>
              {title}
            </Typography>
          </Link>
          <TextMaxLine variant="body2" line={2} sx={{ color: 'text.secondary' }}>
            {description}
          </TextMaxLine>
        </div>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <IconButton color="default" onClick={() => onSelectPost(post)} sx={{ mt: 2 }}>
            <Iconify icon="solar:eye-bold" />
            <Typography variant="body2"> View</Typography>
          </IconButton>
        </Stack>
      </Box>
      {mdUp && (
        <Box
          sx={{
            width: 180,
            height: 240,
            position: 'relative',
            flexShrink: 0,
            p: 1,
          }}
        >
          <Image alt={title} src={transformedCoverUrl} sx={{ height: 1, borderRadius: 1.5 }} />
        </Box>
      )}
    </Card>
  );
}

PostItemHorizontal.propTypes = {
  post: PropTypes.shape({
    coverUrl: PropTypes.string,
    date: PropTypes.instanceOf(Date),
    description: PropTypes.string,
    title: PropTypes.string,
    onSelectPost: PropTypes.func.isRequired,
  }),
};