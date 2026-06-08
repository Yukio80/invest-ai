import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const RadarMetricas = ({ metricas }) => {
  const data = [
    { subject: 'P/L', A: metricas.pl || 0 },
    { subject: 'ROE', A: (metricas.roe || 0) * 100 },
    // Adicionar outras métricas conforme necessário
  ];

  return (
    <div style={{ height: '300px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <Radar dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarMetricas;
