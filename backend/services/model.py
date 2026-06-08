import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
import os
import joblib

MODEL_PATH = "backend/models/lgbm_model.pkl"

def treinar_modelo_inicial():
    """Treino inicial simples para o MVP usando scikit-learn"""
    # Placeholder para dados de treino
    X = pd.DataFrame({"pl": [5, 10, 15], "pvp": [1, 2, 3], "roe": [0.1, 0.2, 0.3]})
    y = [0.1, 0.2, 0.3]
    
    # Substituindo LightGBM por GradientBoostingRegressor
    model = GradientBoostingRegressor()
    model.fit(X, y)
    
    os.makedirs("backend/models", exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    return model

def score_acao(ticker: str, perfil: str) -> float:
    """Retorna score baseado no modelo"""
    if not os.path.exists(MODEL_PATH):
        treinar_modelo_inicial()
        
    model = joblib.load(MODEL_PATH)
    # Simulação de inferência
    return 0.85
