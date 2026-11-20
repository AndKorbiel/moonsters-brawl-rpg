import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';

import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../firebase-auth';
import { useDispatch } from 'react-redux';

import { setStatusCode } from '../redux/actions/game';
import { GAME_STATUS } from '../redux/constants/game';

const authErrorMessages: Record<string, string> = {
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/invalid-credential': 'The email or password is incorrect.',
  'auth/user-not-found': 'The email or password is incorrect.',
  'auth/wrong-password': 'The email or password is incorrect.',
  'auth/user-disabled': 'This account has been disabled. Contact support.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/network-request-failed':
    'A network error occurred. Check your connection and try again.',
  'auth/weak-password': 'Choose a stronger password.',
  'auth/missing-password': 'Enter your password.',
  'auth/operation-not-allowed':
    'Email and password authentication is unavailable. Please try again later.',
};

function getAuthErrorMessage(error: unknown, action: 'login' | 'register') {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? error.code
      : undefined;

  if (typeof code === 'string' && authErrorMessages[code]) {
    return authErrorMessages[code];
  }

  return action === 'login'
    ? 'Unable to log in. Please try again.'
    : 'Unable to create your account. Please try again.';
}

export function Login() {
  const [showRegisterForm, switchForm] = useState(false);
  const [credentials, setCredentials] = useState({ login: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    let login = credentials.login;
    let password = credentials.password;

    if (e.target.id === 'login') {
      login = e.target.value;
    } else if (e.target.id === 'password') {
      password = e.target.value;
    }

    setCredentials({
      login: login,
      password: password,
    });
    setErrorMessage('');
    setSuccessMessage('');
  };

  const register = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await createUserWithEmailAndPassword(
        auth,
        credentials.login,
        credentials.password,
      );
      setSuccessMessage('Account created successfully.');
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error, 'register'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const login = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await signInWithEmailAndPassword(
        auth,
        credentials.login,
        credentials.password,
      );
      dispatch(setStatusCode(GAME_STATUS.MAIN_MENU));
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error, 'login'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleForm = () => {
    switchForm(!showRegisterForm);
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <Box sx={{ maxWidth: 900 }} className="centered text-centered font-white">
      <Card className="padlrextra">
        <h1>{showRegisterForm ? 'Register' : 'Login'}</h1>
        <TextField
          fullWidth
          margin="dense"
          id="login"
          label="User email"
          type="email"
          variant="standard"
          className="custom-input"
          onChange={(e) => handleChange(e)}
        />

        <TextField
          fullWidth
          margin="dense"
          id="password"
          label="Password"
          type="password"
          variant="standard"
          onChange={(e) => handleChange(e)}
        />

        <Button
          variant="contained"
          size="large"
          fullWidth={true}
          sx={{ marginTop: 5 }}
          onClick={showRegisterForm ? register : login}
          disabled={isSubmitting}
        >
          Submit
        </Button>

        {errorMessage && (
          <Alert severity="error" sx={{ marginTop: 2 }}>
            {errorMessage}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ marginTop: 2 }}>
            {successMessage}
          </Alert>
        )}

        <Link
          sx={{ marginTop: 5 }}
          component="button"
          variant="body2"
          onClick={toggleForm}
        >
          {showRegisterForm
            ? 'Already registered? Login here'
            : "Haven't registered yet? Register here"}
        </Link>
      </Card>
    </Box>
  );
}
