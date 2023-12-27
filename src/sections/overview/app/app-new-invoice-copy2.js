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

export default function AppNewInvoice22({ title, subheader, tableData, tableLabels, ...other }) {
  const router = useRouter(); // Use the useRouter hook

  const handleViewAllClick = () => {
    router.push('/dashboard/vulnerabilitydetails/'); // Replace '/your-desired-path' with the actual path you want to navigate to
  };
    return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <TableContainer sx={{ overflow: 'unset' }}>
        <Scrollbar>
          <Table sx={{ minWidth: 680 }}>
            <TableHeadCustom headLabel={tableLabels} />

            <TableBody>
              {tableData.map((row) => (
                <AppNewInvoiceRow key={row.id} row={row} />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ p: 2, textAlign: 'right' }}>
      <Button
          size="small"
          color="inherit"
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />}
          onClick={handleViewAllClick} // Attach the click handler here
        >
          View More
        </Button>
      </Box>
    </Card>
  );
}

AppNewInvoice22.propTypes = {
  subheader: PropTypes.string,
  tableData: PropTypes.array,
  tableLabels: PropTypes.array,
  title: PropTypes.string,
};

// ----------------------------------------------------------------------

function AppNewInvoiceRow({ row }) {
  return (
    <TableRow>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.title}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.location}</TableCell>
      <TableCell>
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
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.date}</TableCell>
      <TableCell align="right" sx={{ pr: 1 }}>
        {/* You can add actions here if needed */}
      </TableCell>
    </TableRow>
  );
}

AppNewInvoiceRow.propTypes = {
  row: PropTypes.object,
};
