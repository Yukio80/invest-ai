import logging
from datetime import datetime
from .data_pipeline import get_dados_acao
from .model import score_acao

logger = logging.getLogger(__name__)

PERFIS = {
    "conservador": {
        "nome": "Conservador",
        "descricao": "Prioriza segurança e renda previsível. Maior peso em renda fixa e FIIs.",
        "risco": "Baixo",
        "alocacao": {
            "dividendos": 0.35,
            "fiis": 0.30,
            "large_caps": 0.20,
            "etfs": 0.15
        }
    },
    "moderado": {
        "nome": "Moderado",
        "descricao": "Equilíbrio entre segurança e crescimento. Diversificação ampla.",
        "risco": "Médio",
        "alocacao": {
            "large_caps": 0.30,
            "fiis": 0.25,
            "dividendos": 0.20,
            "etfs": 0.15,
            "small_caps": 0.10
        }
    },
    "agressivo": {
        "nome": "Agressivo",
        "descricao": "Busca maior rentabilidade no longo prazo. Expõe-se a crescimento.",
        "risco": "Alto",
        "alocacao": {
            "large_caps": 0.30,
            "small_caps": 0.25,
            "etfs": 0.20,
            "fiis": 0.15,
            "dividendos": 0.10
        }
    },
    "especulativo": {
        "nome": "Especulativo",
        "descricao": "Máxima exposição a ativos de alto crescimento. Volatilidade elevada.",
        "risco": "Muito Alto",
        "alocacao": {
            "small_caps": 0.40,
            "etfs": 0.25,
            "large_caps": 0.20,
            "fiis": 0.10,
            "dividendos": 0.05
        }
    }
}

# Tickers de referência por categoria
TICKERS_POR_CATEGORIA = {
    "large_caps": ["PETR4", "VALE3", "ITUB4", "BBDC4", "ABEV3", "WEGE3", "BBAS3", "RENT3", "LREN3", "RADL3"],
    "small_caps": ["SMLL3", "TASA4", "VIVR3", "AZUL4", "CVCB3", "MRFG3", "BPAN4", "SEER3", "POMO4", "ALSO3"],
    "fiis": ["HGLG11", "KNRI11", "XPLG11", "MXRF11", "BCFF11", "HGRE11", "IRDM11", "RECT11", "VISC11", "CPTS11"],
    "etfs": ["BOVA11", "IVVB11", "SMAL11", "BBDV11", "SPXI11", "XINA11", "USDB11", "ACWI11", "FIXA11", "IMAB11"],
    "dividendos": ["ITSA4", "TAEE11", "CMIG4", "TRPL4", "EGIE3", "BBSE3", "SANB11", "FLRY3", "CSMG3", "ENGI11"]
}

def gerar_carteira(perfil: str, limite_por_categoria: int = 3):
    """Gera uma carteira recomendada completa para o perfil informado"""
    if perfil not in PERFIS:
        return {"erro": f"Perfil '{perfil}' não encontrado. Use: {list(PERFIS.keys())}"}

    config = PERFIS[perfil]
    alocacao = config["alocacao"]
    carteira = []
    score_total = 0.0
    total_ativos = 0

    for categoria, peso in alocacao.items():
        tickers = TICKERS_POR_CATEGORIA.get(categoria, [])
        resultados = []

        for ticker in tickers:
            dados = get_dados_acao(ticker)
            if dados:
                score = score_acao(ticker, perfil, dados)
                resultados.append({
                    "ticker": ticker,
                    "score": score,
                    "peso_sugerido": round(peso / max(len(tickers), 1), 4),
                    "metricas": {
                        "pl": dados.get("pl"),
                        "pvp": dados.get("pvp"),
                        "roe": dados.get("roe"),
                        "dividend_yield": dados.get("dividend_yield")
                    }
                })

        resultados.sort(key=lambda x: x["score"], reverse=True)
        selecionados = resultados[:limite_por_categoria]

        if selecionados:
            score_categoria = sum(a["score"] for a in selecionados) / len(selecionados)
            score_total += score_categoria * peso
            total_ativos += len(selecionados)

            carteira.append({
                "categoria": categoria,
                "peso_alocacao": peso,
                "percentual": f"{peso * 100:.0f}%",
                "score_medio": round(score_categoria, 2),
                "ativos": selecionados
            })

    return {
        "perfil": perfil,
        "nome": config["nome"],
        "descricao": config["descricao"],
        "risco": config["risco"],
        "timestamp": datetime.now().isoformat(),
        "score_total": round(score_total, 2),
        "total_ativos": total_ativos,
        "carteira": carteira
    }

def listar_perfis():
    """Retorna lista de perfis disponíveis"""
    return [
        {"slug": slug, "nome": p["nome"], "descricao": p["descricao"], "risco": p["risco"]}
        for slug, p in PERFIS.items()
    ]
