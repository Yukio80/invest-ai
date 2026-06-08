# Estágio 1: Build do Frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Estágio 2: Backend e Servidor Final
FROM python:3.11-slim
WORKDIR /app

# Instala dependências de sistema necessárias para algumas bibliotecas Python
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Instala dependências do Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia o código do backend
COPY backend/ ./backend/

# Copia os arquivos buildados do frontend do estágio anterior
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Variáveis de ambiente
ENV PORT=8000
EXPOSE 8000

# Comando para iniciar a aplicação
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
