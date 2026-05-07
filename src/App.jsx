import { useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './User/signUp.jsx';
import Login from './User/login.jsx';
import Job from './Job/job.jsx';
import AppLayout from './components/AppLayout.jsx';

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const auth = useMemo(() => ({
    token,
    setToken: (t) => {
      setToken(t);
      if (t) localStorage.setItem('token', t);
      else localStorage.removeItem('token');
    },
  }), []);

  return (
    <AppLayout>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp auth={auth} />} />
          <Route path="/login" element={<Login auth={auth} />} />
          <Route
            path="/jobs"
            element={
              token ? (
                <Job auth={auth} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/" element={<Navigate to={token ? '/jobs' : '/login'} replace />} />
          <Route path="*" element={<Navigate to={token ? '/jobs' : '/login'} replace />} />
        </Routes>
      </BrowserRouter>
    </AppLayout>
  );
}


