import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AnalisePage from './pages/Analise';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/analise" element={<AnalisePage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
