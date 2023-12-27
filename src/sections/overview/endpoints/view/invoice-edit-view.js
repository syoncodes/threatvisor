'use client';

import PropTypes from 'prop-types';
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _invoices } from 'src/_mock';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import InvoiceNewEditForm from '../invoice-edit-form';


// ----------------------------------------------------------------------

export default function InvoiceEditView({ id }) {
  const settings = useSettingsContext();

  const editData = JSON.parse(localStorage.getItem('editData'));


  console.log("InvoiceEditView received editData:", editData);

  const currentInvoice = _invoices.find((invoice) => invoice.id === id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Endpoints',
            href: paths.dashboard.endpoints.root,
          },
          { name: currentInvoice?.invoiceNumber },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <InvoiceNewEditForm currentInvoice={currentInvoice} editData={editData} />
    </Container>
  );
}

InvoiceEditView.propTypes = {
  id: PropTypes.string,
  editData: PropTypes.object
};
