import React, { useState } from 'react';
import Header from '../components/Header';
import PerfilSelector from '../components/PerfilSelector';
import AcaoCard from '../components/AcaoCard';
import ShapWaterfall from '../components/ShapWaterfall';
import RadarMetricas from '../components/RadarMetricas';
import Logo from '../components/Logo';
import { analisarAcao } from '../services/api';

const AnalisePage = () => {
  const [analise, setAnalise] = useState(null);
  const [perfil, setPerfil] = useState('moderado');

  const handleAnalise = async (ticker) => {
    if (!ticker) return;
    try {
      const res = await analisarAcao(ticker, perfil);
      setAnalise(res.data);
    } catch (e) {
      alert("Erro ao buscar análise");
    }
  };

  return (
    <div>
      <Header />
      <div style={{ maxWidth: 700, margin: '30px auto', padding: '0 20px' }}>
        <h1 style={{ color: 'var(--primary-dark)', fontSize: 24, marginBottom: 20 }}>Análise de Ação</h1>
        <PerfilSelector onSelect={setPerfil} />
        <div style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
          <input 
            type="text" 
            id="ticker-input" 
            placeholder="Ticker (ex: PETR4)" 
            onKeyDown={(e) => e.key === 'Enter' && handleAnalise(e.target.value)}
          />
          <button onClick={() => handleAnalise(document.getElementById('ticker-input').value)}>
            Analisar
          </button>
        </div>
        
        {analise && (
          <>
            <AcaoCard analise={analise} />
            <div style={{ marginTop: 20 }}>
              <ShapWaterfall shapData={analise.shap} />
            </div>
            <div style={{ marginTop: 20 }}>
              <RadarMetricas metricas={analise.metricas} />
            </div>
            <footer style={{ marginTop: 40, fontSize: 12, color: 'var(--text-secondary)' }}>{analise.disclaimer}</footer>
          </>
        )}
      </div>
    </div>
  );
};

export default AnalisePage;
