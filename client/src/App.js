import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Loader from './components/shared/Loader/Loader';
import LoginModal from './components/shared/modals/LoginModal';
import RegisterModal from './components/shared/modals/RegisterModal';
import SearchModal from './components/shared/modals/SearchModal';
import { useLoading } from './hooks/useLoading';
import BookingsPage from './pages/BookingsPage';
import Home from './pages/Home';
import HotelPage from './pages/HotelPage';
import RoomPage from './pages/RoomPage';
import VerifyEmail from './pages/VerifyEmail';
import ToasterProvider from './providers/ToasterProvider';

function App() {
  const { loading } = useLoading();

  return (

    loading ? (<Loader />) :
      (<BrowserRouter>
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
        </Routes>
      </BrowserRouter>)
  );
}

export default App;
