import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import CardHeader from '@mui/material/CardHeader';
import Card from '@mui/material/Card';
// components
import Iconify from 'src/components/iconify';
import Chart, { useChart } from 'src/components/chart';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

export default function AppAreaInstalled({ title, subheader, data, ...other }) {
  const theme = useTheme();
  const popover = usePopover();

  const [selectedYear, setSelectedYear] = useState(data.series[0]?.year || '2019');

  // Define severity colors
  const severityColors = {
    'High': theme.palette.primary.main,
    'Medium': theme.palette.error.main,
    'Low': theme.palette.warning.main,
    'Informational': theme.palette.info.main,
  };

  // Sort the data.series array based on severity
const sortedSeries = [...data.series].sort((a, b) => {
  const severityOrder = {
    'High': 4,
    'Medium': 3,
    'Low': 2,
    'Informational': 1,
  };
  
  // Calculate the severity of each series by finding the maximum severity within the series data
  const getSeriesSeverity = (series) => {
    let maxSeverity = 0;
    for (const dataPoint of series.data) {
      const pointSeverity = severityOrder[dataPoint.name];
      if (pointSeverity > maxSeverity) {
        maxSeverity = pointSeverity;
      }
    }
    return maxSeverity;
  };

  return getSeriesSeverity(b) - getSeriesSeverity(a);
});



  // Extract colors for series based on their names
  const chartColors = sortedSeries[0]?.data.map((item) => severityColors[item.name]) || [];

  const chartOptions = useChart({
    colors: chartColors,
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    },
    xaxis: {
      categories: data.categories,
    },
    ...data.options,
  });

  const handleChangeSeries = useCallback(
    (newValue) => {
      popover.onClose();
      setSelectedYear(newValue);
    },
    [popover]
  );

  const selectedSeriesData = sortedSeries.find((item) => item.year === selectedYear);

  return (
    <>
      <Card {...other}>
        <CardHeader
          title={title}
          subheader={subheader}
          action={
            <ButtonBase
              onClick={popover.onOpen}
              sx={{
                pl: 1,
                py: 0.5,
                pr: 1,
                borderRadius: 1,
                typography: 'subtitle2',
                bgcolor: 'background.neutral',
              }}
            >
              {selectedYear}
              <Iconify
                width={16}
                icon={popover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
                sx={{ ml: 0.5 }}
              />
            </ButtonBase>
          }
        />

        <Box sx={{ mt: 3, mx: 3 }}>
          {selectedSeriesData && (
            <Chart dir="ltr" type="area" series={selectedSeriesData.data} options={chartOptions} height={364} />
          )}
        </Box>
      </Card>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 140 }}>
        {sortedSeries.map((option) => (
          <MenuItem
            key={option.year}
            selected={option.year === selectedYear}
            onClick={() => handleChangeSeries(option.year)}
          >
            {option.year}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}

AppAreaInstalled.propTypes = {
  data: PropTypes.shape({
    categories: PropTypes.arrayOf(PropTypes.string),
    series: PropTypes.arrayOf(
      PropTypes.shape({
        year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        data: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string,
            data: PropTypes.arrayOf(PropTypes.number),
          })
        ),
      })
    ),
    options: PropTypes.object,
  }),
  subheader: PropTypes.string,
  title: PropTypes.string,
};
