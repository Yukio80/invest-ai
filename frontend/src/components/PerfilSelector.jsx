import React from 'react';

const PerfilSelector = ({ onSelect }) => {
  const perfis = ['conservador', 'moderado', 'agressivo', 'especulativo'];
  
  return (
    <div className="perfil-selector">
      <h3>Selecione seu Perfil</h3>
      <div style={{ display: 'flex', gap: '10px' }}>
        {perfis.map(p => (
          <button key={p} onClick={() => onSelect(p)}>{p.toUpperCase()}</button>
        ))}
      </div>
    </div>
  );
};

export default PerfilSelector;
