import React, { useState, useEffect } from 'react';

const ThemeToggle = () => {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      style={{
        background: 'transparent',
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: '50%',
        width: 34,
        height: 34,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 16
      }}
      title="Alternar tema"
    >
      {dark ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggle;
