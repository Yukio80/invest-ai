import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div>
    <h1>Invest AI Assistant</h1>
    <nav>
      <Link to="/analise">Analisar Ação</Link>
    </nav>
  </div>
);

export default Home;
