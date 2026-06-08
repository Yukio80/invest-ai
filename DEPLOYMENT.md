# 🚀 Guia de Deploy - Invest AI Assistant

Este projeto foi estruturado para ser implantado de forma simples, com o backend FastAPI servindo o frontend React estático.

## 🛠️ Opção 1: Deploy no Railway (Recomendado)
O Railway é a forma mais rápida de colocar este MVP no ar.

1. Suba seu código para um repositório no **GitHub**.
2. Crie uma conta em [railway.app](https://railway.app/).
3. Clique em **"New Project"** $\rightarrow$ **"Deploy from GitHub repo"**.
4. Selecione o repositório `invest-ai`.
5. O Railway detectará o `Dockerfile` automaticamente e fará o build.
6. Vá em **Settings** $\rightarrow$ **Public Networking** e gere um domínio público.

## 🌐 Opção 2: Deploy no Render.com
1. Crie uma conta em [render.com](https://render.com/).
2. Selecione **"New"** $\rightarrow$ **"Web Service"**.
3. Conecte seu GitHub e selecione o repositório.
4. Em **Runtime**, selecione **Docker**.
5. Clique em **Deploy**.

## 💻 Opção 3: Rodando Localmente com Docker
Se você tem o Docker instalado:

```bash
# Build da imagem
docker build -t invest-ai .

# Rodando o container
docker run -p 8000:8000 invest-ai
```
Acesse: `http://localhost:8000`

## 📝 Notas Importantes
- **Porta:** A aplicação escuta na porta `8000`.
- **CVM:** O disclaimer regulatório já está implementado no frontend e nas respostas da API.
- **Dados:** O sistema utiliza `yfinance` para dados em tempo real, não exigindo chaves de API externas para o funcionamento básico.
