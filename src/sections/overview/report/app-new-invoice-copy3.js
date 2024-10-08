import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';
import Card from '@mui/material/Card';
import TableContainer from '@mui/material/TableContainer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { TableHeadCustom } from 'src/components/table';

function truncateContent(content, maxLength = 100) {
  if (typeof content === 'string' && content.length > maxLength) {
    return content.substring(0, maxLength) + '...';
  }
  return content || '';
}

function AppNewInvoiceRow({ row, onRowClick, isExpanded }) {
  return (
    <TableRow style={{ cursor: 'pointer' }}>
      
      <TableCell style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {row.title}
      </TableCell>
      <TableCell style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {truncateContent(row.content)}
      </TableCell>
      <TableCell style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {row.location}
      </TableCell>
      <TableCell>
        {row.date}
      </TableCell>
      <TableCell>
        <IconButton onClick={() => onRowClick(row.id)}>
          {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

AppNewInvoiceRow.propTypes = {
  row: PropTypes.object.isRequired,
  onRowClick: PropTypes.func.isRequired,
  isExpanded: PropTypes.bool.isRequired,
};

function ExpandedRowDetails({ row }) {
  return (
    <TableRow>
      <TableCell colSpan={5}>
        <Box sx={{ p: 2 }}>
          <div><strong>Title:</strong> {row.title}</div>
          <div style={{
            whiteSpace: 'pre-line', // Preserves newlines
            width: '100%', // Dynamic width based on the parent container
            overflow: 'hidden', // Hide overflow
            textOverflow: 'ellipsis' // Add ellipsis if text is too long
          }}>
            <strong>Content:</strong> {row.content}
          </div>
          <div><strong>Source:</strong> {row.source}</div>
          {row.link && <div><strong>Link:</strong> <a href={row.link} target="_blank" rel="noopener noreferrer">{row.link}</a></div>}
          <div><strong>Location:</strong> {row.location}</div>
          <div><strong>Date:</strong> {row.date}</div>
        </Box>
      </TableCell>
    </TableRow>
  );
}


ExpandedRowDetails.propTypes = {
  row: PropTypes.object.isRequired,
};

export default function AppNewInvoice3({ title, subheader, tableData, tableLabels, ...other }) {
  const [expandedRow, setExpandedRow] = useState(null);

  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />
      <TableContainer sx={{ maxHeight: '70vh', overflow: 'auto' }}>
        <Table sx={{ minWidth: 680 }}>
          <TableHeadCustom headLabel={tableLabels} /> {/* Remove the empty cell */}
          <TableBody>
            {tableData.map((row, index) => (
              <React.Fragment key={index}>
                <AppNewInvoiceRow 
                  row={row} 
                  onRowClick={() => toggleRow(index)} 
                  isExpanded={expandedRow === index}
                />
                {expandedRow === index && <ExpandedRowDetails row={row} />}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Divider sx={{ borderStyle: 'dashed' }} />
      <Box sx={{ p: 2, textAlign: 'right' }}>
        {/* Place any additional components or buttons here if needed */}
      </Box>
    </Card>
  );
}

AppNewInvoice3.propTypes = {
  subheader: PropTypes.string,
  tableData: PropTypes.array.isRequired,
  tableLabels: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
};
