import { Routes, Route } from 'react-router-dom';
import './index.css';

import TabHero from './pages/components/TabHero';
import Header from './pages/components/Header';
import RegistrationPage from './pages/RegistrationPage';
import { AuthProvider } from './Auth';
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';
import Tuner from './pages/Tuner';

function App() {
  return (
    <div className="overflow-x-hidden">
      <AuthProvider>
        <Header></Header>
        <div className='mt-[97px]'>
          <Routes>
            <Route path="/" element={<Tuner />} />
            <Route path="/tab-hero" element={<TabHero />} />
            <Route path="/register" element={<RegistrationPage/>} />
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/logout" element={<LogoutPage/>} />
          </Routes>
        </div>
      </AuthProvider>
    </div>
  );
}

export default App;