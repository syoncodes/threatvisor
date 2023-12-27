'use client';

import PropTypes from 'prop-types';
// auth
import { GuestGuard } from 'src/auth/guard';
// components
import AuthClassicLayout from 'src/layouts/auth/classic';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  return (
    <GuestGuard>
      <AuthClassicLayout title="Enhance your cybersecurity operations with ThreatVisor.">
        {children}
      </AuthClassicLayout>
    </GuestGuard>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};
