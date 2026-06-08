from pydantic import BaseModel
from typing import List, Optional

class AnaliseRequest(BaseModel):
    ticker: str
    perfil: str

class ShapFeature(BaseModel):
    feature: str
    valor: float
    impacto: float

class AnaliseResponse(BaseModel):
    ticker: str
    score: float
    recomendacao: str
    explicacao: str
    metricas: dict
    shap: List[ShapFeature]
    disclaimer: str
