import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
// routes
import { useRouter } from 'src/routes/hooks';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// utils
import { fDate } from 'src/utils/format-time';
// components
import { Grid, Typography } from '@mui/material';
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import TextMaxLine from 'src/components/text-max-line';

// ----------------------------------------------------------------------

export default function PostItemHorizontal({ post, onSelectPost }) {
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');

  const {
    title,
    description,
    date,
    coverUrl,
  } = post;

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
          <Image alt={title} src={`data:image/jpeg;base64,${coverUrl}`} sx={{ height: 1, borderRadius: 1.5 }} />
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
  }),
  onSelectPost: PropTypes.func.isRequired,
};
