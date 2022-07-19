import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import Game from './pages/game';
import Home from './pages/home';

function App() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route index element={<Home onLaunch={() => navigate('/app')} />} />
      <Route path="/app/*" element={<Game />} />
    </Routes>
  );
}

export default App;
