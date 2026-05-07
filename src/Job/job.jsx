import { useEffect, useMemo, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  IconButton,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const API_BASE = 'http://localhost:3000/api/v1';

export default function Job({ auth }) {
  const token = auth.token;
  const headers = useMemo(
    () => ({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }),
    [token]
  );

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    id: null,
    type: 'email',
    frequencyType: 'once',
    payload: { email: '', subject: '', body: '' },
    nextRunTime: new Date(Date.now() - 60 * 1000).toISOString(),
    status: 'PENDING',
  });

  const fetchJobs = async () => {
    try {
      setError('');
      const res = await fetch(`${API_BASE}/job`, { headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to fetch jobs');
      setJobs(data?.data || data || []);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('payload.')) {
      const key = name.split('.')[1];
      setForm((p) => ({ ...p, payload: { ...p.payload, [key]: value } }));
      return;
    }
    setForm((p) => ({ ...p, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      id: null,
      type: 'email',
      frequencyType: 'once',
      payload: { email: '', subject: '', body: '' },
      nextRunTime: new Date(Date.now() - 60 * 1000).toISOString(),
      status: 'PENDING',
    });
  };

  const submit = async () => {
    setLoading(true);
    setError('');
    try {
      const body = {
        type: form.type,
        frequencyType: form.frequencyType,
        payload: form.payload,
        nextRunTime: form.nextRunTime,
      };

      if (form.id) {
        const res = await fetch(`${API_BASE}/job/${form.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(body),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) throw new Error(data?.message || 'Update failed');
      } else {
        const res = await fetch(`${API_BASE}/job`, {
          method: 'POST',
          headers,
          body: JSON.stringify(body),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) throw new Error(data?.message || 'Create failed');
      }

      await fetchJobs();
      resetForm();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const onEdit = (job) => {
    setForm({
      id: job.id,
      type: job.type,
      frequencyType: job.frequencyType,
      payload: job.payload || { email: '', subject: '', body: '' },
      nextRunTime: new Date(job.nextRunTime).toISOString().slice(0, 19) + 'Z',
      status: job.status,
    });
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this job?')) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/job/${id}`, { method: 'DELETE', headers });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.message || 'Delete failed');
      await fetchJobs();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Jobs</Typography>
        <Button
          variant="outlined"
          onClick={() => {
            localStorage.removeItem('token');
            auth.setToken(null);
            window.location.href = '/login';
          }}
        >
          Logout
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" mb={1}>
          {form.id ? 'Update Job' : 'Create Job'}
        </Typography>
        <Box display="grid" gap={2}>
          <TextField label="Type" name="type" value={form.type} onChange={handleChange} />
          <TextField
            label="Frequency Type"
            name="frequencyType"
            value={form.frequencyType}
            onChange={handleChange}
          />
          <TextField
            label="Next Run Time (ISO)"
            name="nextRunTime"
            value={form.nextRunTime}
            onChange={handleChange}
          />

          <TextField
            label="Payload Email"
            name="payload.email"
            value={form.payload.email}
            onChange={handleChange}
          />
          <TextField
            label="Payload Subject"
            name="payload.subject"
            value={form.payload.subject}
            onChange={handleChange}
          />
          <TextField
            label="Payload Body"
            name="payload.body"
            value={form.payload.body}
            onChange={handleChange}
          />

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          <Button variant="contained" onClick={submit} disabled={loading}>
            {loading ? 'Please wait...' : form.id ? 'Update' : 'Create'}
          </Button>
          {form.id && (
            <Button variant="text" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </Box>
      </Paper>

      <Paper sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Frequency</TableCell>
              <TableCell>Next Run</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell>{job.id}</TableCell>
                <TableCell>{job.type}</TableCell>
                <TableCell>{job.frequencyType}</TableCell>
                <TableCell>{job.nextRunTime ? new Date(job.nextRunTime).toLocaleString() : '-'}</TableCell>
                <TableCell>{job.status}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => onEdit(job)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => onDelete(job.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {jobs.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No jobs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}

