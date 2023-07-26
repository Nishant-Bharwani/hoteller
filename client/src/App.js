import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import RegisterModal from './components/shared/modals/RegisterModal';

function App() {
  return (
    <BrowserRouter>
      <RegisterModal />
      <Navbar />
    </BrowserRouter>
  );
}

export default App;
