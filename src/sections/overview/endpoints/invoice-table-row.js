import PropTypes from 'prop-types';
import { format } from 'date-fns';
// @mui
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// utils
import { fCurrency } from 'src/utils/format-number';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function InvoiceTableRow({
  row,
  selected,
  onSelectRow,

  onEditRow,
  onDeleteRow,
}) {
  const { startDate, items, status, hygiene, name } = row;
  const item = items[0];

  const confirm = useBoolean();
  const popover = usePopover();

  const handleDeleteEndpoint = async () => {
    let endpointIdentifier;
    switch (item.service) {
      case 'Domain':
        endpointIdentifier = item.url;
        break;
      case 'Network':
        endpointIdentifier = item.ipAddress;
        break;
      case 'Phishing':
      case 'OSINT':
        endpointIdentifier = item.title;
        break;
      default:
        endpointIdentifier = '';
    }

    try {
      await axios.delete('http://localhost:8080/api/endpoints/delete-endpoint/user', {
        data: { identifier: endpointIdentifier, service: item.service },
      });
      onDeleteRow(); // Call the onDeleteRow callback after successful deletion
    } catch (error) {
      console.error('Error deleting endpoint:', error);
    }
  };

  let mainTitle = '';
  switch (item.service) {
    case 'Domain':
      mainTitle = item.url;
      break;
    case 'Network':
      mainTitle = item.ipAddress;
      break;
    case 'Phishing':
    case 'OSINT':
      mainTitle = item.title;
      break;
    default:
      mainTitle = '';
  }

  return (
    <>
      <TableRow hover selected={selected}>


        <TableCell sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography variant="body2" noWrap>
            {mainTitle || '-'}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {item.service || '-'}
          </Typography>
        </TableCell>

        <TableCell>
          <ListItemText
            primary={format(new Date(startDate), 'dd MMM yyyy') || '-'}
            secondary={format(new Date(startDate), 'p') || '-'}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        <TableCell align="center">
          <Label
            variant="soft"
            color="default"
          >
            {hygiene || '-'}
          </Label>
        </TableCell>

        <TableCell align="center">
          <Label
            variant="soft"
            color="default"
          >
            {name || '-'}
          </Label>
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (status === 'paid' && 'success') ||
              (status === 'pending' && 'warning') ||
              (status === 'overdue' && 'error') ||
              'default'
            }
          >
            {status || '-'}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ px: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        
        

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );


}

InvoiceTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,

  row: PropTypes.object,
  selected: PropTypes.bool,
};
