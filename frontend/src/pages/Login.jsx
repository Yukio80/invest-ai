import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Logo from '../components/Logo'

const LoginPage = () => {
  const { user, signInWithGoogle } = useAuth()

  if (user) return <Navigate to="/" replace />

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '30px',
      padding: '20px', background: 'linear-gradient(135deg, #0D1B2A 0%, #1B2838 100%)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <Logo size={60} />
        <div>
          <h1 style={{ color: '#fff', fontSize: '28px' }}>Invest AI</h1>
          <p style={{ color: '#00BFA6', fontSize: '14px' }}>Assistant</p>
        </div>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.05)', borderRadius: '12px',
        padding: '40px', maxWidth: 360, width: '100%', textAlign: 'center'
      }}>
        <h2 style={{ color: '#fff', marginBottom: 10 }}>Bem-vindo</h2>
        <p style={{ color: '#9AA0A6', fontSize: 14, marginBottom: 30 }}>
          Faça login com sua conta Google para acessar análises fundamentalistas e técnicas da B3.
        </p>
        <button onClick={signInWithGoogle} style={{
          background: '#fff', color: '#0D1B2A', padding: '12px 24px',
          borderRadius: '8px', fontWeight: 'bold', fontSize: 16, border: 'none',
          cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10,
          width: '100%', justifyContent: 'center'
        }}>
          <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 019.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.99 23.99 0 000 24c0 3.93.96 7.63 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
          Entrar com Google
        </button>
      </div>

      <p style={{ color: '#546E7A', fontSize: 12, maxWidth: 300, textAlign: 'center' }}>
        🔒 Seus dados são protegidos pelo Supabase Auth. Nenhuma informação é compartilhada sem seu consentimento.
      </p>
    </div>
  )
}

export default LoginPage
