import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Search from './pages/search/Search';
import Swaps from './pages/swaps/Swaps';
import Profile from './pages/profile/Profile';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={
            <ProtectedRoute><Search /></ProtectedRoute>
          } />
          <Route path="/swaps" element={
            <ProtectedRoute><Swaps /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/search" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;