import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { getPortfolio, getPerfis } from '../services/api';

const RISK_COLORS = {
  'Baixo': 'var(--success)',
  'Médio': 'var(--warning)',
  'Alto': { color: '#FF8A65' },
  'Muito Alto': 'var(--danger)'
};

const CATEGORY_LABELS = {
  large_caps: 'Large Caps',
  small_caps: 'Small Caps',
  fiis: 'FIIs',
  etfs: 'ETFs',
  dividendos: 'Dividendos'
};

const PortfolioPage = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [perfil, setPerfil] = useState('moderado');
  const [loading, setLoading] = useState(true);

  const fetchPortfolio = async (selectedPerfil) => {
    setLoading(true);
    try {
      const res = await getPortfolio(selectedPerfil);
      setPortfolio(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio(perfil);
  }, []);

  const handlePerfilChange = (slug) => {
    setPerfil(slug);
    fetchPortfolio(slug);
  };

  return (
    <div>
      <Header />
      <div style={{ maxWidth: 800, margin: '30px auto', padding: '0 20px' }}>
        <h1 style={{ color: 'var(--primary-dark)', fontSize: 24, marginBottom: 20 }}>Carteiras Recomendadas</h1>

        {/* Seletor de Perfil */}
        {!loading && (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 30 }}>
            {['conservador', 'moderado', 'agressivo', 'especulativo'].map(slug => (
              <button
                key={slug}
                onClick={() => handlePerfilChange(slug)}
                style={{
                  background: perfil === slug ? 'var(--accent)' : 'var(--primary-dark)',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: 20,
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: 14,
                  opacity: perfil === slug ? 1 : 0.6
                }}
              >
                {slug.charAt(0).toUpperCase() + slug.slice(1)}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <p style={{ color: 'var(--text-secondary)', marginTop: 30 }}>Montando sua carteira ideal...</p>
        ) : portfolio ? (
          <>
            {/* Card de Resumo */}
            <div className="acao-card" style={{ marginBottom: 25, borderLeft: `4px solid ${portfolio.score_total > 0.5 ? 'var(--accent)' : 'var(--warning)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 15 }}>
                <div>
                  <h2 style={{ color: 'var(--primary-dark)', margin: 0 }}>
                    Perfil {portfolio.nome} {portfolio.risco === 'Baixo' ? '🛡️' : portfolio.risco === 'Alto' || portfolio.risco === 'Muito Alto' ? '⚡' : '⚖️'}
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: '5px 0 0' }}>{portfolio.descricao}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Score da Carteira</div>
                  <div style={{ fontSize: 28, fontWeight: 'bold', color: 'var(--accent)' }}>{(portfolio.score_total * 100).toFixed(0)}%</div>
                  <div style={{ fontSize: 12, color: portfolio.risco === 'Baixo' ? 'var(--success)' : portfolio.risco === 'Alto' || portfolio.risco === 'Muito Alto' ? 'var(--danger)' : 'var(--warning)' }}>
                    Risco: {portfolio.risco}
                  </div>
                </div>
              </div>
            </div>

            {/* Alocação */}
            <div className="acao-card" style={{ marginBottom: 25 }}>
              <h3 style={{ color: 'var(--primary-dark)', marginBottom: 15 }}>📊 Alocação por Classe</h3>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {portfolio.carteira.map(cat => (
                  <div key={cat.categoria} style={{
                    flex: 1, minWidth: 120, padding: '12px', borderRadius: 8,
                    background: 'var(--bg)', textAlign: 'center'
                  }}>
                    <div style={{ fontSize: 22, fontWeight: 'bold', color: 'var(--accent)' }}>{cat.percentual}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{CATEGORY_LABELS[cat.categoria] || cat.categoria}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ativos Recomendados por Categoria */}
            <h3 style={{ color: 'var(--primary-dark)', marginBottom: 15 }}>🎯 Ativos Recomendados</h3>
            <div style={{ display: 'grid', gap: 20 }}>
              {portfolio.carteira.map(cat => (
                <div key={cat.categoria} className="acao-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h4 style={{ color: 'var(--primary-dark)', margin: 0 }}>
                      {CATEGORY_LABELS[cat.categoria] || cat.categoria} ({cat.percentual})
                    </h4>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                      Score médio: <strong style={{ color: 'var(--accent)' }}>{cat.score_medio}</strong>
                    </span>
                  </div>
                  {cat.ativos && cat.ativos.length > 0 ? (
                    <div style={{ display: 'grid', gap: 8 }}>
                      {cat.ativos.map((ativo, idx) => (
                        <div key={ativo.ticker} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '8px 12px', borderRadius: 6,
                          background: idx === 0 ? 'rgba(0,191,166,0.06)' : 'transparent',
                          border: '1px solid #eee'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontWeight: 'bold', color: 'var(--text-secondary)', fontSize: 13 }}>{idx + 1}º</span>
                            <strong style={{ fontSize: 15 }}>{ativo.ticker}</strong>
                            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                              Peso: {(ativo.peso_sugerido * 100).toFixed(1)}%
                            </span>
                          </div>
                          <span style={{ fontWeight: 'bold', color: 'var(--accent)' }}>
                            {(ativo.score * 100).toFixed(0)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Nenhum ativo disponível para esta categoria.</p>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <p style={{ color: 'var(--text-secondary)', marginTop: 30 }}>Não foi possível gerar a carteira. Tente novamente.</p>
        )}
        <footer style={{ marginTop: 40, fontSize: 12, color: 'var(--text-secondary)' }}>
          Esta carteira é gerada automaticamente por algoritmos de análise fundamentalista. Não constitui recomendação de investimento conforme regulação CVM.
        </footer>
      </div>
    </div>
  );
};

export default PortfolioPage;
