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

export default api;
