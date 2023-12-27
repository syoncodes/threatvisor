import PropTypes from 'prop-types';
// @mui
import React, { useState } from 'react'; 
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Card from '@mui/material/Card';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';  // <-- Added this import
import Badge, { badgeClasses } from '@mui/material/Badge';
import TableContainer from '@mui/material/TableContainer';
import VisibilityIcon from '@mui/icons-material/Visibility';  // <-- Added this import
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';  // <-- Added this import
// utils
import axios from 'axios';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { TableHeadCustom } from 'src/components/table';
import TextField from '@mui/material/TextField'; // <-- Added this import
import FileCopyIcon from '@mui/icons-material/FileCopy'; // <-- Added this import



// ----------------------------------------------------------------------
import { useEffect } from 'react';  // <-- Added this import

// ----------------------------------------------------------------------


  export default function BankingRecentTransitions({
    title,
    subheader,
    tableLabels,
    tableData,
    ...other
  }) {
    const [orgId, setOrgId] = useState('');
    const [showOrgId, setShowOrgId] = useState(false);
  
    const handleCopy = () => {
      if (orgId) {
        navigator.clipboard.writeText(orgId)
          .then(() => {
            console.log('Organization ID copied to clipboard');
          })
          .catch(err => {
            console.error('Could not copy text: ', err);
          });
      }
    };
    

    const fetchOrgId = async (userId) => {
      try {
        console.log(`Sending request to fetch organization ID for user: ${userId}`);
        const response = await axios.post('http://localhost:8080/api/endpoints/fetch-org-id', { userId });
        console.log(`Request status: ${response.status}`);
        if (response.data && response.data.orgId) {
          setOrgId(response.data.orgId);
          console.log(`Organization ID for user ${userId}: ${response.data.orgId}`);
        } else {
          console.log('Organization ID not found in response data');
        }
      } catch (error) {
        console.error("Error fetching organization ID:", error);
      }
    };
  
    useEffect(() => {
      if (tableData.length > 0) {
        // Assuming you want to fetch the organization ID for the first user in the table data
        fetchOrgId(tableData[0].user);
      }
    }, [tableData]);
  
  
    return (
      <Card {...other}>
        <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />
    
        <TableContainer sx={{ overflow: 'unset' }}>
          <Scrollbar sx={{ minWidth: 720 }}>
            <Table>
              <TableHeadCustom headLabel={tableLabels} />
    
              <TableBody>
                {tableData.map((row) => (
                  <BankingRecentTransitionsRow key={row.id} row={row} />
                ))}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
    
        <Divider sx={{ borderStyle: 'dashed' }} />
    
        
    
        {/* Added this block to display the organization ID */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 1 }}>
            Organization ID:
          </Typography>
          <TextField
            size="small"
            value={showOrgId ? orgId : '••••••••'}
            InputProps={{
              readOnly: true,
            }}
            sx={{ mr: 1 }}
          />
          <IconButton onClick={handleCopy} sx={{ mr: 1 }}>
            <FileCopyIcon />
          </IconButton>
          <Button
            variant="outlined"
            startIcon={showOrgId ? <VisibilityOffIcon /> : <VisibilityIcon />}
            onClick={() => setShowOrgId(!showOrgId)}
          >
            {showOrgId ? 'Hide' : 'Show'}
          </Button>
        </Box>
      </Card>
    );
    
}


BankingRecentTransitions.propTypes = {
  subheader: PropTypes.string,
  tableData: PropTypes.array,
  tableLabels: PropTypes.array,
  title: PropTypes.string,
};

// ----------------------------------------------------------------------

function BankingRecentTransitionsRow({ row }) {
  const theme = useTheme();

  const isLight = theme.palette.mode === 'light';

  const popover = usePopover();



  const [editPopover, setEditPopover] = useState(null);
  const [newRole, setNewRole] = useState('Regular');
  const [newPassword, setNewPassword] = useState('');

  const handleEditOpen = (event) => {
    setEditPopover(event.currentTarget);
  };

  const handleEditClose = () => {
    setEditPopover(null);
  };

  const handleRoleChange = (e) => {
    setNewRole(e.target.value);
    console.log("Updated role:", e.target.value);  // Debug statement to check the updated role
  };

  const handleSaveEdit = async () => {
    handleEditClose();
    const updatedData = {
        userEmail: row.user,
        newPassword,
        newRole,
    };
    console.log("Sending data:", updatedData);
    try {
        await axios.post('http://localhost:8080/api/auth/editUser', updatedData);
    } catch (error) {
        console.error("Error sending data:", error);
    }
};

const handleCopy = () => {
  copy(orgId);
  alert('Organization ID copied to clipboard!'); // You might want to replace this with a snackbar notification
};

  
  const handleDelete = async () => {
    popover.onClose();
    // Send a request to the backend to remove the user from the organization
    await axios.post('http://localhost:8080/api/auth/removeUser', { userEmail: row.user });
  };
  
  const renderAvatar = (
    <Box sx={{ position: 'relative', mr: 2 }}>
      <Badge
        overlap="circular"
        color={row.type === 'Income' ? 'success' : 'error'}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          <Iconify
            icon={
              row.type === 'Income'
                ? 'eva:diagonal-arrow-left-down-fill'
                : 'eva:diagonal-arrow-right-up-fill'
            }
            width={16}
          />
        }
        sx={{
          [`& .${badgeClasses.badge}`]: {
            p: 0,
            width: 20,
          },
        }}
      >
        <Avatar
          src={row.avatarUrl || ''}
          sx={{
            width: 48,
            height: 48,
            color: 'text.secondary',
            bgcolor: 'background.neutral',
          }}
        >
          {row.category === 'Books' && <Iconify icon="eva:book-fill" width={24} />}
          {row.category === 'Beauty & Health' && <Iconify icon="solar:heart-bold" width={24} />}
        </Avatar>
      </Badge>
    </Box>
  );

  return (
    <>
      <TableRow>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          {renderAvatar}
          <ListItemText primary={row.user} secondary={row.category} />
        </TableCell>

        <TableCell>
          
        </TableCell>

        <TableCell></TableCell>

        <TableCell>
          <Label
            variant={isLight ? 'soft' : 'filled'}
            color={
              (row.role === 'Admin' && 'success') ||
              (row.role === 'Regular' && 'warning') ||
              'error'
            }
          >
            {row.role}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ pr: 1 }}>
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
        

        <MenuItem onClick={handleEditOpen}>
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <CustomPopover
        open={Boolean(editPopover)}
        onClose={handleEditClose}
        arrow="right-top"
        sx={{ width: 200 }}
      >
        <MenuItem>
          <input
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </MenuItem>
        <MenuItem>
          <select value={newRole} onChange={handleRoleChange}>
            <option value="Admin">Admin</option>
            <option value="Regular">Regular</option>
          </select>
        </MenuItem>
        <MenuItem onClick={handleSaveEdit}>
          Save
        </MenuItem>
      </CustomPopover>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Remove
        </MenuItem>
      </CustomPopover>
    </>
  );
}

BankingRecentTransitionsRow.propTypes = {
  row: PropTypes.object,
};
