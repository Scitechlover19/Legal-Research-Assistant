import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import SignIn from './SignIn';
import Home from './Home';
import { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

function App() {
  const [user] = useAuthState(auth);

  return (
    <Routes>
      {/* Redirect root ("/") to "/signin" */}
      <Route path="/" element={<Navigate to="/signin" />} />

      <Route path="/signin" element={<SignIn />} />

      {/* Protected Route */}
      <Route path="/home" element={user ? <Home /> : <Navigate to="/signin" />} />

      {/* Catch-all Route */}
      <Route path="*" element={<Navigate to="/signin" />} />
    </Routes>
  );
}

export default App;
