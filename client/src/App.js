import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import LoginModal from './components/shared/modals/LoginModal';
import RegisterModal from './components/shared/modals/RegisterModal';
import SearchModal from './components/shared/modals/SearchModal';
import BookingsPage from './pages/BookingsPage';
import CheckoutSuccess from './pages/CheckoutSuccess';
import Home from './pages/Home';
import HotelPage from './pages/HotelPage';
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
        <Route path='/user/bookings' element={<BookingsPage />} />
        <Route path='/checkout-success/:bookingId/:transactionId/:amount' element={<CheckoutSuccess />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
