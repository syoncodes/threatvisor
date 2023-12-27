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
import Typography from '@mui/material/Typography'; // Import Typography
// ----------------------------------------------------------------------
import { useRouter } from 'src/routes/hooks'; // Import useRouter

  

// Helper function to truncate content
function truncateContent(content, maxLength = 100) {
  if (typeof content === 'string' && content.length > maxLength) {
    return content.substring(0, maxLength) + '...';
  }
  return content || '';
}

export default function AppNewInvoice3({ title, subheader, tableData, tableLabels, ...other }) {
  // Limit the tableData to the first 5 rows
  const truncatedTableData = tableData.slice(0, 5);
  const router = useRouter(); // Use the useRouter hook

  const handleViewAllClick = () => {
    router.push('/dashboard/exploits/') // Replace '/your-desired-path' with the actual path you want to navigate to
  };

  return (
    <Box sx={{ maxWidth: '100%' }}>
      <Card {...other}>
        <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />
        {truncatedTableData.length > 0 ? (
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHeadCustom headLabel={tableLabels} />
              <TableBody>
                {truncatedTableData.map((row, index) => (
                  <AppNewInvoiceRow key={index} row={row} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2">No data available</Typography>
          </Box>
        )}
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


AppNewInvoice3.propTypes = {
  subheader: PropTypes.string,
  tableData: PropTypes.array,
  tableLabels: PropTypes.array,
  title: PropTypes.string,
};

function AppNewInvoiceRow({ row }) {
  return (
    <TableRow>
      <TableCell style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {row.title}
      </TableCell>
      <TableCell style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {truncateContent(row.content)}
      </TableCell>
      <TableCell style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {row.location}
      </TableCell>
      <TableCell>{row.date}</TableCell>
    </TableRow>
  );
}

AppNewInvoiceRow.propTypes = {
  row: PropTypes.object,
};