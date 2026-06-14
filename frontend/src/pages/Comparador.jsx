import React, { useState } from 'react';
import Header from '../components/Header';
import PerfilSelector from '../components/PerfilSelector';
import { compararAtivos } from '../services/api';

const ComparadorPage = () => {
  const [tickersInput, setTickersInput] = useState('');
  const [resultado, setResultado] = useState(null);
  const [perfil, setPerfil] = useState('moderado');
  const [loading, setLoading] = useState(false);

  const handleComparar = async () => {
    const tickers = tickersInput.split(',').map(t => t.trim().toUpperCase()).filter(Boolean);
    if (tickers.length < 2) return alert('Digite pelo menos 2 tickers separados por vírgula');
    setLoading(true);
    try {
      const res = await compararAtivos(tickers, perfil);
      setResultado(res.data);
    } catch (e) { alert('Erro ao comparar'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <Header />
      <div style={{ maxWidth: 800, margin: '30px auto', padding: '0 20px' }}>
        <h1 style={{ color: 'var(--text-primary)', fontSize: 24, marginBottom: 20 }}>📊 Comparador de Ativos</h1>
        <PerfilSelector onSelect={setPerfil} />
        <div style={{ display: 'flex', gap: 10, margin: '20px 0' }}>
          <input
            type="text" placeholder="PETR4, VALE3, ITUB4"
            value={tickersInput}
            onChange={e => setTickersInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleComparar()}
            style={{ flex: 1 }}
          />
          <button onClick={handleComparar} disabled={loading}>
            {loading ? 'Comparando...' : 'Comparar'}
          </button>
        </div>

        {resultado && resultado.resultados && (
          <div style={{ display: 'grid', gap: 15, marginTop: 20 }}>
            {resultado.resultados.map((item, idx) => (
              <div key={item.ticker} className="acao-card" style={{
                borderLeft: `4px solid ${idx === 0 ? 'var(--accent)' : idx === resultado.resultados.length - 1 ? 'var(--danger)' : 'var(--warning)'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 18, fontWeight: 'bold', color: 'var(--text-secondary)' }}>#{idx + 1}</span>
                    <strong style={{ fontSize: 20 }}>{item.ticker}</strong>
                    <span className={`tag tag-${item.recomendacao.toLowerCase()}`}>{item.recomendacao}</span>
                  </div>
                  <span style={{ fontSize: 22, fontWeight: 'bold', color: 'var(--accent)' }}>
                    {(item.score * 100).toFixed(0)}%
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 20, marginTop: 12, flexWrap: 'wrap', fontSize: 13, color: 'var(--text-secondary)' }}>
                  <span>P/L: {item.metricas.pl ?? '-'}</span>
                  <span>P/VP: {item.metricas.pvp ?? '-'}</span>
                  <span>ROE: {item.metricas.roe ? `${(item.metricas.roe * 100).toFixed(1)}%` : '-'}</span>
                  <span>DY: {item.metricas.dividend_yield ? `${(item.metricas.dividend_yield * 100).toFixed(2)}%` : '-'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparadorPage;
