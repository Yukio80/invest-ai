import logging
from datetime import datetime
from .data_pipeline import get_dados_acao
from .model import score_acao

logger = logging.getLogger(__name__)

CATEGORIAS = {
    "large_caps": {
        "nome": "Ações Large Caps",
        "tickers": ["PETR4", "VALE3", "ITUB4", "BBDC4", "ABEV3", "BBAS3", "WEGE3", "RENT3", "LREN3", "RADL3"],
        "descricao": "Maiores empresas listadas na B3 por valor de mercado"
    },
    "small_caps": {
        "nome": "Small Caps",
        "tickers": ["SMLL3", "TASA4", "VIVR3", "AZUL4", "CVCB3", "MRFG3", "BPAN4", "SEER3", "POMO4", "ALSO3"],
        "descricao": "Empresas com potencial de crescimento, market cap entre R$300M e R$2B"
    },
    "fiis": {
        "nome": "Fundos Imobiliários (FIIs)",
        "tickers": ["HGLG11", "KNRI11", "XPLG11", "MXRF11", "BCFF11", "HGRE11", "IRDM11", "RECT11", "VISC11", "CPTS11"],
        "descricao": "Fundos de investimento imobiliário listados na B3"
    },
    "etfs": {
        "nome": "ETFs",
        "tickers": ["BOVA11", "IVVB11", "SMAL11", "BBDV11", "SPXI11", "XINA11", "USDB11", "ACWI11", "FIXA11", "IMAB11"],
        "descricao": "Fundos de índice (Exchange Traded Funds) negociados na B3"
    },
    "dividendos": {
        "nome": "Pagadoras de Dividendos",
        "tickers": ["ITSA4", "TAEE11", "CMIG4", "TRPL4", "EGIE3", "BBSE3", "SANB11", "FLRY3", "CSMG3", "ENGI11"],
        "descricao": "Empresas com histórico consistente de distribuição de dividendos"
    }
}

def analisar_categoria(categoria: str, perfil: str = "moderado", limite: int = 5) -> dict:
    """Analisa uma categoria específica e retorna as melhores oportunidades"""
    if categoria not in CATEGORIAS:
        return {"erro": f"Categoria '{categoria}' não encontrada"}
    
    config = CATEGORIAS[categoria]
    resultados = []
    
    for ticker in config["tickers"]:
        dados = get_dados_acao(ticker)
        if dados:
            score = score_acao(ticker, perfil, dados)
            resultados.append({
                "ticker": ticker,
                "score": score,
                "recomendacao": "Positivo" if score > 0.6 else "Neutro" if score > 0.4 else "Negativo",
                "metricas_resumo": {
                    "pl": dados.get("pl"),
                    "pvp": dados.get("pvp"),
                    "roe": dados.get("roe"),
                    "dividend_yield": dados.get("dividend_yield")
                }
            })
    
    resultados.sort(key=lambda x: x["score"], reverse=True)
    
    return {
        "categoria": categoria,
        "nome": config["nome"],
        "descricao": config["descricao"],
        "timestamp": datetime.now().isoformat(),
        "total_ativos": len(resultados),
        "melhores": resultados[:limite]
    }


def analisar_todas_categorias(perfil: str = "moderado", limite: int = 5) -> list:
    """Varre todas as categorias e retorna as melhores oportunidades de cada uma"""
    resultados = []
    for categoria in CATEGORIAS:
        try:
            resultado = analisar_categoria(categoria, perfil, limite)
            if "erro" not in resultado:
                resultados.append(resultado)
        except Exception as e:
            logger.error(f"Erro ao analisar categoria {categoria}: {e}")
    return resultados


def get_categorias() -> list:
    """Retorna a lista de categorias disponíveis"""
    return [
        {"slug": slug, **config}
        for slug, config in CATEGORIAS.items()
    ]
