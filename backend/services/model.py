import pandas as pd
import os
import joblib

MODEL_PATH = "backend/models/model.pkl"

# Pesos por perfil (Soma = 1.0)
PERFIL_WEIGHTS = {
    "conservador": {"dividend_yield": 0.4, "pvp": 0.3, "roe": 0.2, "margem_liquida": 0.1},
    "moderado": {"dividend_yield": 0.2, "pvp": 0.2, "roe": 0.3, "margem_liquida": 0.3},
    "agressivo": {"dividend_yield": 0.1, "pvp": 0.1, "roe": 0.4, "margem_liquida": 0.4},
    "especulativo": {"dividend_yield": 0.05, "pvp": 0.05, "roe": 0.45, "margem_liquida": 0.5},
}

def normalize(value, min_val, max_val):
    """Normaliza um valor entre 0 e 1"""
    if max_val == min_val: return 0.5
    return (value - min_val) / (max_val - min_val)

def score_acao(ticker: str, perfil: str, dados: dict) -> float:
    """Calcula score real com base nos dados fundamentalistas e perfil"""
    if not dados:
        return 0.0
    
    weights = PERFIL_WEIGHTS.get(perfil, PERFIL_WEIGHTS["moderado"])
    score = 0.0
    
    # Métricas a considerar (Simplificado para MVP)
    # Para P/VP, quanto menor, melhor (inversão)
    metrics = {
        "dividend_yield": dados.get("dividend_yield", 0) or 0,
        "pvp": 1 / (dados.get("pvp", 1) or 1), 
        "roe": dados.get("roe", 0) or 0,
        "margem_liquida": dados.get("margem_liquida", 0) or 0,
    }
    
    # Cálculo ponderado
    for metric, weight in weights.items():
        val = metrics.get(metric, 0)
        # Normalização simples (heurística para MVP)
        norm_val = min(max(val * 10, 0), 1) if metric != "pvp" else min(max(val, 0), 1)
        score += norm_val * weight
        
    return round(score, 2)
