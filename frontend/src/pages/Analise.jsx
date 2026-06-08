import React, { useState } from 'react';
import PerfilSelector from '../components/PerfilSelector';
import AcaoCard from '../components/AcaoCard';
import ShapWaterfall from '../components/ShapWaterfall';
import RadarMetricas from '../components/RadarMetricas';
import { analisarAcao } from '../services/api';

const AnalisePage = () => {
  const [analise, setAnalise] = useState(null);
  const [perfil, setPerfil] = useState('moderado');

  const handleAnalise = async (ticker) => {
    try {
      const res = await analisarAcao(ticker, perfil);
      setAnalise(res.data);
    } catch (e) {
      alert("Erro ao buscar análise");
    }
  };

  return (
    <div>
      <h1>Análise de Ação</h1>
      <PerfilSelector onSelect={setPerfil} />
      <input type="text" placeholder="Ticker (ex: PETR4)" onBlur={(e) => handleAnalise(e.target.value)} />
      
      {analise && (
        <>
          <AcaoCard analise={analise} />
          <ShapWaterfall shapData={analise.shap} />
          <RadarMetricas metricas={analise.metricas} />
          <footer>{analise.disclaimer}</footer>
        </>
      )}
    </div>
  );
};

export default AnalisePage;
