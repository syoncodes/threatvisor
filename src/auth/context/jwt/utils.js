// routes
import { paths } from 'src/routes/paths';
// utils
import axios from 'src/utils/axios';

// ----------------------------------------------------------------------

function jwtDecode(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('')
  );

  return JSON.parse(jsonPayload);
}

// ----------------------------------------------------------------------

export const isValidToken = (accessToken) => {
  if (!accessToken) {
    console.log("No access token provided");
    return false;
  }

  const decoded = jwtDecode(accessToken);
  const currentTime = Date.now() / 1000;

  console.log("Token Expiry Time:", decoded.exp);
  console.log("Current Time:", currentTime);

  return decoded.exp > currentTime;
};

// ----------------------------------------------------------------------

export const tokenExpired = (exp) => {
  // eslint-disable-next-line prefer-const
  let expiredTimer;

  const currentTime = Date.now();

  // Test token expires after 10s
  // const timeLeft = currentTime + 10000 - currentTime; // ~10s
  const timeLeft = exp * 1000 - currentTime;

  clearTimeout(expiredTimer);

  expiredTimer = setTimeout(() => {
    alert('Token expired');

    sessionStorage.removeItem('accessToken');

    window.location.href = paths.auth.jwt.login;
  }, timeLeft);
};

// ----------------------------------------------------------------------

export const setSession = (accessToken) => {
  console.log("Setting session with token:", accessToken);
  if (accessToken) {
    sessionStorage.setItem('accessToken', accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    const { exp } = jwtDecode(accessToken);
    tokenExpired(exp);
  } else {
    console.log("Removing session.");
    sessionStorage.removeItem('accessToken');
    delete axios.defaults.headers.common.Authorization;
  }
};
