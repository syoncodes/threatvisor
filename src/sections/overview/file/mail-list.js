import PropTypes from 'prop-types';
// @mui
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
//
import MailItem from './mail-item';
import { MailItemSkeleton } from './mail-skeleton';

// ----------------------------------------------------------------------

export default function MailList({
  loading,
  mails,
  //
  openMail,
  onCloseMail,
  onClickMail,
  //
  selectedLabelId,
  selectedMailId,
}) {
  const mdUp = useResponsive('up', 'md');

  const renderSkeleton = (
    <>
      {[...Array(8)].map((_, index) => (
        <MailItemSkeleton key={index} />
      ))}
    </>
  );

  const renderList = (
    <>
      {mails.allIds.map((mailId) => (
        <MailItem
          key={mailId}
          mail={mails.byId[mailId]}
          selected={selectedMailId === mailId}
          onClickMail={() => {
            onClickMail(mailId);
          }}
        />
      ))}
    </>
  );

  const renderContent = (
    <>
      <Stack sx={{ p: 2 }}>
        {mdUp ? (
          <TextField
            placeholder="Current Phishing Tests"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                </InputAdornment>
              ),
            }}
            disabled
          />
        ) : (
          <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
            {selectedLabelId}
          </Typography>
        )}
      </Stack>

      <Scrollbar sx={{ px: 2 }}>
        {loading && renderSkeleton}

        {!!mails.allIds.length && renderList}
      </Scrollbar>
    </>
  );

  return mdUp ? (
    <Stack
      sx={{
        width: 320,
        flexShrink: 0,
        borderRadius: 1.5,
        bgcolor: 'background.default',
        pt: 2, // Add padding top
        pb: 2, // Add padding bottom
      }}
    >
      {renderContent}
    </Stack>
  ) : (
    <Drawer
      open={openMail}
      onClose={onCloseMail}
      slotProps={{
        backdrop: { invisible: true },
      }}
      PaperProps={{
        sx: {
          width: 320,
          pt: 2, // Add padding top
          pb: 2, // Add padding bottom
        },
      }}
    >
      {renderContent}
    </Drawer>
  );
  
}

MailList.propTypes = {
  loading: PropTypes.bool,
  mails: PropTypes.object,
  onClickMail: PropTypes.func,
  onCloseMail: PropTypes.func,
  openMail: PropTypes.bool,
  selectedLabelId: PropTypes.string,
  selectedMailId: PropTypes.string,
};
