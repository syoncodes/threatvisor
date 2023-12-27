import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Card from '@mui/material/Card';
import Chart, { useChart } from 'src/components/chart';

import { fNumber } from 'src/utils/format-number';

export default function BookingAvailable({ title, subheader, totalClicks, totalRecipients, ...other }) {
  const theme = useTheme();
  const [storedTotalRecipients, setStoredTotalRecipients] = useState(null);

  // Check if totalRecipients is available in local storage and set it if found
  useEffect(() => {
    const storedValue = localStorage.getItem('totalRecipients');
    if (storedValue) {
      setStoredTotalRecipients(parseFloat(storedValue));
    }
  }, []);

  // Calculate the percentage of clicks
  const clickPercentage = totalRecipients > 0 ? (totalClicks / totalRecipients) * 100 : 0;

  // Initialize chartOptions state
  const initialChartOptions = useChart({
    legend: {
      show: false,
    },
    grid: {
      padding: { top: -32, bottom: -32 },
    },
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: [
          { offset: 0, color: theme.palette.primary.light },
          { offset: 100, color: theme.palette.primary.main },
        ],
      },
    },
    plotOptions: {
      radialBar: {
        hollow: { size: '64%' },
        dataLabels: {
          name: { offsetY: -16 },
          value: { offsetY: 8 },
          total: {
            label: 'Total Recipients',
            formatter: () => fNumber(storedTotalRecipients || totalRecipients), // Use stored value if available
          },
        },
      },
    },
  });

  const [chartOptions, setChartOptions] = useState(initialChartOptions);

  // Update chartOptions when totalRecipients changes
  useEffect(() => {
    setChartOptions(prevOptions => ({
      ...prevOptions,
      plotOptions: {
        ...prevOptions.plotOptions,
        radialBar: {
          ...prevOptions.plotOptions.radialBar,
          dataLabels: {
            ...prevOptions.plotOptions.radialBar.dataLabels,
            total: {
              ...prevOptions.plotOptions.radialBar.dataLabels.total,
              formatter: () => fNumber(storedTotalRecipients || totalRecipients), // Use stored value if available
            },
          },
        },
      },
    }));
  }, [totalRecipients, storedTotalRecipients]);

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 8 }} />

      <Chart type="radialBar" series={[clickPercentage]} options={chartOptions} height={310} />

      <Stack spacing={2} sx={{ p: 5 }}>
        <Box
          sx={{
            typography: 'subtitle2',
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <span>Total Clicks:</span>
          <strong>{fNumber(totalClicks)}</strong>
        </Box>
        <Box
          sx={{
            typography: 'subtitle2',
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <span>Total Recipients:</span>
          <strong>{fNumber(storedTotalRecipients || totalRecipients)}</strong> {/* Use stored value if available */}
        </Box>
      </Stack>
    </Card>
  );
}

BookingAvailable.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  totalClicks: PropTypes.number.isRequired,
  totalRecipients: PropTypes.number.isRequired,
};
