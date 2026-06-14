from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from .routers import analise, ranking, oportunidades
import os

app = FastAPI(title="Invest AI Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analise.router, prefix="/api")
app.include_router(ranking.router, prefix="/api")
app.include_router(oportunidades.router, prefix="/api")

# Servindo arquivos estáticos do frontend
frontend_path = os.path.join(os.getcwd(), "frontend", "dist")
if os.path.exists(frontend_path):
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")

@app.get("/")
def read_root():
    return {"message": "Invest AI Assistant API"}

@app.exception_handler(404)
async def not_found_exception_handler(request, exc):
    return FileResponse(os.path.join(frontend_path, "index.html"))
