from fastapi import APIRouter, Query
from ..services.portfolio import gerar_carteira, listar_perfis

router = APIRouter()

@router.get("/portfolio/perfis")
def listar_perfis_disponiveis():
    """Lista todos os perfis de investidor disponíveis para geração de carteira"""
    return {"perfis": listar_perfis()}

@router.get("/portfolio")
def obter_carteira(
    perfil: str = Query("moderado", description="Perfil do investidor"),
    limite: int = Query(3, description="Ativos recomendados por categoria")
):
    """Gera uma carteira recomendada completa para o perfil informado"""
    from fastapi import HTTPException
    resultado = gerar_carteira(perfil, limite)
    if "erro" in resultado:
        raise HTTPException(status_code=404, detail=resultado["erro"])
    return resultado
