import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Search from './pages/search/Search';
import Swaps from './pages/swaps/Swaps';
import NewSwapRequest from './pages/swaps/NewSwapRequest';
import Profile from './pages/profile/Profile';
import Matches from './pages/ai/Matches';

const HomeRoute = () => {
  const { user } = useAuth();
  return user ? <Navigate to="/search" replace /> : <Landing />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/search" element={
        <ProtectedRoute><Search /></ProtectedRoute>
      } />
      <Route path="/matches" element={
        <ProtectedRoute><Matches /></ProtectedRoute>
      } />
      <Route path="/swaps" element={
        <ProtectedRoute><Swaps /></ProtectedRoute>
      } />
      <Route path="/swaps/new/:receiverId" element={
        <ProtectedRoute><NewSwapRequest /></ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute><Profile /></ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;