'use client';

import PropTypes from 'prop-types';
import { useEffect, useReducer, useCallback, useMemo } from 'react';
// utils
import axios, { endpoints } from 'src/utils/axios';
//
import { AuthContext } from './auth-context';
import { isValidToken, setSession } from './utils';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

const initialState = {
  user: null,
  loading: true,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        const response = await axios.get(endpoints.auth.me);

        const { user } = response.data;

        dispatch({
          type: 'INITIAL',
          payload: {
            user,
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email, password) => {
    try {
      // API call using axios to your own backend
      const url = "https://threatvisor-api.vercel.app/api/auth";
      const { data: res } = await axios.post(url, { email, password });
      
      // Use the token to set the session
      setSession(res.accessToken);
      
      // Save the token and _id to session storage
      sessionStorage.setItem(STORAGE_KEY, res.accessToken);
      sessionStorage.setItem('userRole', res.role);
      sessionStorage.setItem('userName', res.username);
      sessionStorage.setItem('_id', res._id); // Save the _id

      console.log('_id:', res._id); // Log the _id to the console
  
      // Dispatch user (you'll need to adjust this part based on your backend response)
      dispatch({
        type: 'LOGIN',
        payload: {
          user: res.user, // Adjust this based on your backend response
          username: res.username,
          role: res.role,
          _id: res._id, // Include the _id in the payload
        },
      });
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        // Handle 4xx and 5xx errors here
        console.error(error.response.data.message);
      } else {
        // Handle other errors
        console.error('An error occurred while logging in:', error);
      }
    }
  }, []);


  // REGISTER
  const register = useCallback(async (email, password, firstName, lastName, organizationId = null) => {
    try {
      // API call using axios to your own backend for registration
      const url = "https://threatvisor-api.vercel.app/api/users";  // Adjust this URL to your server's registration endpoint
      const userData = {
        email,
        password,
        firstName,
        lastName,
      };
  
      // Conditionally add organizationId to userData
      if (organizationId) {
        userData.organizationId = organizationId;
      }
      console.log("User data:", userData);
      const { data: res } = await axios.post(url, userData);
  
      // Use the token to set the session
      setSession(res.accessToken);  // Adjust this based on your backend response
  
      // Dispatch user
      dispatch({
        type: 'REGISTER',
        payload: {
          user: res.user,  // Adjust this based on your backend response
        },
      });
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        // Handle 4xx and 5xx errors here
        console.error(error.response.data.message);
      } else {
        // Handle other errors
        console.error('An error occurred while registering:', error);
      }
    }
  }, []);
  

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  const orgregister = useCallback(async (email, password, firstName, lastName, organizationName = null) => {
    try {
      // Log the request payload for debugging
      console.log("Sending request with payload:", {
        email,
        password,
        firstName,
        lastName,
        organizationName,
      });

      // API call using axios to your own backend for registration
      const url = "https://threatvisor-api.vercel.app/api/orgusers";  // Adjust this URL to your server's registration endpoint
      const userData = {
        email,
        password,
        firstName,
        lastName,
        organizationName,
      };
      const { data: res } = await axios.post(url, userData);

      // Use the token to set the session
      setSession(res.accessToken);  // Adjust this based on your backend response

      // Dispatch user
      dispatch({
        type: 'REGISTER',
        payload: {
          user: res.user,  // Adjust this based on your backend response
        },
      });
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        // Handle 4xx and 5xx errors here
        console.error(error.response.data.message);
      } else {
        // Handle other errors
        console.error('An error occurred while registering:', error);
      }
    }
  }, []);



  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      register,
      orgregister,
      logout,
    }),
    [login, logout, register, orgregister, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
