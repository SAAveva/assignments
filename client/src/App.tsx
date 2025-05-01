import { useState } from 'react'
import './App.css'

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout.jsx';
import { LoginPage } from './components/LoginPage.jsx';
import { StudentsPage } from './components/StudentsPage.jsx';
import { AssignmentsPage } from './components/AssignmentPage.jsx';

import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './hooks/useAuth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/" element={<Navigate to="/students" replace />} />
              <Route path="students" element={<StudentsPage />} />
              <Route path="assignments" element={<AssignmentsPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </AuthProvider>
    </BrowserRouter>
  );
}
/*

*/

export default App
