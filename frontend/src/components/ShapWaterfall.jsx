import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const ShapWaterfall = ({ shapData }) => {
  return (
    <div style={{ height: '300px' }}>
      <h4>Contribuição SHAP</h4>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={shapData} layout="vertical">
          <XAxis type="number" />
          <YAxis dataKey="feature" type="category" />
          <Tooltip />
          <Bar dataKey="impacto" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ShapWaterfall;
