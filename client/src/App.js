import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import LoginModal from './components/shared/modals/LoginModal';
import RegisterModal from './components/shared/modals/RegisterModal';
import ToasterProvider from './providers/ToasterProvider';

function App() {
  return (
    <BrowserRouter>
      <ToasterProvider />
      <RegisterModal />
      <LoginModal />
      <Navbar />
    </BrowserRouter>
  );
}

export default App;
