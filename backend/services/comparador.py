import logging
from .data_pipeline import get_dados_acao
from .model import score_acao

logger = logging.getLogger(__name__)

def comparar_ativos(tickers: list, perfil: str = "moderado") -> dict:
    """Compara múltiplos ativos lado a lado"""
    resultados = []

    for ticker in tickers:
        dados = get_dados_acao(ticker)
        if dados:
            score = score_acao(ticker, perfil, dados)
            resultados.append({
                "ticker": ticker,
                "score": score,
                "recomendacao": "Positivo" if score > 0.6 else "Neutro" if score > 0.4 else "Negativo",
                "metricas": {
                    "pl": dados.get("pl"),
                    "pvp": dados.get("pvp"),
                    "roe": dados.get("roe"),
                    "dividend_yield": dados.get("dividend_yield"),
                    "margem_liquida": dados.get("margem_liquida"),
                    "preco_atual": dados.get("preco_atual")
                }
            })

    resultados.sort(key=lambda x: x["score"], reverse=True)

    return {
        "tickers": [r["ticker"] for r in resultados],
        "resultados": resultados,
        "melhor": resultados[0]["ticker"] if resultados else None
    }
