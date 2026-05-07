import { AppBar, Toolbar, Typography, Button } from '@mui/material';

export default function JobsNavbar({ auth }) {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Jobs
        </Typography>
        <Button
          color="inherit"
          onClick={() => {
            localStorage.removeItem('token');
            auth.setToken(null);
            window.location.href = '/login';
          }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}

