import React, { useEffect } from 'react';
import ReactGA from 'react-ga';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import Game from './pages/game';
import Home from './pages/home';
import { Owls } from './pages/owls';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  ReactGA.initialize('UA-234916061-1');

  useEffect(() => {
    ReactGA.pageview(location.pathname);
  }, [location]);

  return (
    <Routes>
      <Route index element={<Home onLaunch={() => navigate('/app')} />} />
      <Route path="/app/*" element={<Game />} />
      <Route path="/owls" element={<Owls />} />
    </Routes>
  );
}

export default App;
