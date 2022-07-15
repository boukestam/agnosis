import React, { useState } from 'react';

import Game from './pages/game';
import Home from './pages/home';

function App() {
  const hostParts = window.location.host.split('.');
  const subdomain = hostParts.length > 1 ? hostParts[0] : '';

  return subdomain === 'app' ? (
    <Game />
  ) : (
    <Home
      onLaunch={() =>
        (window.location.href =
          window.location.href.split(window.location.host)[0] +
          'app.' +
          window.location.host +
          window.location.href.split(window.location.host)[1])
      }
    />
  );
}

export default App;
