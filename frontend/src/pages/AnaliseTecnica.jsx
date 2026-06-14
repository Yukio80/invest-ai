import React, { useState } from 'react';
import Header from '../components/Header';
import { getAnaliseTecnica } from '../services/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const AnaliseTecnicaPage = () => {
  const [ticker, setTicker] = useState('');
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(false);
  const [periodo, setPeriodo] = useState('6mo');

  const handleAnalisar = async () => {
    if (!ticker) return;
    setLoading(true);
    try {
      const res = await getAnaliseTecnica(ticker.toUpperCase(), periodo);
      if (res.data.erro) return alert(res.data.erro);
      setDados(res.data);
    } catch (e) { alert('Erro ao buscar dados'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <Header />
      <div style={{ maxWidth: 900, margin: '30px auto', padding: '0 20px' }}>
        <h1 style={{ color: 'var(--text-primary)', fontSize: 24, marginBottom: 20 }}>📈 Análise Técnica</h1>

        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          <input type="text" placeholder="Ticker (ex: PETR4)"
            value={ticker} onChange={e => setTicker(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAnalisar()}
          />
          <select value={periodo} onChange={e => setPeriodo(e.target.value)}>
            <option value="1mo">1 mês</option>
            <option value="3mo">3 meses</option>
            <option value="6mo">6 meses</option>
            <option value="1y">1 ano</option>
          </select>
          <button onClick={handleAnalisar} disabled={loading}>
            {loading ? 'Analisando...' : 'Analisar'}
          </button>
        </div>

        {dados && dados.sinais && (
          <>
            {/* Indicadores */}
            <div className="acao-card" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                <h2 style={{ color: 'var(--accent)', margin: 0 }}>{dados.ticker}</h2>
                <span style={{ fontSize: 24, fontWeight: 'bold' }}>R$ {dados.preco_atual}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 15, marginTop: 15 }}>
                {[
                  { label: 'SMA 20', value: dados.sma_20 },
                  { label: 'SMA 50', value: dados.sma_50 },
                  { label: 'RSI (14)', value: dados.rsi, color: dados.rsi > 70 ? 'var(--danger)' : dados.rsi < 30 ? 'var(--accent)' : undefined },
                  { label: 'MACD', value: dados.macd.macd },
                  { label: 'Signal', value: dados.macd.signal },
                  { label: 'Máx 52 sem', value: dados.max_52_semanas },
                  { label: 'Mín 52 sem', value: dados.min_52_semanas },
                ].map(m => (
                  <div key={m.label} style={{ textAlign: 'center', padding: '10px', background: 'var(--bg)', borderRadius: 8 }}>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{m.label}</div>
                    <div style={{ fontWeight: 'bold', fontSize: 16, color: m.color || 'var(--text-primary)' }}>{m.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sinais */}
            <div className="acao-card" style={{ marginBottom: 20 }}>
              <h3 style={{ marginBottom: 10 }}>📋 Sinais</h3>
              {dados.sinais.map((s, i) => (
                <div key={i} style={{
                  padding: '8px 12px', marginBottom: 6, borderRadius: 6,
                  background: s.includes('sobrecomprado') ? 'rgba(255,82,82,0.1)' : s.includes('sobrevendido') ? 'rgba(0,191,166,0.1)' : 'var(--bg)',
                  fontSize: 14
                }}>{s}</div>
              ))}
            </div>

            {/* Gráfico */}
            <div className="acao-card">
              <h3 style={{ marginBottom: 15 }}>📊 Preço + Médias Móveis</h3>
              <div style={{ height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dados.dados_grafico}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="data" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
                    <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
                    <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }} />
                    <Legend />
                    <Line type="monotone" dataKey="fechamento" stroke="var(--accent)" dot={false} strokeWidth={2} name="Fechamento" />
                    <Line type="monotone" dataKey="sma20" stroke="#FFB300" dot={false} strokeWidth={1.5} name="SMA 20" />
                    <Line type="monotone" dataKey="sma50" stroke="#FF5252" dot={false} strokeWidth={1.5} name="SMA 50" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnaliseTecnicaPage;
