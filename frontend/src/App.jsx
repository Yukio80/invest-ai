import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AnalisePage from './pages/Analise';
import RankingPage from './pages/Ranking';
import PortfolioPage from './pages/Portfolio';
import OportunidadesPage from './pages/Oportunidades';
import ComparadorPage from './pages/Comparador';
import AnaliseTecnicaPage from './pages/AnaliseTecnica';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/analise" element={<AnalisePage />} />
      <Route path="/ranking" element={<RankingPage />} />
      <Route path="/oportunidades" element={<OportunidadesPage />} />
      <Route path="/portfolio" element={<PortfolioPage />} />
      <Route path="/comparador" element={<ComparadorPage />} />
      <Route path="/analise-tecnica" element={<AnaliseTecnicaPage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
