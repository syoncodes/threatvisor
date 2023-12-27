import PropTypes from 'prop-types';
import { formatDistanceToNowStrict } from 'date-fns';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

export default function MailItem({ mail, selected, onClickMail, sx, ...other }) {
  // Check if mail exists, if not, provide a default object
  const mailData = mail || {};

  // Check if mail.from exists, if not, use default values
  const mailTitle = mailData.title || 'No Title Available';

  const fromAvatarUrl = mailData.from?.avatarUrl || ''; // You can provide a default avatar URL if needed

  // Check if mail.createdAt exists, if not, use the current date as a fallback
  const createdAt = mailData.createdAt ? new Date(mailData.createdAt) : new Date();

  return (
    <ListItemButton
      onClick={() => onClickMail(mailData._id)} // Pass the email ID to onClickMail
      sx={{
        p: 1,
        mb: 0.5,
        borderRadius: 1,
        ...(selected && {
          bgcolor: 'action.selected',
        }),
        ...sx,
      }}
      {...other}
    >
      

      <>
        <ListItemText
          primary={mailTitle}
          primaryTypographyProps={{
            noWrap: true,
            variant: 'subtitle2',
          }}
          secondary={mailData.message}
          secondaryTypographyProps={{
            noWrap: true,
            component: 'span',
            variant: mailData.isUnread ? 'subtitle2' : 'body2',
            color: mailData.isUnread ? 'text.primary' : 'text.secondary',
          }}
        />

        <Stack alignItems="flex-end" sx={{ ml: 2, height: 44 }}>
        <Typography
      noWrap
      variant="body2"
      component="span"
      sx={{
        mb: 1.5,
        fontSize: 12,
        color: 'text.disabled',
      }}
    >
      {mail.startDate}
    </Typography>

          {!!mailData.isUnread && (
            <Box
              sx={{
                bgcolor: 'info.main',
                width: 8,
                height: 8,
                borderRadius: '50%',
              }}
            />
          )}
        </Stack>
      </>
    </ListItemButton>
  );
}

MailItem.propTypes = {
  mail: PropTypes.object,
  onClickMail: PropTypes.func,
  selected: PropTypes.bool,
  sx: PropTypes.object,
};
