import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import LoginModal from './components/shared/modals/LoginModal';
import RegisterModal from './components/shared/modals/RegisterModal';
import VerifyEmail from './pages/VerifyEmail';
import ToasterProvider from './providers/ToasterProvider';

function App() {
  return (
    <BrowserRouter>
      <ToasterProvider />
      <RegisterModal />
      <LoginModal />
      <Navbar />

      <Routes>
        <Route path="/auth/verify-email/:token" element={
          <VerifyEmail />
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
