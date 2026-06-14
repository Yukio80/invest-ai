from fastapi import APIRouter, Query, Depends
from ..services.analise_tecnica import analisar_tecnica
from ..services.auth import verificar_cota

router = APIRouter()

@router.get("/analise-tecnica")
def analise_tecnica(
    ticker: str = Query(..., description="Ticker para análise"),
    periodo: str = Query("6mo", description="Período: 1mo, 3mo, 6mo, 1y"),
    user: dict = Depends(verificar_cota),
):
    resultado = analisar_tecnica(ticker, periodo)
    if "erro" in resultado:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail=resultado["erro"])
    return resultado
