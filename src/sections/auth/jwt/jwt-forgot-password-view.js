'use client';

import React from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
import { PasswordIcon } from 'src/assets/icons';
import Iconify from 'src/components/iconify';

export default function JwtForgotPasswordView() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  });

  const defaultValues = {
    email: '',
  };

  const methods = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/reset-password', data);
      if (response.status === 200) {
        enqueueSnackbar('Password reset email sent successfully', { variant: 'success' });
      } else {
        enqueueSnackbar('Failed to send password reset email', { variant: 'error' });
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 404) {
        enqueueSnackbar('User not found', { variant: 'error' });
      } else {
        enqueueSnackbar('Error sending password reset email', { variant: 'error' });
      }
    }
  });

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      <RHFTextField name="email" label="Email address" />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Send Request
      </LoadingButton>

      <Link
        component={RouterLink}
        href={paths.auth.jwt.login}
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
      <PasswordIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ mt: 3, mb: 5 }}>
        <Typography variant="h3">Forgot your password?</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Please enter the email address associated with your account and We will email you a link
          to reset your password.
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
