import PropTypes from 'prop-types';
import { useMemo, useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import FormProvider from 'src/components/hook-form';
import { useAuthContext } from 'src/auth/hooks'; // Import the useAuthContext hook

import axios from 'axios';
import InvoiceNewEditDetails from './invoice-new-edit-details';
import InvoiceNewEditStatusDate from './invoice-new-edit-status-date';

export default function InvoiceNewEditForm({ currentInvoice }) {
  const router = useRouter();
  const loadingSave = useBoolean();
  const loadingSend = useBoolean();

  const { user } = useAuthContext(); // Use the useAuthContext hook to get user details
  const name = user?.firstName;

  const NewInvoiceSchema = Yup.object().shape({
    startDate: Yup.date().required('Start Date is required'),
    items: Yup.array().of(
      Yup.object().shape({
        service: Yup.string().required('Service is required'),
        description: Yup.string(),
        url: Yup.string().when(['service'], (service, schema) => {
          return ['Domain'].includes(service)
            ? schema.required('URL is required')
            : schema;
        }),
        ipAddress: Yup.string().when(['service'], (service, schema) => {
          return ['Network'].includes(service)
            ? schema.required('IP Address is required')
            : schema;
        }),
        emails: Yup.string().when(['service'], (service, schema) => {
          return ['Phishing'].includes(service)
            ? schema.required('Emails are required')
            : schema;
        }),
        searchTerms: Yup.string().when(['service'], (service, schema) => {
          return ['OSINT'].includes(service)
            ? schema.required('Search Terms are required')
            : schema;
        }),
        scan: Yup.string().when(['service'], (service, schema) => {
          return ['Domain', 'Network'].includes(service)
            ? schema.required('Scan Type is required')
            : schema;
        }),
        title: Yup.string().when(['service'], (service) => {
          return ['Phishing', 'OSINT'].includes(service)
            ? Yup.string().required('Title is required')
            : Yup.string();
        }),
      })
    ),
  });
  
  const [endpointData, setEndpointData] = useState(null);

  useEffect(() => {
    const storedRole = sessionStorage.getItem('userName');
    if (storedRole) {
      setUserName(storedRole);
    }
  }, []);

  const defaultValues = useMemo(
    () => ({
      startDate: currentInvoice?.startDate || new Date(),
      items: currentInvoice?.items || [
        {
          description: '',
          service: '',
        },
      ],
    }),
    [currentInvoice]
  );


  const methods = useForm({
    resolver: yupResolver(NewInvoiceSchema),
    defaultValues,
  });

  const { reset, handleSubmit, formState: { isSubmitting } } = methods;

  const handleSaveAsDraft = handleSubmit(async (data) => {
    loadingSave.onTrue();
  
    // Set the status to "Draft"
    data.status = "Draft";
  
    for (const item of data.items) {
      try {
        const response = await fetch('http://localhost:8080/api/endpoints/save-endpoint/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userName,
            name: name, // Replace with the actual user ID
            endpointData: { ...data, items: [item] }, // Send only the current item
          }),
        });
  
        const result = await response.json();
        if (!result.success) {
          console.error(result.error);
        }
      } catch (error) {
        console.error(error);
      }
    }
  
    reset();
    router.push(paths.dashboard.endpoints.root);
    loadingSave.onFalse();
  });
  
  const handleCreateAndSend = handleSubmit(async (data) => {
    loadingSend.onTrue();
  
    // Set the status to an empty string
    data.status = "";
  
    for (const item of data.items) {
      try {
        const response = await fetch('http://localhost:8080/api/endpoints/save-endpoint/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userName,
            name: name, // Replace with the actual user ID
            endpointData: { ...data, items: [item] }, // Send only the current item
          }),
        });
  
        const result = await response.json();
        if (!result.success) {
          console.error(result.error);
        }
      } catch (error) {
        console.error(error);
      }
    }
  
    reset();
    router.push(paths.dashboard.endpoints.root);
    loadingSend.onFalse();
  });
  

  const [userName, setUserName] = useState(''); // New state variable for user role

  // First useEffect to set the userRole from session storage
  useEffect(() => {
    const storedRole = sessionStorage.getItem('userName');
    if (storedRole) {
      setUserName(storedRole);
    }
  }, []);

  return (
    <FormProvider methods={methods}>
      <Card>
        <InvoiceNewEditStatusDate />
        <InvoiceNewEditDetails />
      </Card>
      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
        <LoadingButton
          color="inherit"
          size="large"
          variant="outlined"
          loading={loadingSave.value && isSubmitting}
          onClick={handleSaveAsDraft}
        >
          Save as Draft
        </LoadingButton>
        <LoadingButton
          size="large"
          variant="contained"
          loading={loadingSend.value && isSubmitting}
          onClick={handleCreateAndSend}
        >
          {endpointData ? 'Update' : 'Add'}
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}

InvoiceNewEditForm.propTypes = {
  currentInvoice: PropTypes.object,
};