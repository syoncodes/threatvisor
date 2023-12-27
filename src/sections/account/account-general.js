import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch } from 'src/components/hook-form';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { useAuthContext } from 'src/auth/hooks';

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const password = useBoolean();
  const [userData, setUserData] = useState(null);

  const UpdateUserSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    photoURL: Yup.mixed().nullable().required('Avatar is required'),
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    organizationID: Yup.mixed(),
    zipCode: Yup.string().required('Zip code is required'),
    about: Yup.string().required('About is required'),
    isPublic: Yup.boolean(),
  });

  const defaultValues = {
    userId: '',
    firstName: '',
    lastName: '',
    email: '',
    organizationID: '',
    photoURL: null,
    country: '',
    state: '',
    city: '',
    zipCode: '',
    about: '',
    isPublic: false,
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const { getValues } = methods;

  // Custom handler for onClick
  const handleClick = async () => {
    const formData = getValues();
    try {
      console.log('Submitting data:', formData);
      const response = await axios.post('http://localhost:8080/api/users/update-user', formData);
      console.log('API response:', response);
      enqueueSnackbar('Update success!');
      console.info('Updated data:', formData);
    } catch (error) {
      console.error('Error updating user data:', error);
      enqueueSnackbar('Failed to update user data', { variant: 'error' });
    }
  };

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = sessionStorage.getItem('_id'); // Fetch userId from sessionStorage
        console.log('_id:', userId);  // Log the _id
  
        if (userId) {
          const response = await axios.post('http://localhost:8080/api/users/fetch-user', { userId });
          setUserData(response.data);
          Object.keys(defaultValues).forEach(key => {
            setValue(key, response.data[key] || defaultValues[key], { shouldValidate: true });
          });
          setValue('userId', userId, { shouldValidate: true }); // Set userId in the form
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  }, [setValue]);
  
  
  const onSubmit = handleSubmit(async (data) => {
    try {
      const userId = sessionStorage.getItem('_id');
      const formData = {
        userId: userId,
        ...data,
      };
      
      console.log('Submitting data:', formData);
  
      // Debugging statement to check the userId being sent
      console.log('userId being sent:', formData.userId);
  
      const response = await axios.post('http://localhost:8080/api/users/update-user', formData);
      console.log('API response:', response);
      enqueueSnackbar('Update success!');
      console.info('Updated data:', data);
    } catch (error) {
      console.error('Error updating user data:', error);
      enqueueSnackbar('Failed to update user data', { variant: 'error' });
    }
  });
  
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={10}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="firstName" label="First Name" />
              <RHFTextField name="lastName" label="Last Name" />
              <RHFTextField name="email" label="Email Address" />
              
              <RHFTextField
                name="organizationID"
                label="Organization ID"
                type={password.value ? 'text' : 'organizationID'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={password.onToggle} edge="end">
                        <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {/* Additional form fields as per requirement */}
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton onClick={handleClick} variant="contained" loading={isSubmitting}>
            Save Changes
          </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
