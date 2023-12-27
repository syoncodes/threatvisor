'use client';

import sumBy from 'lodash/sumBy';
import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
// @mui
import { useTheme, alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// utils
import { fTimestamp } from 'src/utils/format-time';
// _mock
import { _invoices, INVOICE_SERVICE_OPTIONS } from 'src/_mock';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
//
import InvoiceAnalytic from '../invoice-analytic';
import InvoiceTableRow from '../invoice-table-row';
import InvoiceTableToolbar from '../invoice-table-toolbar';
import InvoiceTableFiltersResult from '../invoice-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'invoiceNumber', label: 'Endpoint' },
  { id: 'createDate', label: 'Date Added' },
  { id: 'price', label: 'Hygiene' },
  { id: 'sent', label: 'Added By', align: 'center' },
  { id: 'status', label: 'Status' },
  { id: '' },
];

const defaultFilters = {
  name: '',
  service: [],
  status: 'all',
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function EndpointListView() {
  const theme = useTheme();

  const settings = useSettingsContext();

  const router = useRouter();

  const table = useTable({ defaultOrderBy: 'createDate' });

  const confirm = useBoolean();

  const [loading, setLoading] = useState(true);

  const [userName, setUserName] = useState(''); // New state variable for user role

  const [filters, setFilters] = useState(defaultFilters);

  // First useEffect to set the userRole from session storage
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedUserName = sessionStorage.getItem('userName');
      if (fetchedUserName) {
        setUserName(fetchedUserName);
        try {
          const requestOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: fetchedUserName,
            }),
          };
  
          console.log('Request:', requestOptions);  // Log the request
  
          const response = await fetch('https://threatvisor-api.vercel.app/api/endpoints/fetch-endpoints', requestOptions);
  
          const responseData = await response.json();
  
          if (responseData && responseData.endpoints) {
            setTableData(responseData.endpoints);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);  // Set loading to false after fetching data or in case of an error
        }
      }
    };
  
    fetchData();
  }, []);
  


  

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 56 : 76;

  const canReset =
    !!filters.name ||
    !!filters.service.length ||
    filters.status !== 'all' ||
    (!!filters.startDate && !!filters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const getInvoiceLengthByService = (serviceType) => tableData.filter((endpoint) => endpoint.items[0].service === serviceType).length;

  const getInvoiceLength = (status) => tableData.filter((endpoint) => endpoint.status === status).length;

  const getTotalAmount = (status) =>
    sumBy(
      tableData.filter((item) => item.status === status),
      'totalAmount'
    );

  const getPercentByStatus = (status) => (getInvoiceLength(status) / tableData.length) * 100;

  const TABS = [
    { value: 'all', label: 'All', color: 'default', count: tableData.length },
    {
      value: 'scanning',
      label: 'Scanning',
      color: 'success',
      count: getInvoiceLength('scanning'),
    },
    {
      value: 'paused',
      label: 'Paused',
      color: 'warning',
      count: getInvoiceLength('paused'),
    },
    {
      value: 'stopped',
      label: 'Stopped',
      color: 'error',
      count: getInvoiceLength('stopped'),
    },
    {
      value: 'draft',
      label: 'Draft',
      color: 'default',
      count: getInvoiceLength('draft'),
    },
];


  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleDeleteRow = useCallback(
    async (row) => {
      try {
        let params = new URLSearchParams({
          userId: userName,
          ...(row.items[0].service === 'Domain' && { domain: row.items[0].url }),
          ...(row.items[0].service === 'Network' && { ip: row.items[0].ipAddress }),
          ...(['Phishing', 'OSINT'].includes(row.items[0].service) && { title: row.items[0].title }),
        });

        console.log("Sending delete request with data:", params.toString());
        await axios.delete(`https://threatvisor-api.vercel.app/api/endpoints/delete-endpoint/user?${params}`);
        const updatedData = tableData.filter((item) => item.id !== row.id);
        setTableData(updatedData);
        table.onUpdatePageDeleteRow(dataInPage.length);
      } catch (error) {
        console.error('Error deleting row:', error);
      }
    },
    [dataInPage.length, table, tableData, userName]
);



  
  // Modify the handleDeleteRows function
  const handleDeleteRows = useCallback(async () => {
    try {
      await axios.delete('https://threatvisor-api.vercel.app/api/endpoints/delete-endpoints/user', { data: { ids: table.selected } });
      const updatedData = tableData.filter((row) => !table.selected.includes(row.id));
      setTableData(updatedData);
      table.onUpdatePageDeleteRows({
        totalRows: tableData.length,
        totalRowsInPage: dataInPage.length,
        totalRowsFiltered: dataFiltered.length,
      });
    } catch (error) {
      console.error('Error deleting rows:', error);
    }
  }, [dataFiltered.length, dataInPage.length, table, tableData]);
  const [requestData, setRequestData] = useState(null);

  
  const handleEditRow = useCallback(
    async (row) => {
      try {
        let editData = { userId: userName };
        switch (row.items[0].service) {
          case 'Domain':
            editData.domain = row.items[0].url;
            break;
          case 'Network':
            editData.ip = row.items[0].ipAddress;
            break;
          case 'Phishing':
          case 'OSINT':
            editData.title = row.items[0].title;
            break;
          default:
            break;
        }
  
        console.log("Sending edit request with data:", editData);
  
        // Fetch the details of the row you want to edit
  
        setRequestData(editData);
        
      // Set the endpoint data to the state
   

      // Navigate to the InvoiceNewEditForm component
      router.push(paths.dashboard.endpoints.edit);
      localStorage.setItem('editData', JSON.stringify(editData));

      } catch (error) {
        console.error('Error fetching endpoint details:', error);
      }
    },
    [router, userName, setRequestData]
  );
  

  const handleSelectRow = (rowId) => {
    table.onSelectRow(rowId); // This will toggle the selection of the row
  };
  
  


  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Endpoints',
              href: paths.dashboard.endpoints.root,
            },
            {
              name: 'List',
            },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.endpoints.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Endpoint
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          <Scrollbar>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2 }}
            >
              <InvoiceAnalytic
                title="Total"
                total={tableData.length}
                percent={100}
                price={sumBy(tableData, 'totalAmount')}
                icon="solar:bill-list-bold-duotone"
                color={theme.palette.info.main}
              />

              <InvoiceAnalytic
                  title="Networks"
                  total={getInvoiceLengthByService('Network')}
                  percent={(getInvoiceLengthByService('Network') / tableData.length) * 100}
                  price={sumBy(tableData.filter((item) => item.items[0].service === 'Network'), 'totalAmount')}
                  icon="solar:file-check-bold-duotone"
                  color={theme.palette.success.main}
              />

              <InvoiceAnalytic
                  title="Domains"
                  total={getInvoiceLengthByService('Domain')}
                  percent={(getInvoiceLengthByService('Domain') / tableData.length) * 100}
                  price={sumBy(tableData.filter((item) => item.items[0].service === 'Domain'), 'totalAmount')}
                  icon="solar:sort-by-time-bold-duotone"
                  color={theme.palette.warning.main}
              />

              <InvoiceAnalytic
                  title="Phishing"
                  total={getInvoiceLengthByService('Phishing')}
                  percent={(getInvoiceLengthByService('Phishing') / tableData.length) * 100}
                  price={sumBy(tableData.filter((item) => item.items[0].service === 'Phishing'), 'totalAmount')}
                  icon="solar:bell-bing-bold-duotone"
                  color={theme.palette.error.main}
              />

              <InvoiceAnalytic
                  title="OSINT"
                  total={getInvoiceLengthByService('OSINT')}
                  percent={(getInvoiceLengthByService('OSINT') / tableData.length) * 100}
                  price={sumBy(tableData.filter((item) => item.items[0].service === 'OSINT'), 'totalAmount')}
                  icon="solar:file-corrupted-bold-duotone"
                  color={theme.palette.text.secondary}
              />

            </Stack>
          </Scrollbar>
        </Card>

        <Card>
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                iconPosition="end"
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                    }
                    color={tab.color}
                  >
                    {tab.count}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <InvoiceTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            dateError={dateError}
            serviceOptions={INVOICE_SERVICE_OPTIONS.map((option) => option.name)}
          />

          {canReset && (
            <InvoiceTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) => {
                if (checked) {
                  table.onSelectAllRows(
                    true,
                    tableData.map((row) => row.id)
                  );
                } else {
                  table.setSelected([]); // Deselect all rows
                }
              }}
              action={
                <Stack direction="row">
                  <Tooltip title="Sent">
                    <IconButton color="primary">
                      <Iconify icon="iconamoon:send-fill" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Download">
                    <IconButton color="primary">
                      <Iconify icon="eva:download-outline" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Print">
                    <IconButton color="primary">
                      <Iconify icon="solar:printer-minimalistic-bold" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <IconButton color="primary" onClick={confirm.onTrue}>
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <InvoiceTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => handleSelectRow(row.id)}
                        onEditRow={() => handleEditRow(row)}
                        onDeleteRow={() => handleDeleteRow(row)}
                      />

                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { name, status, service, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  const getMainTitle = (item) => {
    switch (item.service) {
      case 'Domain':
        return item.url;
      case 'Network':
        return item.ipAddress;
      case 'Phishing':
        return item.title;
      case 'OSINT':
        return item.title;
      default:
        return '';
    }
  };

  if (name) {
    inputData = inputData.filter((endpoint) => {
      const mainTitle = getMainTitle(endpoint.items[0]);
      return mainTitle.toLowerCase().indexOf(name.toLowerCase()) !== -1;
    });
  }

  if (status !== 'all') {
    inputData = inputData.filter((endpoint) => endpoint.status === status);
}


  if (service.length) {
    inputData = inputData.filter((invoice) =>
      invoice.items.some((filterItem) => service.includes(filterItem.service))
    );
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter(
        (endpoint) =>
          new Date(endpoint.startDate) >= new Date(startDate) &&
          new Date(endpoint.startDate) <= new Date(endDate)
      );
    }
  }

  return inputData;
}
