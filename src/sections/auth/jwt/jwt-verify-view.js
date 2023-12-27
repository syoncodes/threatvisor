'use client';
import * as Yup from 'yup';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useCountdownSeconds } from 'src/hooks/use-countdown';

import { useAuthContext } from 'src/auth/hooks';
import { EmailInboxIcon } from 'src/assets/icons';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFCode, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function JwtVerifyView() {
  const router = useRouter();
  const { register } = useAuthContext(); // Replace with the actual registration function from your auth context
  const { countdown, counting, startCountdown } = useCountdownSeconds(60);

  // Load the registration data from local storage
  const registrationData = JSON.parse(localStorage.getItem('registrationData'));

  const VerifySchema = Yup.object().shape({
    code: Yup.string().min(6, 'Code must be at least 6 characters').required('Code is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  });

  const defaultValues = {
    code: '',
    email: registrationData?.email || '', // Set email from registration data or leave it empty
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(VerifySchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    watch, // Import the watch function
  } = methods;

  const values = watch();

  useEffect(() => {
    // Redirect to login page if registration data is missing
    if (!registrationData) {
      router.push(paths.auth.amplify.login);
    }
  }, [router, registrationData]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!registrationData) {
        console.error('Registration data is missing');
        return;
      }
  
      // Check if the entered verification code matches the one from registration
      if (data.code !== registrationData.verificationCode) {
        console.error('Incorrect verification code:', data.code);
        return;
      }
  
      console.log('Attempting to confirm registration with email:', registrationData.email);
      
      // Attempt to register the user with the provided email and code
      await register?.(registrationData.email, registrationData.password, registrationData.firstName, registrationData.lastName, registrationData.organizationId);
      
      // Registration was successful, handle it accordingly
      console.log('User registered successfully');
      
      // Redirect the user to the login page or any other desired location
      router.push(paths.auth.amplify.login);
    } catch (error) {
      console.error('Error during registration confirmation:', error);
    }
  });

  const handleResendCode = useCallback(async () => {
    try {
      startCountdown();
      await resendCodeRegister?.(registrationData.email);
    } catch (error) {
      console.error(error);
    }
  }, [ startCountdown, registrationData]);

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      <RHFTextField
        name="email"
        label="Email"
        placeholder="example@gmail.com"
        InputLabelProps={{ shrink: true }}
        disabled // Disable the email field since it's for display only
      />

      <RHFCode name="code" />

      <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
        Verify
      </LoadingButton>

      <Typography variant="body2">
        {`Don’t have a code? `}
        <Link
          variant="subtitle2"
          onClick={handleResendCode}
          sx={{
            cursor: 'pointer',
            ...(counting && {
              color: 'text.disabled',
              pointerEvents: 'none',
            }),
          }}
        >
          Resend code {counting && `(${countdown}s)`}
        </Link>
      </Typography>

      <Link
        component={RouterLink}
        href={paths.auth.amplify.login}
        color="inherit"
        variant="subtitle2"
        sx={{
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={16} />
        Return to sign in
      </Link>
    </Stack>
  );

  const renderHead = (
    <>
      <EmailInboxIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ mt: 3, mb: 5 }}>
        <Typography variant="h3">Please check your email!</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          We have emailed a 6-digit confirmation code to {registrationData?.email}, please enter the code in the below
          box to verify your email.
        </Typography>
      </Stack>
    </>
  );

  return (
    <>
      {renderHead}

      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </FormProvider>
    </>
  );
}