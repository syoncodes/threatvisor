'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import {
  Container, Grid, Box, Stack, List, ListItem, ListItemText,
  Button, Paper, Typography
} from '@mui/material';
import { useAuthContext } from 'src/auth/hooks';
import Iconify from 'src/components/iconify';
import Editor from 'src/components/editor';
import { useResponsive } from 'src/hooks/use-responsive';
import { alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import MailList from '../mail-list'; // Replace './MailList' with the actual path to your MailList component file.
import Checkbox from '@mui/material/Checkbox';
import useLocalStorage from '../localstorage';
import Walktour, { useWalktour } from 'src/components/walktour';

function MailCompose({ onCloseCompose, emailData }) {
  const [message, setMessage] = useState('');
  const [description, setDescription] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [phishingServices, setPhishingServices] = useState([]);
  const [selectedEmailIndex, setSelectedEmailIndex] = useState(null);
  const [recipientEmails, setRecipientEmails] = useState([]);
  const [clickCount, setClickCount] = useState(0);
  const [sendCount, setSendCount] = useState(0);
  const [checkboxDisabled, setCheckboxDisabled] = useState(false); // State to disable the checkbox
  const { user } = useAuthContext();
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    setCurrentPath(window.location.pathname);
    localStorage.setItem('currentPath', window.location.pathname);
    console.log(window.location.pathname);
  }, []);

  useEffect(() => {
    if (emailData) {
      // Assuming the backend sends these fields
      setMessage(emailData.items[0].emailBody || '');
      setDescription(emailData.items[0].description || '');
      setSenderEmail(emailData.items[0].senderEmail || '');
      setRecipientEmails(emailData.items[0].recipientEmails || []);
    }
  }, [emailData]);

  const handleChangeDescription = (event) => {
    setDescription(event.target.value);
  };

  const handleChangeMessage = (value) => {
    setMessage(value);
  };
  const handleDeleteEndpoint = async () => {
    try {
      if (!emailData || !emailData.items || emailData.items.length === 0) {
        console.error('Invalid email data for deletion.');
        return;
      }
  
      const title = emailData.items[0].title;
  
      const response = await axios.delete('http://localhost:8080/api/endpoints/delete-endpoint/user', {
        data: {
          userId: user.email,
          title: title,
        }
      });
  
      if (response.status === 200 && response.data.success) {
        console.log('Endpoint deleted successfully.');
        onCloseCompose(); // Call onCloseCompose to close the editor and refresh the list in the parent component
      }
    } catch (error) {
      console.error('Error deleting endpoint:', error);
    }
  };
  
  
  const handleRegenerate = async () => {
    if (!emailData || !user) return;

    try {
      const { title, description } = emailData.items[0];
      
      console.log("Sending regeneration request with:", {
        userId: user.email,
        newTitle: `${emailData.items[0].title}`,
        newDescription: description
      });
  
      const response = await axios.post('http://localhost:8080/api/endpoints/regenerate-email', {
        userId: user.email,
        newTitle: `${emailData.items[0].title}`,
        newDescription: description
      });

      if (response.status === 200 && response.data.success) {
        // Assuming the updated description is sent back in the response
        const updatedDescription = response.data.updatedDescription;
        // Update the state or handle the response as needed
        // For example: setMessage(`New description: ${updatedDescription}`);
      }
    } catch (error) {
      console.error('Error regenerating email:', error);
    }
  };

  const handleSendEmail = async () => {
    try {
      // Ensure this is the correct ID for the endpoint
      const endpointId = emailData._id;
      // Ensure this is the correct title for the email item
      const title = emailData.items[0].title;

      const response = await axios.post('http://localhost:8080/api/endpoints/mark-as-sent', {
        userId: user.email,
        endpointId,
        title, // include the title in the request
      });

      if (response.status === 200 && response.data.success) {
        console.log('Email marked as sent.');
        setIsSent(true); // Set the checkbox state to clicked
        setCheckboxDisabled(true); // Disable the checkbox
        // Additional logic for after marking the email as sent
      }
    } catch (error) {
      console.error('Error on sending email:', error);
    }
  };

  // Function to fetch click data
  const fetchClickData = async () => {
    try {
      const requestData = {
        userId: user.email,
        endpointId: emailData._id
      };
      console.log("Sending request to /fetch-clicks with data:", requestData);
  
      const response = await axios.post('http://localhost:8080/api/endpoints/fetch-clicks', requestData);
  
      console.log("Response from /fetch-clicks:", response.data);
  
      if (response.status === 200) {
        setClickCount(response.data.clickCount);
        setSendCount(response.data.sendCount);
      }
    } catch (error) {
      console.error('Error fetching click data:', error);
    }
  };
  

  useEffect(() => {
    const checkSendStatusAndFetchClicks = async () => {
      try {
        const sendStatusResponse = await axios.post('http://localhost:8080/api/endpoints/get-send-status', {
          userId: user.email,
          endpointId: emailData._id,
          title: emailData.items[0].title
        });
  
        if (sendStatusResponse.status === 200 && sendStatusResponse.data.success) {
          const isEmailSent = sendStatusResponse.data.isSent;
          setIsSent(isEmailSent);
          setCheckboxDisabled(isEmailSent);
  
          // If email is marked as sent, fetch click data
          if (isEmailSent) {
            const clickDataResponse = await axios.post('http://localhost:8080/api/endpoints/fetch-clicks', {
              userId: user.email,
              endpointId: emailData._id
            });
  
            if (clickDataResponse.status === 200) {
              setClickCount(clickDataResponse.data.clickCount);
              setSendCount(clickDataResponse.data.sendCount);
              setIsClickDataFetched(true); // Indicate that click data has been fetched
            }
          }
        }
      } catch (error) {
        console.error('Error in fetching send status or click data:', error);
      }
    };
  
    if (emailData) {
      checkSendStatusAndFetchClicks();
    }
  }, [emailData, user.email]); // Dependency array
  
  
  const handleSaveChanges = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/endpoints/save-email', {
        userId: user.email,
        title: emailData.items[0].title,
        senderEmail,
        recipientEmails, // Include recipient emails in the request
        newDescription: description,
        newEmailBody: message
      });

      if (response.status === 200 && response.data.success) {
        console.log('Email and description updated successfully');
      }
    } catch (error) {
      console.error('Error saving email changes:', error);
    }
  };
  useEffect(() => {
    const checkSendStatus = async () => {
      try {
        const response = await axios.post('http://localhost:8080/api/endpoints/get-send-status', {
          userId: user.email,
          endpointId: emailData._id,
          title: emailData.items[0].title
        });
  
        if (response.status === 200 && response.data.success) {
          setIsSent(response.data.isSent);
          setCheckboxDisabled(response.data.isSent);
        }
      } catch (error) {
        console.error('Error checking send status:', error);
      }
    };
  
    if (emailData) {
      checkSendStatus();
    }
  }, [emailData, user.email]);
  
  const [isSent, setIsSent] = useState(false); // State to track if email is sent
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      
      <Container
        sx={{
          bgcolor: 'background.default',
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: (theme) => theme.customShadows.dropdown,
          p: 2,
        }}
      >
        
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            bgcolor: 'background.neutral',
            borderRadius: 2,
            p: (theme) => theme.spacing(1.5, 1, 1.5, 2),
          }}
        >
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Email Editor
          </Typography>
    
          <IconButton onClick={onCloseCompose}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Stack>
    
        <InputBase
          placeholder="To"
          value={recipientEmails} // Display recipient emails as a comma-separated list
          onChange={(e) => setRecipientEmails(e.target.value)}
          sx={{
            px: 2,
            height: 48,
            borderBottom: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        />
        <InputBase
          placeholder="From (Sender Email)"
          value={senderEmail}
          onChange={(e) => setSenderEmail(e.target.value)}
          sx={{
            px: 2,
            py: 1,
            borderBottom: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        />
        <InputBase
          value={`Title: ${emailData ? emailData.items[0].title : ''}`}
          readOnly
          sx={{
            px: 2,
            py: 1,
            borderBottom: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        />
        <InputBase
          value={description}
          onChange={handleChangeDescription}
          multiline
          sx={{
            px: 2,
            py: 1,
            borderBottom: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        />
        <Editor
          simple
          id="compose-mail"
          value={message}
          onChange={handleChangeMessage}
          placeholder="Type a message"
          sx={{
            '& .ql-editor': {},
          }}
        />
    
        <Stack direction="row" alignItems="center" pt={2}>
          <Stack direction="row" alignItems="center" flexGrow={1}>
            
          </Stack>
          <Button
            variant="outlined"
            onClick={handleDeleteEndpoint}
            sx={{ ml: 1 }}
            endIcon={<Iconify icon="ic:outline-delete" />}
          >
            Delete
          </Button>
          <Button
          variant="outlined"
          onClick={handleSaveChanges}
          sx={{ ml: 1 }}
          endIcon={<Iconify icon="ic:outline-save" />}
          disabled={isSent} // Disable the button when the email is sent
        >
          Save
        </Button>
        <Button
          variant="outlined"
          onClick={handleRegenerate}
          sx={{ ml: 1 }}
          endIcon={<Iconify icon="ic:outline-refresh" />}
          disabled={isSent} // Disable the button when the email is sent
        >
          Regenerate
        </Button>

          <Button
          variant="contained"
          color="primary"
          onClick={handleSendEmail}
          sx={{ ml: 1 }}
          disabled={isSent} // Disable the button when the email is sent
        >
          Mark as sent
        </Button>
        <Checkbox
          size="medium"
          icon={<Iconify icon="iconamoon:send-duotone" />}
          checkedIcon={<Iconify icon="iconamoon:send-fill" />}
          checked={isSent} // Use the state variable to control the checkbox state
          disabled={checkboxDisabled} // Disable the checkbox based on the state variable
        />
        </Stack>
      </Container>
      {emailData && emailData.items[0].send && (
        <Container
          sx={{
            bgcolor: 'background.default',
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: (theme) => theme.customShadows.dropdown,
            p: 2,
            mt: 2, // Add some margin at the top for spacing
          }}
        >
          <Typography variant="h6">
  Click Results
</Typography>
<Paper sx={{ p: 1, mb: 1, bgcolor: 'background.dark' }}>
  <Typography variant="subtitle1">
    Click Count: {clickCount || 0}
  </Typography>
</Paper>
<Paper sx={{ p: 1, bgcolor: 'background.dark' }}>
  <Typography variant="subtitle1">
    Send Count: {sendCount || 0}
  </Typography>
</Paper>

        </Container>
      )}
    </Box>
  );
  
  
}

export default function OverviewFileView() {
  const [phishingServices, setPhishingServices] = useState([]);
  const [selectedEmailIndex, setSelectedEmailIndex] = useState(null);
  const { user } = useAuthContext();
  const theme = useTheme();
  const [walktourVisible, setWalktourVisible] = useLocalStorage('walktourVisible', false);
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.detail.key === 'walktourVisible') {
        const newValue = JSON.parse(localStorage.getItem('walktourVisible'));
        setWalktourVisible(newValue);
        console.log('Updated walktourVisible from local-storage event:', newValue);
      }
    };
  
    window.addEventListener('local-storage', handleStorageChange);
  
    return () => {
      window.removeEventListener('local-storage', handleStorageChange);
    };
  }, []);
  
  const walktour = useWalktour({
    defaultRun: true,
    showProgress: true,
    steps: [
      {
        target: '#demo__1',
        title: 'Step 1',
        disableBeacon: true,
        content: (
          <Typography sx={{ color: 'text.secondary' }}>
            Here is where you can select and see which phishing tests you have created from the endpoints table and select/edit them before marking them as sent.
          </Typography>
        ),
      },
      {
        target: '#demo__1',
        title: 'How to set up emails',
        placement: 'right',
        showProgress: false,
        styles: {
          options: {
            arrowColor: theme.palette.grey[900],
          },
          tooltip: {
            width: 480,
            backgroundColor: theme.palette.grey[900],
          },
          tooltipTitle: {
            color: theme.palette.common.white,
          },
          buttonBack: {
            color: theme.palette.common.white,
          },
          buttonNext: {
            marginLeft: theme.spacing(1.25),
            color: theme.palette.primary.contrastText,
            backgroundColor: theme.palette.primary.main,
          },
        },
        content: (
          <Stack spacing={3}>
            <Typography sx={{ color: 'text.disabled' }}>
              Before marking an email as sent, make sure you have all the recipient emails in the appropriate field along with the link selected as a link. Additionally, ensure that you save your changes before marking the email as sent and do not make any changes after you mark it as sent as the link will be active. Please make sure to also physically send the email from your side with an appropriate email address (similar to your organization email but with minor differences such as instead of the real email support@threatvisor.org send with: supp0rt@threatvisor.Org). Automated Phishing email sending coming soon!
            </Typography>
          </Stack>
        ),
      },
    ],
  });

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'walktourVisible') {
        console.log('walktourVisible changed:', event.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Clean up listener
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  useEffect(() => {
    const fetchPhishingData = async () => {
      try {
        const email = user.email;
        console.log("User email:", email); // Added console log
        const response = await axios.post('http://localhost:8080/api/endpoints/fetch-phishing', {
          userId: email,
        });
  
        if (response.status === 200) {
          let { endpoints } = response.data;
          console.log("Received endpoints:", endpoints); // Added console log
  
          if (Array.isArray(endpoints)) {
            // Filter out the endpoints where none of the items have service "Phishing"
            endpoints = endpoints.filter(endpoint => 
              endpoint.items.some(item => item.service == "Phishing")
            );
            console.log("Filtered endpoints:", endpoints); // Added console log
            setPhishingServices(endpoints);
          } else {
            console.error('Endpoints data is not an array:', endpoints);
          }
        } else {
          console.error('Error fetching phishing services. Status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching phishing services:', error);
      }
    };
  
    fetchPhishingData();
  }, [user.email]);
  
  const handleEmailItemClick = (mailId) => {
    const index = phishingServices.findIndex(service => service._id === mailId);
    setSelectedEmailIndex(index);
  };
  
  console.log("selectedEmailIndex:", selectedEmailIndex);
console.log("phishingServices:", phishingServices);
  
return (
  <Container maxWidth="xl">
    {walktourVisible && walktour?.steps && (
  <Walktour
    continuous
    showProgress
    showSkipButton
    disableOverlayClose
    steps={walktour.steps}
    run={walktour.run}
    callback={walktour.onCallback}
    getHelpers={walktour.setHelpers}
    scrollDuration={500}
  />
)}
    <Typography variant="h4" sx={{ mb: 3 }}>
      Overview of Phishing Tests
    </Typography>

    <Stack
      spacing={2}
      sx={{
        p: 1,
        borderRadius: 2,
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'background.neutral',
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={3} id="demo__1">
          <MailList
            loading={phishingServices.length === 0}
            mails={{
              allIds: phishingServices.map((service) => service._id),
              byId: phishingServices.reduce((acc, service) => {
                acc[service._id] = service.items[0];
                return acc;
              }, {}),
            }}
            selectedMailId={
              selectedEmailIndex !== null && selectedEmailIndex >= 0 && selectedEmailIndex < phishingServices.length
                ? phishingServices[selectedEmailIndex]._id
                : ''
            }
            onClickMail={handleEmailItemClick}
          />
        </Grid>
        <Grid item xs={9}>
          {selectedEmailIndex !== null && (
            <Box p={1}>
              <MailCompose
                onCloseCompose={() => setSelectedEmailIndex(null)}
                emailData={phishingServices[selectedEmailIndex]}
              />
            </Box>
          )}
        </Grid>
      </Grid>
    </Stack>
  </Container>
);
}