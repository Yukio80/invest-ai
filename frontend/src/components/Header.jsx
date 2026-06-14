import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

const Header = () => (
  <div style={{ background: 'var(--header-bg)', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', textDecoration: 'none' }}>
      <Logo size={30} />
      <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Invest AI</span>
    </Link>
    <ThemeToggle />
  </div>
);

export default Header;
