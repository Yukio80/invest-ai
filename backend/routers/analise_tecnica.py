from fastapi import APIRouter, Query
from ..services.analise_tecnica import analisar_tecnica

router = APIRouter()

@router.get("/analise-tecnica")
def analise_tecnica(
    ticker: str = Query(..., description="Ticker para análise"),
    periodo: str = Query("6mo", description="Período: 1mo, 3mo, 6mo, 1y")
):
    resultado = analisar_tecnica(ticker, periodo)
    if "erro" in resultado:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail=resultado["erro"])
    return resultado
