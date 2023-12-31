import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Navigate, Redirect, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import LoginModal from './components/shared/modals/LoginModal';
import RegisterModal from './components/shared/modals/RegisterModal';
import SearchModal from './components/shared/modals/SearchModal';
import BookingsPage from './pages/BookingsPage';
import Home from './pages/Home';
import HotelPage from './pages/HotelPage';
import NotFound from './pages/NotFound';
import RoomPage from './pages/RoomPage';
import VerifyEmail from './pages/VerifyEmail';
import ToasterProvider from './providers/ToasterProvider';

function App() {

  return (
    <BrowserRouter>
      <ToasterProvider />
      <RegisterModal />
      <LoginModal />
      <SearchModal />
      <Navbar />

      <Routes>
        <Route path='/' element={<Home />} />

        <Route path="/auth/verify-email/:token" element={
          <VerifyEmail />
        } />

        <Route path='/hotel/:hotelSlug' element={<HotelPage />} />
        <Route path='/room/:hotelId/:roomSlug' element={<RoomPage />} />
        <Route path='/user/bookings' element={
          <ProtectedRoute>
            <BookingsPage />
          </ProtectedRoute>
        } />

        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}


const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.persistedAuthReducer);

  const location = useLocation();
  return !user ? (
    <Navigate to="/" state={{ from: location }} />
  ) : (
    children
  );
};


export default App;
