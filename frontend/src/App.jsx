import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/Login'
import Home from './pages/Home'
import AnalisePage from './pages/Analise'
import RankingPage from './pages/Ranking'
import PortfolioPage from './pages/Portfolio'
import OportunidadesPage from './pages/Oportunidades'
import ComparadorPage from './pages/Comparador'
import AnaliseTecnicaPage from './pages/AnaliseTecnica'

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/analise" element={<ProtectedRoute><AnalisePage /></ProtectedRoute>} />
        <Route path="/ranking" element={<ProtectedRoute><RankingPage /></ProtectedRoute>} />
        <Route path="/oportunidades" element={<ProtectedRoute><OportunidadesPage /></ProtectedRoute>} />
        <Route path="/portfolio" element={<ProtectedRoute><PortfolioPage /></ProtectedRoute>} />
        <Route path="/comparador" element={<ProtectedRoute><ComparadorPage /></ProtectedRoute>} />
        <Route path="/analise-tecnica" element={<ProtectedRoute><AnaliseTecnicaPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
)

export default App
