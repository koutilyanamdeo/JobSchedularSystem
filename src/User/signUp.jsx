import { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

export default function SignUp({ auth }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
  });
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
      const res = await fetch('http://localhost:3000/api/v1/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          phoneNumber: form.phoneNumber || undefined,
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Signup failed');
      }

      // redirect to login
      window.location.href = '/login';
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Sign Up
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
        <TextField label="Name" name="name" value={form.name} onChange={handleChange} required />
        <TextField label="Email" name="email" value={form.email} onChange={handleChange} type="email" required />
        <TextField
          label="Password"
          name="password"
          value={form.password}
          onChange={handleChange}
          type="password"
          required
        />
        <TextField
          label="Phone Number"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
        />

        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}

        <Button variant="contained" type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Account'}
        </Button>

        <Button variant="text" onClick={() => (window.location.href = '/login')}>
          Already have an account? Login
        </Button>
      </Box>
    </Container>
  );
}

