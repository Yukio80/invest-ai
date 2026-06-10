from fastapi import APIRouter, HTTPException
from ..models.schemas import AnaliseRequest, AnaliseResponse
from ..services.data_pipeline import get_dados_acao
from ..services.model import score_acao
from ..services.shap_explainer import gerar_explicacao_shap

router = APIRouter()

@router.post("/analisar", response_model=AnaliseResponse)
def analisar(request: AnaliseRequest):
    dados = get_dados_acao(request.ticker)
    if not dados:
        raise HTTPException(status_code=404, detail="Ação não encontrada")
    
    # Agora passamos os dados para o score_acao calcular a nota real
    score = score_acao(request.ticker, request.perfil, dados)
    
    return AnaliseResponse(
        ticker=request.ticker,
        score=score,
        recomendacao="Positivo" if score > 0.6 else "Neutro" if score > 0.4 else "Negativo",
        explicacao=f"A ação {request.ticker} apresenta score {score} para o perfil {request.perfil} com base em métricas fundamentalistas.",
        metricas=dados,
        shap=gerar_explicacao_shap(request.ticker, None, dados),
        disclaimer="Esta análise é informativa e não constitui recomendação de investimento conforme regulação CVM."
    )
