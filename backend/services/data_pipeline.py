import yfinance as yf
import pandas as pd
import requests
from bs4 import BeautifulSoup
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_dados_yfinance(ticker: str) -> dict:
    """Coleta dados básicos via yfinance"""
    try:
        t = yf.Ticker(f"{ticker}.SA")
        info = t.info
        return {
            "ticker": ticker,
            "preco_atual": info.get("currentPrice"),
            "pl": info.get("trailingPE"),
            "pvp": info.get("priceToBook"),
            "roe": info.get("returnOnEquity"),
            "dividend_yield": info.get("dividendYield"),
            "margem_liquida": info.get("profitMargins"),
        }
    except Exception as e:
        logger.error(f"Erro ao coletar yfinance para {ticker}: {e}")
        return {}

def get_dados_fundamentus(ticker: str) -> dict:
    """Mock/Placeholder para scraping do Fundamentus"""
    # Em um cenário real, aqui entraria o request com BS4
    logger.info(f"Coletando dados fundamentus para {ticker}")
    return {"cagr_receita_3a": 0.15} # Exemplo

def get_universo_smallcaps(min_cap: float = 300_000_000, max_cap: float = 2_000_000_000) -> pd.DataFrame:
    """Retorna lista de ações dentro do range de market cap definido"""
    logger.info(f"Buscando small caps entre {min_cap} e {max_cap}")
    # Simulação de retorno
    return pd.DataFrame({"ticker": ["PETR4", "VALE3"], "market_cap": [1000000000, 500000000]})

def get_dados_acao(ticker: str) -> dict:
    """Função principal de coleta unificada"""
    dados = get_dados_yfinance(ticker)
    if dados:
        dados.update(get_dados_fundamentus(ticker))
    return dados
