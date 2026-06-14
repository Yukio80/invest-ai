import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import PerfilSelector from '../components/PerfilSelector';
import { getOportunidadesTodas, getCategorias } from '../services/api';

const CATEGORY_ICONS = {
  large_caps: '🏢',
  small_caps: '🚀',
  fiis: '🏠',
  etfs: '📊',
  dividendos: '💰'
};

const OportunidadesPage = () => {
  const [dados, setDados] = useState([]);
  const [perfil, setPerfil] = useState('moderado');
  const [loading, setLoading] = useState(true);

  const fetchData = async (selectedPerfil) => {
    setLoading(true);
    try {
      const res = await getOportunidadesTodas(selectedPerfil);
      setDados(res.data.oportunidades || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(perfil);
  }, []);

  return (
    <div>
      <Header />
      <div style={{ maxWidth: 800, margin: '30px auto', padding: '0 20px' }}>
        <h1 style={{ color: 'var(--primary-dark)', fontSize: 24, marginBottom: 10 }}>Oportunidades do Mercado</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
          Varredura inteligente por categorias e classes de ativos
        </p>
        <PerfilSelector onSelect={(p) => { setPerfil(p); fetchData(p); }} />
        
        {loading ? (
          <p style={{ color: 'var(--text-secondary)', marginTop: 30 }}>Analisando o mercado...</p>
        ) : dados.length > 0 ? (
          <div style={{ display: 'grid', gap: 30, marginTop: 30 }}>
            {dados.map((cat) => (
              <div key={cat.categoria} className="acao-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 15 }}>
                  <span style={{ fontSize: 28 }}>{CATEGORY_ICONS[cat.categoria] || '📈'}</span>
                  <div>
                    <h3 style={{ color: 'var(--primary-dark)' }}>{cat.nome}</h3>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{cat.descricao} · {cat.total_ativos} ativos analisados</span>
                  </div>
                </div>
                {cat.melhores && cat.melhores.length > 0 ? (
                  <div style={{ display: 'grid', gap: 10 }}>
                    {cat.melhores.map((item, idx) => (
                      <div key={item.ticker} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 12px', borderRadius: 8,
                        background: idx === 0 ? 'rgba(0,191,166,0.08)' : 'transparent',
                        border: '1px solid #eee'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontWeight: 'bold', color: 'var(--text-secondary)', width: 20 }}>{idx + 1}º</span>
                          <strong>{item.ticker}</strong>
                          <span style={{
                            fontSize: 11, padding: '2px 8px', borderRadius: 10,
                            background: item.recomendacao === 'Positivo' ? 'rgba(0,191,166,0.15)' : 'rgba(255,179,0,0.15)',
                            color: item.recomendacao === 'Positivo' ? 'var(--success)' : 'var(--warning)'
                          }}>{item.recomendacao}</span>
                        </div>
                        <span style={{ fontWeight: 'bold', color: 'var(--accent)', fontSize: 18 }}>
                          {(item.score * 100).toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Nenhum dado disponível para esta categoria.</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-secondary)', marginTop: 30 }}>Nenhuma oportunidade encontrada. Tente novamente mais tarde.</p>
        )}
        <footer style={{ marginTop: 40, fontSize: 12, color: 'var(--text-secondary)' }}>
          Esta análise é informativa e não constitui recomendação de investimento conforme regulação CVM.
        </footer>
      </div>
    </div>
  );
};

export default OportunidadesPage;
