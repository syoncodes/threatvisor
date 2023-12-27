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

export default function AppNewInvoice2({ title, subheader, tableData, tableLabels, ...other }) {
  return (
    <Box sx={{ maxWidth: '100%' }}>
      <Card {...other}>
        <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

        <TableContainer sx={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
          <Table sx={{ minWidth: 750 }}>
            <TableHeadCustom headLabel={tableLabels} />
            <TableBody>
              {tableData.map((row) => (
                <AppNewInvoiceRow key={row.id} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ borderStyle: 'dashed' }} />

        
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
      <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {row.title}
      </TableCell>
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
      <TableCell>
        {row.locations}
      </TableCell>
      <TableCell>
        {row.occurrences}
      </TableCell>
    </TableRow>
  );
}

AppNewInvoiceRow.propTypes = {
  row: PropTypes.object,
};

