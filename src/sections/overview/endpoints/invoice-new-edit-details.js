import { useCallback } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import * as Yup from 'yup';
import { INVOICE_SERVICE_OPTIONS } from 'src/_mock';

import Iconify from 'src/components/iconify';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';

// Function to get schema for an item based on its service
const getItemSchema = (service) => {
  const baseSchema = {
    service: Yup.string().required('Service is required'),
    description: Yup.string(),
  };

  switch (service) {
    case 'Domain':
      return {
        ...baseSchema,
        url: Yup.string().required('URL is required'),
        scan: Yup.string().required('Scan Type is required'),
        title: Yup.string().required('Title is required'), // Add "Title" for Domain
      };
    case 'Network':
      return {
        ...baseSchema,
        ipAddress: Yup.string().required('IP Address is required'),
        scan: Yup.string().required('Scan Type is required'),
        title: Yup.string().required('Title is required'), // Add "Title" for Network
      };
    case 'Phishing':
      return {
        ...baseSchema,
        description: Yup.string().required('Description is required'),
        title: Yup.string().required('Title is required'), // Add "Title" for Phishing
      };
    case 'OSINT':
      return {
        ...baseSchema,
        description: Yup.string().required('Description is required'),
        searchTerms: Yup.string().required('Search Terms are required'),
        title: Yup.string().required('Title is required'), // Add "Title" for OSINT
      };
    default:
      return baseSchema;
  }
};

// Create the schema for the items array
const itemsSchema = Yup.array().of(
  Yup.lazy((item) => Yup.object().shape(getItemSchema(item.service)))
);

export default function InvoiceNewEditDetails() {
  const { control, setValue, watch, resetField } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const values = watch();

  const handleAdd = () => {
    append({
      description: '',
      service: '',
    });
  };

  const handleRemove = (index) => {
    remove(index);
  };

  const handleClearService = useCallback(
    (index) => {
      resetField(`items[${index}].description`);
      resetField(`items[${index}].title`); // Clear the "Title" field when changing the service
    },
    [resetField]
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
        Details:
      </Typography>

      <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
        {fields.map((item, index) => (
          <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
              <RHFSelect
                name={`items[${index}].service`}
                size="small"
                label="Service"
                InputLabelProps={{ shrink: true }}
                sx={{
                  maxWidth: { md: 160 },
                }}
              >
                <MenuItem
                  value=""
                  onClick={() => handleClearService(index)}
                  sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                >
                  None
                </MenuItem>

                <Divider sx={{ borderStyle: 'dashed' }} />

                {INVOICE_SERVICE_OPTIONS.map((service) => (
                  <MenuItem
                    key={service.id}
                    value={service.name}
                    onClick={() => handleClearService(index)}
                  >
                    {service.name}
                  </MenuItem>
                ))}
              </RHFSelect>

              {values.items[index].service === 'Domain' && (
                <>
                  <RHFTextField
                    size="small"
                    name={`items[${index}].url`}
                    label="URL"
                    InputLabelProps={{ shrink: true }}
                  />
                  <RHFSelect
                    name={`items[${index}].scan`}
                    size="small"
                    label="Scan Type"
                    InputLabelProps={{ shrink: true }}
                  >
                    <MenuItem value="passive">Passive Recurring Scan</MenuItem>
                    <MenuItem value="one-time">One Time Scan</MenuItem>
                  </RHFSelect>
                </>
              )}

              {values.items[index].service === 'Network' && (
                <>
                  <RHFTextField
                    size="small"
                    name={`items[${index}].ipAddress`}
                    label="IP Address"
                    InputLabelProps={{ shrink: true }}
                  />
                  <RHFSelect
                    name={`items[${index}].scan`}
                    size="small"
                    label="Scan Type"
                    InputLabelProps={{ shrink: true }}
                  >
                    <MenuItem value="passive">Passive Recurring Scan</MenuItem>
                    <MenuItem value="one-time">One Time Scan</MenuItem>
                  </RHFSelect>
                </>
              )}

              {values.items[index].service === 'Phishing' && (
                <>
                  
                  <RHFTextField
                    size="small"
                    name={`items[${index}].description`}
                    label="Description"
                    InputLabelProps={{ shrink: true }}
                  />
                </>
              )}

              {values.items[index].service === 'Phishing' && (
                <>
                  <RHFTextField
                    size="small"
                    name={`items[${index}].title`}
                    label="Title" // Add "Title" for Phishing
                    InputLabelProps={{ shrink: true }}
                  />
                </>
              )}

              {values.items[index].service === 'OSINT' && (
                <>
                  <RHFTextField
                    size="small"
                    name={`items[${index}].description`}
                    label="Description"
                    InputLabelProps={{ shrink: true }}
                  />
                  <RHFTextField
                    size="small"
                    name={`items[${index}].searchTerms`}
                    label="Search Terms"
                    InputLabelProps={{ shrink: true }}
                  />
                </>
              )}

              {values.items[index].service === 'OSINT' && (
                <>
                  <RHFTextField
                    size="small"
                    name={`items[${index}].title`}
                    label="Title" // Add "Title" for OSINT
                    InputLabelProps={{ shrink: true }}
                  />
                </>
              )}
            </Stack>

            <Button
              size="small"
              color="error"
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              onClick={() => handleRemove(index)}
            >
              Remove
            </Button>
          </Stack>
        ))}
      </Stack>

      <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

      <Stack
        spacing={3}
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'flex-end', md: 'center' }}
      >
        <Button
          size="small"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleAdd}
          sx={{ flexShrink: 0 }}
        >
          Add Item
        </Button>
      </Stack>
    </Box>
  );
}
