'use client';

import { useState, useEffect, useCallback } from 'react'; // Added useEffect
import axios from 'axios'; // Added axios
// @mui
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';


import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

// auth
import { RoleBasedGuard } from 'src/auth/guard';
// routes
import { paths } from 'src/routes/paths';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// _mock
import { _bankingContacts, _bankingCreditCard, _OrgUsersList, _folders, _files } from 'src/_mock';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { UploadBox } from 'src/components/upload';
import { useSettingsContext } from 'src/components/settings';
import BankingRecentTransitions from '../userlist';
//
import FileWidget from '../../../file-manager/file-widget';
import FileUpgrade from '../../../file-manager/file-upgrade';
import FileRecentItem from '../../../file-manager/file-recent-item';
import FileDataActivity from '../../../file-manager/file-data-activity';
import FileStorageOverview from '../../../file-manager/file-storage-overview';
//
import FileManagerPanel from '../../../file-manager/file-manager-panel';
import FileManagerFolderItem from '../../../file-manager/file-manager-folder-item';
import FileManagerNewFolderDialog from '../../../file-manager/file-manager-new-folder-dialog';

// ----------------------------------------------------------------------

const GB = 1000000000 * 24;

const TIME_LABELS = {
  week: ['Mon', 'Tue', 'Web', 'Thu', 'Fri', 'Sat', 'Sun'],
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  year: ['2018', '2019', '2020', '2021', '2022'],
};

// ----------------------------------------------------------------------

export default function OrgFileView() {
  const theme = useTheme();

  const smDown = useResponsive('down', 'sm');

  const settings = useSettingsContext();

  const [folderName, setFolderName] = useState('');

  const [files, setFiles] = useState([]);

  const [orgUsersList, setOrgUsersList] = useState([]); // Added this line

  const newFolder = useBoolean();

  const upload = useBoolean();

  const [userRole, setUserRole] = useState(''); // New state variable for user role

  // First useEffect to set the userRole from session storage
  useEffect(() => {
    const storedRole = sessionStorage.getItem('userRole');
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  // Second useEffect to fetch data if userRole is 'Admin'
  useEffect(() => {
    if (userRole === 'Admin') {
      const fetchData = async () => {
        try {
          const token = sessionStorage.getItem('accessToken');
          if (!token) {
            console.error("No token found in session storage.");
            return;
          }
          
          const config = {
            headers: { 'x-auth-token': token }
          };
          
          const response = await axios.get('https://threatvisor-api.vercel.app/api/auth/fetchOrgAndUserData', config);
          
          console.log(response); // This line logs the response to the console.
          
          setOrgUsersList(response.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }
  }, [userRole]);
  
  

  const handleChangeFolderName = useCallback((event) => {
    setFolderName(event.target.value);
  }, []);

  const handleCreateNewFolder = useCallback(() => {
    newFolder.onFalse();
    setFolderName('');
    console.info('CREATE NEW FOLDER');
  }, [newFolder]);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setFiles([...files, ...newFiles]);
    },
    [files]
  );

  const renderStorageOverview = (
    <FileStorageOverview
      total={GB}
      chart={{
        series: 76,
      }}
      data={[
        {
          name: 'Images',
          usedStorage: GB / 2,
          filesCount: 223,
          icon: <Box component="img" src="/assets/icons/files/ic_img.svg" />,
        },
        {
          name: 'Media',
          usedStorage: GB / 5,
          filesCount: 223,
          icon: <Box component="img" src="/assets/icons/files/ic_video.svg" />,
        },
        {
          name: 'Documents',
          usedStorage: GB / 5,
          filesCount: 223,
          icon: <Box component="img" src="/assets/icons/files/ic_document.svg" />,
        },
        {
          name: 'Other',
          usedStorage: GB / 10,
          filesCount: 223,
          icon: <Box component="img" src="/assets/icons/files/ic_file.svg" />,
        },
      ]}
    />
  );

  return (
    <>
      
        {userRole === 'Admin' ? (
        <>
          <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6} lg={8}>
                <BankingRecentTransitions
                  title="Organization Users"
                  tableData={orgUsersList}
                  tableLabels={[
                    { id: 'description', label: 'User' },
                    { id: 'date', label: 'Role' },
                    { id: '' },
                    { id: '' },
                    { id: '' },
                  ]}
                />
              </Grid>
              <Grid xs={12} md={6} lg={4}>
                
                
              </Grid>
            </Grid>
          </Container>
          
        </>
      ) : (
        <RoleBasedGuard hasContent roles={['user']} sx={{ py: 10 }}>
          <Container maxWidth="lg">
            <Typography variant="h4" sx={{ mb: 5 }}>
              Permission Denied
            </Typography>
            <Typography variant="body2">
              You do not have permission to view this content.
            </Typography>
          </Container>
        </RoleBasedGuard>
      )}
    </>
  );
  
}
