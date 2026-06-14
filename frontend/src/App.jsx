import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AnalisePage from './pages/Analise';
import RankingPage from './pages/Ranking';
import PortfolioPage from './pages/Portfolio';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/analise" element={<AnalisePage />} />
      <Route path="/ranking" element={<RankingPage />} />
      <Route path="/oportunidades" element={<OportunidadesPage />} />
      <Route path="/portfolio" element={<PortfolioPage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
