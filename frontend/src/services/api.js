import axios from 'axios'
import supabase from './supabase'

const api = axios.create({
  baseURL: '/api'
})

api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      const detail = error.response.data?.detail
      const msg = typeof detail === 'string' ? detail : detail?.message || 'Limite diário atingido'
      alert(msg)
    }
    if (error.response?.status === 401) {
      supabase.auth.signOut()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const analisarAcao = (ticker, perfil) => {
  return api.post('/analisar', { ticker, perfil })
}

export const getRanking = (perfil) => {
  return api.get(`/ranking?perfil=${perfil}`)
}

export const getOportunidadesTodas = (perfil) => {
  return api.get(`/oportunidades/todas?perfil=${perfil}`)
}

export const getCategorias = () => {
  return api.get('/oportunidades/categorias')
}

export const getPortfolio = (perfil) => {
  return api.get(`/portfolio?perfil=${perfil}`)
}

export const getPerfis = () => {
  return api.get('/portfolio/perfis')
}

export const compararAtivos = (tickers, perfil) => {
  return api.get(`/comparar?tickers=${tickers.join(',')}&perfil=${perfil}`)
}

export const getAnaliseTecnica = (ticker, periodo = '6mo') => {
  return api.get(`/analise-tecnica?ticker=${ticker}&periodo=${periodo}`)
}

export default api
