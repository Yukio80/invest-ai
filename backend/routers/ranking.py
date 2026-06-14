from fastapi import APIRouter, Query, Depends
from ..services.data_pipeline import get_universo_smallcaps, get_dados_acao
from ..services.model import score_acao
from ..services.auth import verificar_cota

router = APIRouter()

@router.get("/ranking")
def get_ranking(
    perfil: str = Query("moderado"),
    limite: int = Query(10),
    user: dict = Depends(verificar_cota),
):
    # 1. Busca o universo de ações
    universo = get_universo_smallcaps()
    tickers = universo["ticker"].tolist()
    
    ranking = []
    
    # 2. Calcula score para cada ação (limitado para evitar timeout em demo)
    for ticker in tickers[:20]: 
        dados = get_dados_acao(ticker)
        if dados:
            score = score_acao(ticker, perfil, dados)
            ranking.append({
                "ticker": ticker,
                "score": score,
                "metricas": {
                    "pl": dados.get("pl"),
                    "pvp": dados.get("pvp"),
                    "roe": dados.get("roe")
                }
            })
    
    # 3. Ordena por score decrescente
    ranking.sort(key=lambda x: x["score"], reverse=True)
    
    return ranking[:limite]
