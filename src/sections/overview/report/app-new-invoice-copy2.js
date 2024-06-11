import PropTypes from 'prop-types';
// @mui
import React, { useEffect, useState } from 'react';
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
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// utils
import { fCurrency } from 'src/utils/format-number';
// components
import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';

// ----------------------------------------------------------------------

export default function AppNewInvoice22({ title, subheader, tableData, tableLabels, ...other }) {
  const [expandedRow, setExpandedRow] = useState(null);

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <TableContainer sx={{ maxHeight: '70vh', overflow: 'auto' }}>
        <Table sx={{ minWidth: 680 }}>
          <TableHeadCustom headLabel={tableLabels} />

          <TableBody>
            {tableData.map((row) => (
              <React.Fragment key={row.id}>
                <AppNewInvoiceRow row={row} onRowClick={() => toggleRow(row.id)} />
                {expandedRow === row.id && <VulnerabilityDetailRow data={row} />}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider sx={{ borderStyle: 'dashed' }} />
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

function AppNewInvoiceRow({ row, onRowClick }) {
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
      <TableCell align="center" sx={{ pr: 6 }}>
        <IconButton onClick={() => onRowClick(row.id)}>
          <KeyboardArrowDownIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}


AppNewInvoiceRow.propTypes = {
  row: PropTypes.object,
};

function VulnerabilityDetailRow({ data }) {
  return (
    <TableRow>
      <TableCell colSpan={5}>
        <Box>
          {/* Apply dynamic styling to each paragraph to preserve formatting and handle overflow */}
          <p style={{
            whiteSpace: 'pre-line', // Preserves newlines
            width: '100%', // Dynamic width based on the parent container
            overflow: 'hidden', // Hide overflow
            textOverflow: 'ellipsis' // Add ellipsis if text is too long
          }}>
            Description: {data.description}
          </p>
          <p style={{
            whiteSpace: 'pre-line',
            width: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            Solutions: {data.solution}
          </p>
          <p style={{
            whiteSpace: 'pre-line',
            width: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            Occurrences: {data.occurrences}
          </p>
        </Box>
      </TableCell>
    </TableRow>
  );
}


VulnerabilityDetailRow.propTypes = {
  data: PropTypes.object.isRequired,
};
