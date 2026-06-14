import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api'
});

export const analisarAcao = (ticker, perfil) => {
  return api.post('/analisar', { ticker, perfil });
};

export const getRanking = (perfil) => {
  return api.get(`/ranking?perfil=${perfil}`);
};

export const getOportunidades = (categoria, perfil) => {
  return api.get(`/oportunidades?categoria=${categoria}&perfil=${perfil}`);
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

export default api;
