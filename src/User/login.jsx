import { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

export default function Login({ auth }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:3000/api/v1/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: ({ email: form.email, password: form.password }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message || data?.error || 'Login failed');
      }

      const token = data?.token || data?.accessToken || data?.jwt;
      if (!token) throw new Error('Token not received');

      localStorage.setItem('token', token);
      auth.setToken(token);

      window.location.href = '/jobs';
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
        <TextField label="Email" name="email" value={form.email} onChange={handleChange} type="email" required />
        <TextField
          label="Password"
          name="password"
          value={form.password}
          onChange={handleChange}
          type="password"
          required
        />

        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}

        <Button variant="contained" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>

        <Button variant="text" onClick={() => (window.location.href = '/signup')}>
          Create an account
        </Button>
      </Box>
    </Container>
  );
}

