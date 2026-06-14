from fastapi import APIRouter, Query
from ..services.comparador import comparar_ativos

router = APIRouter()

@router.get("/comparar")
def comparar(
    tickers: str = Query(..., description="Tickers separados por vírgula (ex: PETR4,VALE3,ITUB4)"),
    perfil: str = Query("moderado")
):
    tickers_list = [t.strip().upper() for t in tickers.split(",") if t.strip()]
    resultado = comparar_ativos(tickers_list, perfil)
    return resultado
