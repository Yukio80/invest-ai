from fastapi import APIRouter, Query, Depends
from ..services.agente_oportunidades import (
    analisar_categoria,
    analisar_todas_categorias,
    get_categorias
)
from ..services.auth import verificar_cota

router = APIRouter()

@router.get("/oportunidades/categorias")
def listar_categorias(user: dict = Depends(verificar_cota)):
    """Lista todas as categorias de ativos disponíveis para análise"""
    return {"categorias": get_categorias()}


@router.get("/oportunidades")
def buscar_oportunidades(
    categoria: str = Query("large_caps", description="slug da categoria"),
    perfil: str = Query("moderado", description="perfil do investidor"),
    limite: int = Query(10, description="quantidade de resultados por categoria"),
    user: dict = Depends(verificar_cota),
):
    """Retorna as melhores oportunidades filtradas por categoria e perfil"""
    resultado = analisar_categoria(categoria, perfil, limite)
    if "erro" in resultado:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail=resultado["erro"])
    return resultado


@router.get("/oportunidades/todas")
def buscar_todas_oportunidades(
    perfil: str = Query("moderado"),
    limite: int = Query(5),
    user: dict = Depends(verificar_cota),
):
    """Retorna as melhores oportunidades de todas as categorias em uma só chamada"""
    return {
        "oportunidades": analisar_todas_categorias(perfil, limite),
        "disclaimer": "Esta análise é informativa e não constitui recomendação de investimento conforme regulação CVM."
    }
