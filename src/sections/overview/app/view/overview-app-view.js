'use client';

// @mui
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import React, { useEffect, useRef, useState } from 'react';
import { CustomEvent } from 'react';
import Box from '@mui/material/Box';
import Walktour, { useWalktour } from 'src/components/walktour';
import { m } from 'framer-motion';
import { varHover } from 'src/components/animate';
// @mui
import Badge, { badgeClasses } from '@mui/material/Badge';
// hooks 
import { useAuthContext } from 'src/auth/hooks';
// _mock
import { _appFeatured, _appAuthors, _appInstalled, _appRelated, _appInvoices } from 'src/_mock';
import {
  _analyticTasks,
  _analyticPosts,
  _analyticTraffic,
  _analyticOrderTimeline,
} from 'src/_mock';
import {
  _mock,
  _ecommerceNewProducts,
  _ecommerceBestSalesman,
  _ecommerceSalesOverview,
  _ecommerceLatestProducts,
} from 'src/_mock';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
// components
import { useSettingsContext } from 'src/components/settings';
// assets
import { SeoIllustration } from 'src/assets/illustrations';
//
import Typography from '@mui/material/Typography';
import AnalyticsCurrentSubject from '../analytics-current-subject';
import AnalyticsNews from '../analytics-news';
import AppWidget from '../app-widget';
import AppWelcome from '../app-welcome';
import AppFeatured from '../app-featured';
import AppNewInvoice22 from '../app-new-invoice-copy2';
import AppNewInvoice2 from '../app-new-invoice-copy';
import AppNewInvoice3 from '../app-new-invoice-copy3';
import AppTopAuthors from '../app-top-authors';
import AppTopRelated from '../app-top-related';
import AppAreaInstalled from '../app-area-installed';
import AppWidgetSummary from '../app-widget-summary';
import AppCurrentDownload from '../app-current-download';
import AppTopInstalledCountries from '../app-top-installed-countries';
import BookingAvailable from '../booking-available';
import axios from 'axios';
import Paper from '@mui/material/Paper';
const API_BASE_URL = 'http://localhost:8080/api';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import { useRouter } from 'src/routes/hooks'; // Import useRouter
import Iconify from 'src/components/iconify';
import InputAdornment from '@mui/material/InputAdornment';
import Switch from '@mui/material/Switch';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import useLocalStorage from '../localstorage';

// ----------------------------------------------------------------------

export default function OverviewAppView() {
  const { user } = useAuthContext();
  const theme = useTheme();
  const [walktourVisible, setWalktourVisible] = useLocalStorage('walktourVisible', false);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.detail.key === 'walktourVisible') {
        const newValue = JSON.parse(localStorage.getItem('walktourVisible'));
        setWalktourVisible(newValue);
      }
    };

    window.addEventListener('local-storage', handleStorageChange);

    return () => {
      window.removeEventListener('local-storage', handleStorageChange);
    };
  }, []);

  // Function to handle changes in localStorage
  const handleLocalStorageChange = (event) => {
    if (event.key === 'walktourVisible') {
      setWalktourVisible(JSON.parse(event.newValue));
    }
  };
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
            Welcome to your home page, here you can check on you latest vulnerability report and download it as a pdf.
          </Typography>
        ),
      },
      {
        target: '#demo__2',
        title: 'Step 2',
        content: (
          <Stack spacing={3}>
            <Typography sx={{ color: 'text.secondary' }}>
              Preview the latest news in cybersecurity to stay informed about the latest threats and activities.
            </Typography>
          </Stack>
        ),
      },
      {
        target: '#demo__3',
        title: 'Step 3',
        placement: 'bottom',
        content: (
          <Stack spacing={3}>
            <Typography sx={{ color: 'text.secondary' }}>Track your endpoints and network status at a glance</Typography>
          </Stack>
        ),
      },
      {
        target: '#demo__4',
        title: 'Step 4',
        placement: 'left',
        content: (
          <Stack spacing={3}>
            <Typography sx={{ color: 'text.secondary' }}>
              Visualize your vulnerabilities over time to keep track of cybersecurity improvements and issues.
            </Typography>
          </Stack>
        ),
      },
      {
        target: '#demo__5',
        title: 'Step 5',
        placement: 'left',
        content: (
          <Stack spacing={3}>
            <Typography sx={{ color: 'text.secondary' }}>
            Discern which exact vulnerabilities exist in your ecosystem and their vulnerbility ID's
            </Typography>
          </Stack>
        ),
      },
      {
        target: '#demo__6',
        title: 'Step 6',
        placement: 'left',
        content: (
          <Stack spacing={3}>
            <Typography sx={{ color: 'text.secondary' }}>
              Keep track of the phishing threat results running in your network
            </Typography>
          </Stack>
        ),
      },
      {
        target: '#demo__7',
        title: 'Step 7',
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
              Recognize which exploits could potentially harm your ecosystem
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

  console.log("User object:", user);
  const [featuredData, setFeaturedData] = useState([]);
  const NoDataPlaceholder = () => (
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="10">
        No Data Available
      </text>
    </svg>
  );
  
  const router = useRouter(); // Use the useRouter hook
  

  
  const settings = useSettingsContext();

  const vulnerabilityDetailsRef = useRef(null);
  const vulnerabilityInfoRef = useRef(null);

  useEffect(() => {
    const fetchFeaturedData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/featured`);
        setFeaturedData(response.data);
      } catch (error) {
        console.error('Error fetching featured data:', error);
      }
    };
  
    fetchFeaturedData();
  }, []);

  // Function to adjust heights
  const adjustHeights = () => {
    if (vulnerabilityDetailsRef.current && vulnerabilityInfoRef.current) {
      const detailsHeight = vulnerabilityDetailsRef.current.clientHeight;
      const infoHeight = vulnerabilityInfoRef.current.clientHeight;

      if (detailsHeight > infoHeight) {
        vulnerabilityInfoRef.current.style.height = `${detailsHeight}px`;
      } else {
        vulnerabilityDetailsRef.current.style.height = `${infoHeight}px`;
      }
    }
  };

  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [vulnerabilitiesData, setVulnerabilitiesData] = useState(null);

  const [loading, setLoading] = useState(true);

  // Client-side: React with useState and useEffect

const [vulnerabilityLogData, setVulnerabilityLogData] = useState([]);
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


  useEffect(() => {
    const fetchVulnerabilities = async () => {
      if (!user?.email) {
        console.log('User email is not available');
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const response = await axios.post(`${API_BASE_URL}/endpoints/getVulnerabilities`, {
          email: user.email,
        });
        console.log('Server Response:', response.data);
        const transformedData = transformData(response.data);
        console.log('Transformed Data:', transformedData);
        setVulnerabilitiesData(transformedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching vulnerabilities data', error);
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchVulnerabilities();
    }
  }, [user?.email]);
useEffect(() => {
  const fetchVulnerabilityLog = async () => {
    if (!user?.email) {
      console.log('User email is not available');
      setLoading(false); // Set loading to false if user email is not available
      return;
    }

    setLoading(true); // Set loading to true when the data fetching begins

    try {
      const response = await axios.post('http://localhost:8080/api/endpoints/getVulnerabilityLog', {
        userEmail: user.email,
      });

      // Log the response data as "vuln logs"
      const logData = response.data.vulnerabilityLog;

    // Initialize arrays for each severity level
    const highData = new Array(12).fill(0);
    const mediumData = new Array(12).fill(0);
    const lowData = new Array(12).fill(0);
    const informationalData = new Array(12).fill(0);

    // Aggregate data for each month
    logData.forEach(entry => {
      const entryDate = new Date(entry.date);
      const monthIndex = entryDate.getMonth(); // 0 for Jan, 1 for Feb, etc.
      highData[monthIndex] += entry.High;
      mediumData[monthIndex] += entry.Medium;
      lowData[monthIndex] += entry.Low;
      informationalData[monthIndex] += entry.Informational;
    });
    const formattedData = {
      categories: MONTHS,
      series: [
        {
          year: '2023', // Adjust as needed
          data: [
            { name: 'High', data: highData },
            { name: 'Medium', data: mediumData },
            { name: 'Low', data: lowData },
            { name: 'Informational', data: informationalData },
            // ... add other series if necessary
          ],
        },
        // ... add other years if necessary
      ],
    };
      

setVulnerabilityLogData(formattedData);


      setVulnerabilityLogData(formattedData);
    } catch (error) {
      console.error('Error fetching vulnerability log:', error);
    } finally {
      setLoading(false); // Set loading to false once the data is fetched or if there is an error
    }
  };

  fetchVulnerabilityLog();
}, [user?.email]); // Make sure this dependency is correct, it should be user?.email, not user?. Email


// In your component's render method or function component body
// Use the vulnerabilityLogData state variable to pass the data to your chart component


  const [vulnerabilityDetails, setVulnerabilityDetails] = useState([]);

  useEffect(() => {
    const fetchVulnerabilityDetails = async () => {
      if (!user?.email) {
        console.log('User email is not available');
        return;
      }
  
      try {
        setLoading(true);
        const response = await axios.post('http://localhost:8080/api/endpoints/getVulnerabilityDetails', {
          userEmail: user.email,
        });
  
        // Log the entire response from the server
        console.log('Full server response for getVulnerabilityDetails:', response);
  
        // Log just the data from the server response
        console.log('Server Response data:', response.data);
  
        const vulnerabilities = response.data.vulnerabilities || {};
  
        // Process each vulnerability level (High, Medium, Low, Informational)
        const vulnerabilitiesArray = Object.entries(vulnerabilities).reduce((acc, [severity, issues]) => {
          Object.entries(issues).forEach(([issueName, { locations, dates }]) => {
            // Use spread operator to handle multiple locations and dates
            acc.push(...locations.map((location, index) => ({
              id: `${issueName}-${location}-${dates[index]}`,
              title: issueName,
              location: location,
              severity: severity,
              date: dates[index] || new Date().toISOString().split('T')[0], // Use the date from the server if available
            })));
          });
          return acc;
        }, []);
  
        console.log('Vulnerability Details:', vulnerabilitiesArray);
        setVulnerabilityDetails(vulnerabilitiesArray);
      } catch (error) {
        console.error('Error fetching vulnerability details:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchVulnerabilityDetails();
  }, [user?.email]);
  
  const [totalClicks, setTotalClicks] = useState(null);
  const [totalRecipients, setTotalRecipients] = useState(null);


  useEffect(() => {
    const fetchPhishingData = async () => {
      try {
        const response = await axios.post(`${API_BASE_URL}/endpoints/fetch-clicks-total`, {
          userId: user.email
        });

        if (response.status === 200) {
          const data = response.data;
          setTotalClicks(data.totalClicks || 0);
          setTotalRecipients(data.totalRecipients || 0);
        } else {
          console.error('Error fetching phishing data. Status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching phishing data:', error);
      }
    };

    if (user?.email) {
      fetchPhishingData();
    }
  }, [user?.email]);
  
  const [vulnerabilityInfo, setVulnerabilityInfo] = useState([]);
  
  useEffect(() => {
    const fetchVulnerabilityIDs = async () => {
      if (!user?.email) {
        console.log('User email is not available');
        return;
      }
    
      try {
        setLoading(true);
        const response = await axios.post('http://localhost:8080/api/endpoints/getIDs', {
          userEmail: user.email,
        });
        console.log('Server Response:', response.data);
    
        // Filter out vulnerabilities with ID of -1 and sort CVEs to appear first
        const filteredAndSortedVulnerabilities = response.data.vulnerabilities
          .filter(vulnerability => vulnerability.id !== 'CWE--1' && vulnerability.id !== 'WASC--1')
          .sort((a, b) => {
            const isACve = a.id.startsWith('CVE-');
            const isBCve = b.id.startsWith('CVE-');
            if (isACve && !isBCve) {
              return -1;
            } else if (!isACve && isBCve) {
              return 1;
            }
            return a.id.localeCompare(b.id);
          });
          
  
          const transformedData = filteredAndSortedVulnerabilities.map(vulnerability => {
            // Remove duplicate 'CVE-' prefix if it exists
            const title = vulnerability.id.replace(/^(CVE-)+/, 'CVE-');
          
            return {
              id: vulnerability.id,
              title: title, // Use the title with the 'CVE-' prefix corrected
              severity: vulnerability.severity,
            };
          });
          
          console.log('Transformed Vulnerability IDs:', transformedData);
          setVulnerabilityInfo(transformedData);
          setLoading(false);
          
          
    
        console.log('Transformed Vulnerability IDs:', transformedData);
        setVulnerabilityInfo(transformedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching vulnerability IDs:', error);
        setLoading(false);
      }
    };
    
    fetchVulnerabilityIDs();
  }, [user?.email]);
  
  const [exploitDetails, setExploitDetails] = useState([]);
  const MAX_EXPLOIT_ROWS = 5;

  useEffect(() => {
    const fetchExploitDetails = async () => {
      if (!user?.email) {
        console.log('User email is not available');
        return;
      }
  
      try {
        setLoading(true);
        const response = await axios.post(`${API_BASE_URL}/endpoints/getExploitDetails`, {
          userEmail: user.email,
        });
  
        console.log('Server Response for getExploitDetails:', response.data);
  
        const exploitData = response.data.exploits || {};
        const exploitArray = Object.entries(exploitData).flatMap(([cveId, exploitDetails]) => {
          return exploitDetails.map(detail => ({
            id: cveId,
            title: cveId,
            location: detail.location,
            content: detail.content,
            date: detail.date,
          }));
        });
  
        // Check if there are more than MAX_EXPLOIT_ROWS rows
        if (exploitArray.length > MAX_EXPLOIT_ROWS) {
          exploitArray.splice(MAX_EXPLOIT_ROWS); // Remove extra rows
        }
  
        // Fill the remaining rows with blank data
        while (exploitArray.length < MAX_EXPLOIT_ROWS) {
          exploitArray.push({
            id: '',
            title: '',
            location: '',
            content: '',
            date: '',
          });
        }
  
        console.log('Exploit Details:', exploitArray);
        setExploitDetails(exploitArray);
      } catch (error) {
        console.error('Error fetching exploit details:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchExploitDetails();
  }, [user?.email]);
  
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.post('http://localhost:8080/api/endpoints/getVulnerabilities', {
          email: user?.email,
        });
        console.log('Server Response:', response.data);
        const transformedData = transformData(response.data);
        console.log('Transformed Data:', transformedData);
        setVulnerabilitiesData(transformedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching vulnerabilities data', error);
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchData();
    }
  }, [user?.email]);
  const transformData = (data) => {
    return [
      { label: 'High', value: data.High || 0 },
      { label: 'Low', value: data.Low || 0 },
      { label: 'Informational', value: data.Informational || 0 },
      { label: 'Medium', value: data.Medium || 0 },
    ];
  };

  const [widgetSummaryData, setWidgetSummaryData] = useState({
    totalOpenPorts: null,
    totalFilteredPorts: null,
    totalEndpoints: null,
    weeklyLog: [],
    percentChanges: {}
});



  useEffect(() => {
    const fetchAppWidgetSummary = async () => {
      try {
        const endpoint = 'http://localhost:8080/api/endpoints/getPorts';
        const requestBody = {
          email: user?.email,
        };
  
        console.log('Sending request to:', endpoint);
        console.log('Request body:', requestBody);
  
        const response = await axios.post(endpoint, requestBody);
        console.log('Server Response:', response.data);

        const latestLog = response.data.weeklyLog[response.data.weeklyLog.length - 1];

        setWidgetSummaryData({
            totalOpenPorts: response.data.ports.open || 0,
            totalFilteredPorts: response.data.ports.filtered || 0,
            totalEndpoints: response.data.ports.total_endpoints || 0,
            weeklyLog: response.data.weeklyLog,
            percentChanges: {
                total: latestLog.percentage_change.total !== "N/A" ? parseFloat(latestLog.percentage_change.total) : null,
                filtered: latestLog.percentage_change.filtered !== "N/A" ? parseFloat(latestLog.percentage_change.filtered) : null,
                total_endpoints: latestLog.percentage_change.total_endpoints !== "N/A" ? parseFloat(latestLog.percentage_change.total_endpoints) : null
            }
        });


        
      } catch (error) {
        console.error('Error fetching app widget summary data:', error);
      }
    };
  
    if (user?.email) {
      fetchAppWidgetSummary();
    }
  }, [user?.email]);
  
  const MIN_ROWS = 6;

  const [adjustedVulnerabilityDetails, setAdjustedVulnerabilityDetails] = useState([]);
  const [adjustedVulnerabilityInfo, setAdjustedVulnerabilityInfo] = useState([]);

  useEffect(() => {
    if(!loading){
    const adjustRows = (data) => {
      if (data.length > MIN_ROWS) {
        return data.slice(0, MIN_ROWS);
      }
      return [...data, ...Array(MIN_ROWS - data.length).fill({})];
    };
  
    const adjustedVulnerabilityDetails = adjustRows(vulnerabilityDetails);
    const adjustedVulnerabilityInfo = adjustRows(vulnerabilityInfo);
  
    setAdjustedVulnerabilityDetails(adjustedVulnerabilityDetails);
    setAdjustedVulnerabilityInfo(adjustedVulnerabilityInfo);
  }
  }, [vulnerabilityDetails, vulnerabilityInfo, loading]);
  const [adjustedExploitDetails, setAdjustedExploitDetails] = useState([]);

useEffect(() => {
  if (!loading) {
    const adjustRows = (data) => {
      if (data.length === 0) {
        return []; // Return an empty array if there's no data
      }
      if (data.length > MIN_ROWS) {
        return data.slice(0, MIN_ROWS);
      }
      return [...data, ...Array(MIN_ROWS - data.length).fill({})];
    };
    

    const adjustedDetails = adjustRows(exploitDetails);
    setAdjustedExploitDetails(adjustedDetails);
  }
}, [exploitDetails, loading]);

  const handleViewClick = () => {
    router.push('/dashboard/report/') // Replace '/your-desired-path' with the actual path you want to navigate to
  };

  useEffect(() => {
    adjustHeights();
    // Add window resize listener
    window.addEventListener('resize', adjustHeights);
    // Remove resize listener on cleanup
    return () => window.removeEventListener('resize', adjustHeights);
  }, [vulnerabilities, vulnerabilityInfo]); 
  
  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator or a spinner
  }

  return (
    <>

    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
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

      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <AppWelcome
            id="demo__1"
            title={`Welcome back 👋 \n ${user?.firstName}`}
            description="Check out your latest vulnerability report."
            img={<SeoIllustration />}
            action={
              <Button onClick={handleViewClick} variant="contained" color="primary">
                View Now
              </Button>

            }
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppFeatured list={featuredData} id="demo__2" />
        </Grid>

        
        <Grid container direction="row" id="demo__3" style={{width: '100%'}}>
    <Grid item xs={12} md={4}>
        <AppWidgetSummary
            title="Total Open Ports"
            percent={widgetSummaryData.percentChanges.total}
            total={widgetSummaryData.totalOpenPorts}
            chart={{
                series: widgetSummaryData.weeklyLog.map(log => log.data.open),
                colors: ['blue', 'lightblue'] // Specify colors for open ports
            }}
        />
    </Grid>

    <Grid item xs={12} md={4}>
        <AppWidgetSummary
            title="Total Filtered Ports"
            percent={widgetSummaryData.percentChanges.filtered}
            total={widgetSummaryData.totalFilteredPorts}
            chart={{
                series: widgetSummaryData.weeklyLog.map(log => log.data.filtered),
                colors: ['red', 'pink'] // Specify colors for filtered ports
            }}
        />
    </Grid>

    <Grid item xs={12} md={4}>
        <AppWidgetSummary
            title="Total Endpoints"
            percent={widgetSummaryData.percentChanges.total_endpoints}
            total={widgetSummaryData.totalEndpoints}
            chart={{
                series: widgetSummaryData.weeklyLog.map(log => log.data.total_endpoints),
                colors: ['green', 'lightgreen'] // Specify colors for total endpoints
            }}
        />
    </Grid>
</Grid>




        <Grid xs={12} md={6} lg={4}>
        {!loading && vulnerabilitiesData ? (
  <AppCurrentDownload
    title="Total Vulnerabilities"
    chart={{
      series: vulnerabilitiesData,
    }}
  />
) : (
  <div>Loading...</div>
)}

    </Grid>
    
    <Grid xs={12} md={6} lg={8}>
  {loading || !vulnerabilityLogData.series || vulnerabilityLogData.series.length === 0 ? (
    <div>Loading Chart Data...</div>
  ) : (
    <AppAreaInstalled
    id="demo__4"
      title="Vulnerability Timeline"
      subheader="‎"
      data={vulnerabilityLogData}
    />
  )}
</Grid>
<Grid container direction="row" id="demo__5" style={{width: '100%'}}>
        <Grid xs={12} lg={8.7} >
        {adjustedVulnerabilityDetails.length === 0 ? (
    <NoDataPlaceholder />
  ) : (
        <AppNewInvoice22
          title="Vulnerability Details"
          
          tableData={adjustedVulnerabilityDetails}
          tableLabels={[
            { id: 'title', label: 'Vulnerability' },
            { id: 'location', label: 'Location' }, // Changed from 'endpoint' to 'location'
            { id: 'severity', label: 'Severity' },
            { id: 'date', label: 'Date' },
            { id: '', label: '' },
          ]}
        />
        )}
        </Grid>

        <Grid xs={12} md={6} lg={3.3}>
          <AppNewInvoice2
            title="Vulnerability IDs"
            tableData={adjustedVulnerabilityInfo}
            tableLabels={[
              { id: 'title', label: 'ID' },
              { id: 'severity', label: 'Severity', align: 'right' },
              { id: '', label: '', align: 'center' },
            ]}
          />
        </Grid>
        </Grid>


        <Grid xs={12} md={6} lg={4}>
          
	      {totalClicks !== null && totalRecipients !== null ? (
  <BookingAvailable
    title="Phishing Clicks"
    id="demo__6"
    totalClicks={totalClicks}
    totalRecipients={totalRecipients}
  />
) : (
  <div>Loading...</div>
)}

        </Grid>

        

        <Grid xs={12} md={6} lg={8}>
          
        {loading ? (
          <div>Loading...</div>
        ) : (
          <AppNewInvoice3
            title="Exploits"
            id="demo__7"
            tableData={adjustedExploitDetails}
            tableLabels={[
              { id: 'title', label: 'CVE ID' },
              { id: 'content', label: 'Content', align: 'left' },
              { id: 'location', label: 'Location URL' },
              { id: 'date', label: 'Date', align: 'left' },
            ]}
          />
        )}

        </Grid>

      </Grid>
    </Container>
    </>
  );
}
