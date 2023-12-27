import PropTypes from 'prop-types';
import { useEffect, useCallback, useState } from 'react';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
//
import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

const loginPaths = {
  jwt: paths.auth.jwt.login,
  auth0: paths.auth.auth0.login,
  amplify: paths.auth.amplify.login,
  firebase: paths.auth.firebase.login,
};

// ----------------------------------------------------------------------

export default function AuthGuard({ children }) {
  const router = useRouter();

  const { authenticated, method } = useAuthContext();

  const [checked, setChecked] = useState(false);

  const check = useCallback(() => {
    console.log("Checking authentication status:", authenticated);
    console.log("Authentication method:", method);
    
    if (!authenticated) {
      const searchParams = new URLSearchParams({
        returnTo: window.location.pathname,
      }).toString();
  
      const loginPath = loginPaths[method];
      const href = `${loginPath}?${searchParams}`;
      
      console.log("Redirecting to:", href);
      
      router.replace(href);
    } else {
      console.log("User is authenticated.");
      setChecked(true);
    }
  }, [authenticated, method, router]);
  

  useEffect(() => {
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}

AuthGuard.propTypes = {
  children: PropTypes.node,
};
