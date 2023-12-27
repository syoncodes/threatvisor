import PropTypes from 'prop-types';
import { useTheme, styled } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import Card from '@mui/material/Card';
import { fNumber } from 'src/utils/format-number';
import Chart, { useChart } from 'src/components/chart';

const CHART_HEIGHT = 400;
const LEGEND_HEIGHT = 72;

const StyledChart = styled(Chart)(({ theme }) => ({
  height: CHART_HEIGHT,
  '& .apexcharts-canvas, .apexcharts-inner, svg, foreignObject': {
    height: `100% !important`,
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    borderTop: `dashed 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

export default function AppCurrentDownload({ title, subheader, fetchVulnerabilitiesData, chart, ...other }) {
  const theme = useTheme();

  const severityColors = {
    'High': theme.palette.primary.main,
    'Medium': theme.palette.error.main,
    'Low': theme.palette.warning.main,
    'Informational': theme.palette.info.main,
  };

  const { series = [], options } = chart;

  // Calculate the sum of values
  const sumOfValues = series.reduce((a, item) => a + item.value, 0);

  // Calculate the percentage for each series item and map to its color
  const chartSeries = series.map((item) => Math.round((item.value / sumOfValues) * 100));
  const chartColors = Object.keys(severityColors).map(key => severityColors[key]);

  const chartOptions = useChart({
    colors: chartColors,
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    labels: Object.keys(severityColors),
    legend: {
      floating: true,
      position: 'bottom',
      horizontalAlign: 'center',
    },
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: chartColors.map((color) => [
          { offset: 0, color: '#ffffff' },
          { offset: 20, color: color }, // Adjust this offset for earlier transition
        ]),
      },
    },
    plotOptions: {
      radialBar: {
        hollow: { size: '68%' },
        dataLabels: {
          value: { offsetY: 16 },
          total: {
            formatter: () => fNumber(sumOfValues),
          },
        },
      },
    },
    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 5 }} />

      <StyledChart
        dir="ltr"
        type="radialBar"
        series={chartSeries}
        options={chartOptions}
        height={300}
      />
    </Card>
  );
}

AppCurrentDownload.propTypes = {
  chart: PropTypes.object.isRequired,
  subheader: PropTypes.string,
  title: PropTypes.string.isRequired,
  fetchVulnerabilitiesData: PropTypes.array.isRequired, // Pass the data from the server as a prop
};
