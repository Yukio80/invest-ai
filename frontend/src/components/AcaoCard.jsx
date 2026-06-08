import React from 'react';

const AcaoCard = ({ analise }) => {
  return (
    <div className="acao-card" style={{ border: '1px solid #ccc', padding: '10px' }}>
      <h2>{analise.ticker}</h2>
      <p>Score: {analise.score.toFixed(2)}</p>
      <p>Recomendação: <strong>{analise.recomendacao}</strong></p>
    </div>
  );
};

export default AcaoCard;
