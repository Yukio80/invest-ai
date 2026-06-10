import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PerfilSelector from '../components/PerfilSelector';
import Logo from '../components/Logo';
import { getRanking } from '../services/api';

const RankingPage = () => {
  const [ranking, setRanking] = useState([]);
  const [perfil, setPerfil] = useState('moderado');
  const [loading, setLoading] = useState(false);

  const fetchRanking = async (selectedPerfil) => {
    setLoading(true);
    try {
      const res = await getRanking(selectedPerfil);
      setRanking(res.data);
    } catch (e) {
      alert("Erro ao buscar ranking");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRanking(perfil);
  }, []);

  const handlePerfilChange = (newPerfil) => {
    setPerfil(newPerfil);
    fetchRanking(newPerfil);
  };

  return (
    <div>
      <div style={{ background: 'var(--primary-dark)', padding: '15px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', textDecoration: 'none' }}>
          <Logo size={30} />
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Invest AI</span>
        </Link>
      </div>
      <div style={{ maxWidth: 700, margin: '30px auto', padding: '0 20px' }}>
        <h1 style={{ color: 'var(--primary-dark)', fontSize: 24, marginBottom: 20 }}>Carteira Recomendada</h1>
        <PerfilSelector onSelect={handlePerfilChange} />
        
        {loading ? (
          <p style={{ color: 'var(--text-secondary)', marginTop: 30 }}>Calculando melhores oportunidades...</p>
        ) : ranking.length > 0 ? (
          <div style={{ display: 'grid', gap: '15px', marginTop: 20 }}>
            {ranking.map((item, index) => (
              <div key={item.ticker} className="acao-card" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: index < 3 ? 'var(--accent)' : 'var(--primary)',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 'bold', fontSize: 14
                }}>{index + 1}</span>
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: 18 }}>{item.ticker}</strong>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', color: 'var(--accent)' }}>{(item.score * 100).toFixed(0)}%</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    {item.score > 0.6 ? 'Positivo' : item.score > 0.4 ? 'Neutro' : 'Negativo'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-secondary)', marginTop: 30 }}>Nenhuma ação encontrada para este perfil.</p>
        )}
        <footer style={{ marginTop: 40, fontSize: 12, color: 'var(--text-secondary)' }}>
          Esta carteira é gerada automaticamente por algoritmos de análise fundamentalista. Não constitui recomendação de investimento.
        </footer>
      </div>
    </div>
  );
};

export default RankingPage;
