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
import { auth } from '../firebase-config';
import { useDispatch } from 'react-redux';

import { setStatusCode } from '../redux/actions/game';

export function Login() {
  const [showRegisterForm, switchForm] = useState(false);
  const [credentials, setCredentials] = useState({ login: '', password: '' });
  const [errorMessage, setMessage] = useState('');
  const [status, setStatus] = useState(false);
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
  };

  const register = async () => {
    try {
      await createUserWithEmailAndPassword(
        auth,
        credentials.login,
        credentials.password,
      );
      setStatus(true);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const login = async () => {
    try {
      await signInWithEmailAndPassword(
        auth,
        credentials.login,
        credentials.password,
      );
      setStatus(true);
      dispatch(setStatusCode(0));
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <Box maxWidth="md" className="centered text-centered font-white">
      <Card className="padlrextra">
        <h1>{showRegisterForm ? 'Register' : 'Login'}</h1>
        <TextField
          fullWidth
          margin="dense"
          id="login"
          label="User email"
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
        >
          Submit
        </Button>

        {errorMessage && status === false && (
          <Alert severity="error" sx={{ marginTop: 2 }}>
            {errorMessage}
          </Alert>
        )}

        {status === true && (
          <Alert severity="success" sx={{ marginTop: 2 }}>
            New user registered
          </Alert>
        )}

        <Link
          sx={{ marginTop: 5 }}
          component="button"
          variant="body2"
          onClick={() => switchForm(!showRegisterForm)}
        >
          {showRegisterForm
            ? 'Already registered? Login here'
            : "Haven't registered yet? Register here"}
        </Link>
      </Card>
    </Box>
  );
}
