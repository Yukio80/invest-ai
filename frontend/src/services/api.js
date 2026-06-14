import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

export const analisarAcao = (ticker, perfil) => {
  return api.post('/analisar', { ticker, perfil });
};

export const getRanking = (perfil) => {
  return api.get(`/ranking?perfil=${perfil}`);
};

export const getOportunidadesTodas = (perfil) => {
  return api.get(`/oportunidades/todas?perfil=${perfil}`);
};

export const getCategorias = () => {
  return api.get('/oportunidades/categorias');
};

export const getPortfolio = (perfil) => {
  return api.get(`/portfolio?perfil=${perfil}`);
};

export const getPerfis = () => {
  return api.get('/portfolio/perfis');
};

export const compararAtivos = (tickers, perfil) => {
  return api.get(`/comparar?tickers=${tickers.join(',')}&perfil=${perfil}`);
};

export const getAnaliseTecnica = (ticker, periodo = '6mo') => {
  return api.get(`/analise-tecnica?ticker=${ticker}&periodo=${periodo}`);
};

export default api;
