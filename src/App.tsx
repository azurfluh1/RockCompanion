import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import './index.css';

import TabHero from './pages/components/TabHero';
import Header from './pages/components/header';
import Tuner from './pages/tuner';
import RegistrationPage from './pages/RegistrationPage';
import { AuthProvider } from './Auth';
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';

function App() {
  // const navigate = useNavigate();
  return (
    <>
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
    </>
  );
}

export default App;