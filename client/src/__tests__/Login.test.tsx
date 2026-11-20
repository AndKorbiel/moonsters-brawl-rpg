import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { createUserWithEmailAndPassword, signInWithEmailAndPassword, dispatch } =
  vi.hoisted(() => ({
    createUserWithEmailAndPassword: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    dispatch: vi.fn(),
  }));

vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
}));
vi.mock('../firebase-auth', () => ({ auth: {} }));
vi.mock('react-redux', () => ({ useDispatch: () => dispatch }));

import { Login } from '../components/Login';

const enterCredentials = () => {
  fireEvent.change(screen.getByRole('textbox', { name: 'User email' }), {
    target: { value: 'player@example.com' },
  });
  fireEvent.change(screen.getByLabelText('Password'), {
    target: { value: 'safe-password' },
  });
};

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uses a friendly message for invalid login credentials', async () => {
    signInWithEmailAndPassword.mockRejectedValue({
      code: 'auth/invalid-credential',
      message: 'Firebase internal error details',
    });

    render(<Login />);
    enterCredentials();
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(
      await screen.findByText('The email or password is incorrect.'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Firebase internal error details'),
    ).not.toBeInTheDocument();
  });

  it('uses a generic safe message for unknown registration errors', async () => {
    createUserWithEmailAndPassword.mockRejectedValue({
      code: 'auth/unexpected-error',
      message: 'Private provider details',
    });

    render(<Login />);
    fireEvent.click(
      screen.getByRole('button', {
        name: "Haven't registered yet? Register here",
      }),
    );
    enterCredentials();
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(
      await screen.findByText(
        'Unable to create your account. Please try again.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Private provider details'),
    ).not.toBeInTheDocument();
  });

  it('shows account-creation success rather than claiming a user was registered', async () => {
    createUserWithEmailAndPassword.mockResolvedValue({});

    render(<Login />);
    fireEvent.click(
      screen.getByRole('button', {
        name: "Haven't registered yet? Register here",
      }),
    );
    enterCredentials();
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(
      await screen.findByText('Account created successfully.'),
    ).toBeInTheDocument();
    expect(screen.queryByText('New user registered')).not.toBeInTheDocument();
  });

  it('returns to the main menu after a successful login', async () => {
    signInWithEmailAndPassword.mockResolvedValue({});

    render(<Login />);
    enterCredentials();
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      {},
      'player@example.com',
      'safe-password',
    );
    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith({
        type: 'SET_STATUS_CODE',
        payload: 0,
      });
    });
  });
});
