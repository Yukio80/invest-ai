import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'

const Header = () => {
  const { user, signOut } = useAuth()

  return (
    <div style={{ background: 'var(--header-bg)', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', textDecoration: 'none' }}>
        <Logo size={30} />
        <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Invest AI</span>
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <ThemeToggle />
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {user.user_metadata?.avatar_url && (
              <img
                src={user.user_metadata.avatar_url}
                alt="avatar"
                style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
              />
            )}
            <button
              onClick={signOut}
              style={{
                background: 'transparent', border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 6, color: '#fff', padding: '4px 10px',
                fontSize: 12, cursor: 'pointer'
              }}
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Header
