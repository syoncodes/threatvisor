'use client';

'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import { useBoolean } from 'src/hooks/use-boolean';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useSearchParams, useRouter } from 'src/routes/hooks';
import { PATH_AFTER_LOGIN } from 'src/config-global';
import { useAuthContext } from 'src/auth/hooks';
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import axios from 'axios'; // Import axios or use another HTTP client

export default function JwtOrganizationView() {
  const { orgregister } = useAuthContext();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const password = useBoolean();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    email: Yup.string()
      .required('Email is required')
      .matches(emailRegex, 'Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
    organizationName: Yup.string().notRequired(),
  });

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    organizationName: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
    if (!passwordRegex.test(data.password)) {
      setErrorMsg('Password must have at least 1 capital letter, 1 lowercase letter, 1 special character, 1 number, and be at least 8 characters in length');
      return;
    }
  
    try {
      // Check if the user with the provided email already exists
      const userExists = await checkUserExists(data.email);
      if (userExists) {
        setErrorMsg('A user with this email already exists');
        return;
      }
    
    try {
      // Generate a random verification code
      const verificationCode = generateVerificationCode();
  
      // Save the registration data locally (for example, in localStorage)
      const registrationData = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
        organizationName: data.organizationName,
        verificationCode: verificationCode,
        // Add other registration data here
      };
      localStorage.setItem('registrationData', JSON.stringify(registrationData));
  
      // Send a POST request to your Express server to send the verification email
      await sendVerificationEmail(data.email, verificationCode);
  
      // Use history.push to navigate to the verification page
      router.push('/auth/jwt/orgverify');
    } catch (error) {
      console.error(error);
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const checkUserExists = async (email) => {
    try {
      const response = await axios.get('https://threatvisor-api.vercel.app/api/auth/checkUserExists', {
        params: { email }, // Pass email as a query parameter
      });
      return response.data.exists; // Assuming the API returns a JSON object with a boolean field 'exists'
    } catch (error) {
      throw new Error('Failed to check user existence');
    }
  };
  
  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendVerificationEmail = async (recipientEmail, verificationCode) => {
    try {
      const response = await axios.post('https://threatvisor-api.vercel.app/api/auth/verify', {
        email: recipientEmail,
        verificationCode: verificationCode,
      });

      if (response.status === 200) {
        console.log('Verification email sent successfully');
      } else {
        throw new Error('Failed to send verification email');
      }
    } catch (error) {
      throw new Error('Failed to send verification email');
    }
  };

  const renderForm = (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={2.5}>
        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="firstName" label="First name" />
          <RHFTextField name="lastName" label="Last name" />
        </Stack>

        <RHFTextField name="email" label="Email address" />

        <RHFTextField
          name="password"
          label="Password"
          type={password.value ? 'text' : 'password'}
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

        <RHFTextField name="organizationName" label="Organization Name" />

        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Create account
        </LoadingButton>
      </Stack>
    </FormProvider>
  );

  return (
    <>
      <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
        <Typography variant="h4">Secure Your Organization Today</Typography>
        <Stack direction="column" spacing={1}>
          <Typography variant="body2">Admin Account Creation</Typography>
          <Stack direction="row" spacing={0.5}>
            <Typography variant="body2">Already have an account?</Typography>
            <Link href={paths.auth.jwt.login} component={RouterLink} variant="subtitle2">
              Sign in
            </Link>
          </Stack>
        </Stack>
      </Stack>

      {renderForm}

      <Typography
        component="div"
        sx={{
          color: 'text.secondary',
          mt: 2.5,
          typography: 'caption',
          textAlign: 'center',
        }}
      >
        {'By signing up, I agree to '}
        <Link underline="always" color="text.primary">
          Terms of Service
        </Link>
        {' and '}
        <Link underline="always" color="text.primary">
          Privacy Policy
        </Link>
        .
      </Typography>
    </>
  );
}
