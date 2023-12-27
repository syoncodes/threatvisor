import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import TableContainer from '@mui/material/TableContainer';
// utils
import { fCurrency } from 'src/utils/format-number';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { TableHeadCustom } from 'src/components/table';

// ----------------------------------------------------------------------

import { useRouter } from 'src/routes/hooks'; // Import useRouter

  
export default function AppNewInvoice2({ title, subheader, tableData, tableLabels, ...other }) {
  const router = useRouter(); // Use the useRouter hook

  const handleViewAllClick = () => {
    router.push('/dashboard/vulnerabilityids/') // Replace '/your-desired-path' with the actual path you want to navigate to
  };
  return (
    <Box sx={{ maxWidth: '100%' }}>
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <TableContainer sx={{ overflow: 'unset' }}>
        
          <Table sx={{ maxWidth: 480 }}>
            <TableHeadCustom headLabel={tableLabels} />

            <TableBody>
              {tableData.map((row) => (
                <AppNewInvoiceRow key={row.id} row={row} />
              ))}
            </TableBody>
          </Table>
        
      </TableContainer>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button
          size="small"
          color="inherit"
          onClick={handleViewAllClick}
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />}
        >
          View More
        </Button>
      </Box>
    </Card>
    </Box>
  );
}

AppNewInvoice2.propTypes = {
  subheader: PropTypes.string,
  tableData: PropTypes.array,
  tableLabels: PropTypes.array,
  title: PropTypes.string,
};

// ----------------------------------------------------------------------
function TableCellComponent({ row }) {
  return (
    <TableCell style={{ visibility: row.invisible ? 'hidden' : 'visible' }}>
      {row.title}
    </TableCell>
  );
}

function AppNewInvoiceRow({ row }) {
  return (
    <TableRow>
      <TableCell sx={{ width: '50%', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {row.title}
      </TableCell>
      <TableCell sx={{ width: '50%', textAlign: 'right' }}>
        <Label
          variant="soft"
          color={
            (row.severity === 'High' && 'error') ||
            (row.severity === 'Medium' && 'warning') ||
            (row.severity === 'Low' && 'info') ||
            'default'
          }
        >
          {row.severity}
        </Label>
      </TableCell>
    </TableRow>
  );
}

AppNewInvoiceRow.propTypes = {
  row: PropTypes.object,
};
