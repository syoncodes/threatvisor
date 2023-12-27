import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Stack from '@mui/material/Stack';

// ----------------------------------------------------------------------

export default function InvoiceNewEditStatusDate() {
  const { control } = useFormContext();

  return (
    <Stack
      spacing={2}
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ p: 3, bgcolor: 'background.neutral' }}
    >
      <Controller
        name="startDate"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <DatePicker
            label="Start Date"
            value={field.value}
            onChange={(newValue) => {
              field.onChange(newValue);
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!error,
                helperText: error?.message,
              },
            }}
          />
        )}
      />
    </Stack>
  );
}
