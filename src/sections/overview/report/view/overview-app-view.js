'use client';

// @mui
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import React, { useEffect, useRef, useState, Fragment } from 'react';
import { Paper, Typography } from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
// components
import { useSettingsContext } from 'src/components/settings';
// assets
import { SeoIllustration } from 'src/assets/illustrations';
//
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

const API_BASE_URL = 'https://threatvisor-api.vercel.app/api';




// ----------------------------------------------------------------------

export default function OverviewAppView() {
  const [isPDFMode, setIsPDFMode] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const dashboardRef = useRef();
  const downloadHandler = () => {
    handleDownloadPdf();
  };

  useEffect(() => {
    window.addEventListener('initiateDownload', downloadHandler);

    return () => {
      window.removeEventListener('initiateDownload', downloadHandler);
    };
  }, []);
  const handleDownloadPdf = async () => {
    setIsGeneratingPDF(true);
    setIsPDFMode(true);
    // Get the dashboard element
    console.log("Download button clicked.");

  // Get the dashboard element
  const dashboardElement = dashboardRef.current;
  await new Promise(resolve => setTimeout(resolve, 500)); // 500 milliseconds
  console.log("Dashboard element:", dashboardElement);
    
    // Set background color to a specific hex color (e.g., #FF5733)
  dashboardElement.style.backgroundColor = '#161C24';

  // Define options for html2canvas
  const canvasOptions = {
    scale: 2, // Increase scale for better resolution
    useCORS: true, // To handle external images, if any
    backgroundColor: null, // Transparent background to maintain CSS styling
    scrollX: -window.scrollX,
    scrollY: -window.scrollY,
    windowWidth: document.documentElement.offsetWidth,
    windowHeight: document.documentElement.offsetHeight,
  };
  
    // Generate canvas using html2canvas
    const canvas = await html2canvas(dashboardElement, canvasOptions);
    const imgData = canvas.toDataURL('image/png');
  
    // Calculate PDF page size based on image size and aspect ratio
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const pdfWidth = imgWidth > imgHeight ? 297 : 210; // A4 size dimensions in mm
    const topMarginInMm = 5; // 20mm top margin
    const bottomMarginInMm = 20; // 20mm bottom margin
    const pdfHeight = (imgHeight * pdfWidth) / imgWidth + topMarginInMm;

  
    // Create a new jsPDF instance
    const pdf = new jsPDF({
      orientation: imgWidth > imgHeight ? 'landscape' : 'portrait', // Orientation based on image aspect ratio
      unit: 'mm',
      format: [pdfWidth, pdfHeight]
    });
    
    
    // Convert pixels to mm for pdf dimensions
    const imgWidthInMm = pdfWidth;
    const imgHeightInMm = (imgWidthInMm / imgWidth) * imgHeight;
    const backgroundColor = '#161C24'; // Replace with your background color
    pdf.setFillColor(backgroundColor); // Set the fill color
    pdf.rect(0, 0, pdfWidth, topMarginInMm, 'F'); // Draw a filled rectangle

    

    // Add a colored rectangle as a bottom margin

    pdf.rect(0, pdfHeight - bottomMarginInMm, pdfWidth, bottomMarginInMm, 'F'); // Draw a filled rectangle for the bottom margin

    // Add image to the PDF below the top margin
    pdf.addImage(imgData, 'PNG', 0, topMarginInMm, imgWidthInMm, imgHeightInMm);
  
    // Save the PDF
    pdf.save(`Vulnerability report for: ${date}.pdf`);
    setIsGeneratingPDF(false);
    setIsPDFMode(false);
  
    console.log("PDF download initiated."); // Add this log statement
  };
  
  const { user } = useAuthContext();
  console.log("User object:", user);
  const theme = useTheme();

  const settings = useSettingsContext();
  const [expandedRow, setExpandedRow] = useState(null);
  const vulnerabilityDetailsRef = useRef(null);
  const vulnerabilityInfoRef = useRef(null);

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
      const response = await axios.post('https://threatvisor-api.vercel.app/api/endpoints/getVulnerabilityLog', {
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
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await axios.post(`${API_BASE_URL}/endpoints/getVulnerabilityDetails2`, { userEmail: user.email });
        const vulnerabilities = response.data.vulnerabilities || {};
        const vulnerabilitiesArray = Object.entries(vulnerabilities).reduce((acc, [severity, issues]) => {
          Object.entries(issues).forEach(([issueName, details]) => {
            acc.push(...details.locations.map((location, index) => ({
              id: `${issueName}-${location}-${details.dates[index]}`,
              title: issueName,
              location: location,
              severity: severity,
              date: details.dates[index] || new Date().toISOString().split('T')[0],
              description: details.description,
              solution: details.solution,
              occurrences: details.occurrences
            })));
          });
          return acc;
        }, []);
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
        const response = await axios.post('https://threatvisor-api.vercel.app/api/endpoints/getIDs', {
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
  const [date, setDate] = useState(null);
  const [vulnerabilityReport, setVulnerabilityReport] = useState(null);
  useEffect(() => {
    const fetchVulnerabilityReport = async () => {
      try {
        const endpoint = 'https://threatvisor-api.vercel.app/api/endpoints/getVulnerabilityReport';
        const requestBody = {
          email: user?.email,
        };

        // Log request details
        console.log('Sending request to:', endpoint);
        console.log('Report Request body:', requestBody);

        const response = await axios.post(endpoint, requestBody);

        // Log response details
        console.log('Server Response Status:', response.status);
        console.log('Server Report Response Data:', response.data);

        setDate(response.data.date);
        setVulnerabilityReport(response.data.vulnerability_report);
      } catch (error) {
        // Log any errors
        console.error('Error fetching vulnerability report:', error);
      }
    };

    if (user?.email) {
      fetchVulnerabilityReport();
    }
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
        const response = await axios.post('https://threatvisor-api.vercel.app/api/endpoints/getVulnerabilities', {
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
      const endpoint = 'https://threatvisor-api.vercel.app/api/endpoints/getPorts';
      const requestBody = {
        email: user?.email,
      };

      console.log('Sending request to:', endpoint);
      console.log('Request body:', requestBody);

      const response = await axios.post(endpoint, requestBody);
      console.log('Server Response for Widgets:', response.data);

      const latestLog = response.data.weeklyLog[response.data.weeklyLog.length - 1] || {};

      // Log right before setting the state to check the response
      console.log('Response Data - Total Endpoints:', response.data.ports.total_endpoints);

      setWidgetSummaryData({
        totalOpenPorts: response.data.ports.open || 0,
        totalFilteredPorts: response.data.ports.filtered || 0,
        totalEndpoints: response.data.ports.total_endpoints,
        weeklyLog: response.data.weeklyLog,
        percentChanges: {
          total: latestLog?.percentage_change?.total !== "N/A" ? parseFloat(latestLog?.percentage_change?.total) : null,
          filtered: latestLog?.percentage_change?.filtered !== "N/A" ? parseFloat(latestLog?.percentage_change?.filtered) : null,
          total_endpoints: latestLog?.percentage_change?.total_endpoints !== "N/A" ? parseFloat(latestLog?.percentage_change?.total_endpoints) : null,
        },
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
      if (data.length > MIN_ROWS) {
        return data.slice(0, MIN_ROWS);
      }
      return [...data, ...Array(MIN_ROWS - data.length).fill({})];
    };

    const adjustedDetails = adjustRows(exploitDetails);
    setAdjustedExploitDetails(adjustedDetails);
  }
}, [exploitDetails, loading]);

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

  
  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'} ref={dashboardRef}>
      <Grid container spacing={3}>
      <Grid item xs={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item xs={12} md={6}>
            <Typography variant="h5" align="center" gutterBottom>
              Vulnerability report for: {date}
              {/* Replace with the specific vulnerability report title */}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} align="right">
          {!isPDFMode && !isGeneratingPDF && (
  <Button
    variant="contained"
    onClick={handleDownloadPdf}
    style={{ display: isGeneratingPDF ? 'none' : 'block' }}
    sx={{
      mb: 2,
      backgroundColor: 'red', // Customize the button's color
      color: 'white',
    }}
  >
    Download as PDF
  </Button>
)}

          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        
        {/* Total Open Ports */}
        <Grid item xs={12} md={4}>
          <AppWidgetSummary
            title="Total Open Ports"
            percent={widgetSummaryData.percentChanges.total}
            total={widgetSummaryData.totalOpenPorts}
            chart={{
              series: widgetSummaryData.weeklyLog.map(log => log.data.open),
              colors: ['blue', 'lightblue']
            }}
          />
        </Grid>
  
        {/* Total Filtered Ports */}
        <Grid item xs={12} md={4}>
          <AppWidgetSummary
            title="Total Filtered Ports"
            percent={widgetSummaryData.percentChanges.filtered}
            total={widgetSummaryData.totalFilteredPorts}
            chart={{
              series: widgetSummaryData.weeklyLog.map(log => log.data.filtered),
              colors: ['red', 'pink']
            }}
          />
        </Grid>
  
        {/* Total Endpoints */}
        <Grid item xs={12} md={4}>
          <AppWidgetSummary
            title="Total Endpoints"
            percent={widgetSummaryData.percentChanges.total_endpoints}
            total={widgetSummaryData.totalEndpoints}
            chart={{
              series: widgetSummaryData.weeklyLog.map(log => log.data.total_endpoints),
              colors: ['green', 'lightgreen']
            }}
          />
        </Grid>
  
        {/* Total Vulnerabilities */}
        <Grid item xs={12} md={6} lg={4}>
          {!loading && vulnerabilitiesData ? (
            <AppCurrentDownload
              title="Total Vulnerabilities"
              chart={{ series: vulnerabilitiesData }}
            />
          ) : (
            <div>Loading...</div>
          )}
        </Grid>
  
        {/* Vulnerability Timeline */}
        <Grid item xs={12} md={6} lg={8}>
          {loading || !vulnerabilityLogData.series || vulnerabilityLogData.series.length === 0 ? (
            <div>Loading Chart Data...</div>
          ) : (
            <AppAreaInstalled
              title="Vulnerability Timeline"
              subheader="‎"
              data={vulnerabilityLogData}
            />
          )}
        </Grid>
  
        {/* Vulnerability Details */}
        <Grid item xs={12}>
         <AppNewInvoice22
        title="Vulnerability Details"
        tableData={vulnerabilityDetails}
        expandedRow={expandedRow}
        onRowToggle={toggleRow}
        tableLabels={[
          { id: 'title', label: 'Vulnerability' },
          { id: 'location', label: 'Location' },
          { id: 'severity', label: 'Severity' },
          { id: 'date', label: 'Date' },
          { id: '', label: '' },
        ]}
      />
        </Grid>
  
        {/* Vulnerability IDs */}
        <Grid item xs={12} md={6} lg={6}>
          <AppNewInvoice2
            title="Vulnerability IDs"
            tableData={vulnerabilityInfo}
            tableLabels={[
              { id: 'title', label: 'ID' },
              { id: 'severity', label: 'Severity' },
              { id: 'locations', label: 'Location' },
              { id: 'occurrences', label: 'Occurrences' },
            ]}
          />
        </Grid>
  
        {/* Phishing Clicks */}
        <Grid item xs={12} md={6} lg={6}>
          {totalClicks !== null && totalRecipients !== null ? (
            <BookingAvailable
              title="Phishing Clicks"
              totalClicks={totalClicks}
              totalRecipients={totalRecipients}
            />
          ) : (
            <div>Loading...</div>
          )}
        </Grid>
  
        {/* Exploits */}
        <Grid item xs={12}>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <AppNewInvoice3
              title="(POC) Exploits & Remediations"
              tableData={exploitDetails}
              tableLabels={[
                { id: 'title', label: 'Vulnerability ID' },
                { id: 'content', label: 'Content', align: 'left' },
                { id: 'location', label: 'Location URL' },
                { id: 'date', label: 'Date', align: 'left' },
                { id: ' ', label: ' ', align: 'left' },
              ]}
            />
          )}
        </Grid>
  
        {/* Vulnerability Report */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Vulnerability Report
            </Typography>
            {date && (
              <Typography variant="subtitle1" gutterBottom>
                Date: {date}
              </Typography>
            )}
            {vulnerabilityReport && (
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {vulnerabilityReport}
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
      </Grid>
    </Container>
  );
  }
