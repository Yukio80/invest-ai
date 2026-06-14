import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

const Home = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '30px',
    padding: '20px',
    background: 'linear-gradient(135deg, #0D1B2A 0%, #1B2838 100%)'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
      <Logo size={60} />
      <div>
        <h1 style={{ color: '#fff', fontSize: '28px' }}>Invest AI</h1>
        <p style={{ color: '#00BFA6', fontSize: '14px' }}>Assistant</p>
      </div>
    </div>
    <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%', maxWidth: '300px' }}>
      <Link to="/analise" style={{
        background: '#00BFA6', color: '#0D1B2A', padding: '15px', borderRadius: '10px',
        textAlign: 'center', fontWeight: 'bold', fontSize: '16px'
      }}>
        🔍 Analisar Ação
      </Link>
      <Link to="/ranking" style={{
        background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '15px', borderRadius: '10px',
        textAlign: 'center', fontWeight: 'bold', fontSize: '16px'
      }}>
        🏆 Carteira Recomendada
      </Link>
      <Link to="/oportunidades" style={{
        background: 'rgba(0,191,166,0.2)', color: '#00E5C0', padding: '15px', borderRadius: '10px',
        textAlign: 'center', fontWeight: 'bold', fontSize: '16px', border: '1px solid rgba(0,191,166,0.3)'
      }}>
        🎯 Oportunidades do Mercado
      </Link>
    </nav>
  </div>
);

export default Home;
