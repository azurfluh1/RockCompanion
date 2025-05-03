import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/home';
import Tuner from './pages/tuner';
import './index.css';
import Header from './pages/header';

function App() {
  const navigate = useNavigate();
  return (
    <>
      <Header></Header>
      <div>
        <Routes>
          <Route path="/" element={<Tuner />} />
        </Routes>
      </div>
    </>
  );
}

export default App;