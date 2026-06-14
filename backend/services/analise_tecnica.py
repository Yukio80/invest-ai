import yfinance as yf
import pandas as pd
import logging

logger = logging.getLogger(__name__)

def calcular_sma(df: pd.DataFrame, periodo: int) -> pd.Series:
    return df['Close'].rolling(window=periodo).mean()

def calcular_rsi(df: pd.DataFrame, periodo: int = 14) -> float:
    delta = df['Close'].diff()
    gain = delta.where(delta > 0, 0).rolling(window=periodo).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=periodo).mean()
    rs = gain / loss.replace(0, float('nan'))
    rsi = 100 - (100 / (1 + rs))
    return round(rsi.iloc[-1], 2) if not rsi.iloc[-1:].isna().all() else 50.0

def calcular_macd(df: pd.DataFrame) -> dict:
    ema_12 = df['Close'].ewm(span=12).mean()
    ema_26 = df['Close'].ewm(span=26).mean()
    macd_line = ema_12 - ema_26
    signal = macd_line.ewm(span=9).mean()
    histogram = macd_line - signal
    return {
        "macd": round(macd_line.iloc[-1], 2),
        "signal": round(signal.iloc[-1], 2),
        "histogram": round(histogram.iloc[-1], 2)
    }

def analisar_tecnica(ticker: str, periodo: str = "6mo") -> dict:
    """Análise técnica completa de um ativo"""
    try:
        df = yf.download(f"{ticker}.SA", period=periodo, progress=False)
        if df.empty:
            return {"erro": f"Sem dados para {ticker}"}

        preco_atual = round(df['Close'].iloc[-1], 2)
        sma_20 = round(calcular_sma(df, 20).iloc[-1], 2)
        sma_50 = round(calcular_sma(df, 50).iloc[-1], 2)
        rsi = calcular_rsi(df)
        macd = calcular_macd(df)
        max_52s = round(df['Close'].max(), 2)
        min_52s = round(df['Close'].min(), 2)

        # Sinal simples
        sinais = []
        if preco_atual > sma_20: sinais.append("Acima da SMA20 (alta curto prazo)")
        else: sinais.append("Abaixo da SMA20 (baixa curto prazo)")
        if preco_atual > sma_50: sinais.append("Acima da SMA50 (alta médio prazo)")
        else: sinais.append("Abaixo da SMA50 (baixa médio prazo)")
        if rsi > 70: sinais.append("RSI sobrecomprado (>70)")
        elif rsi < 30: sinais.append("RSI sobrevendido (<30)")
        if macd["histogram"] > 0: sinais.append("MACD positivo (momento altista)")
        else: sinais.append("MACD negativo (momento baixista)")

        # Últimos 60 dias para o gráfico
        historico = df.tail(60).reset_index()
        dados_grafico = []
        for _, row in historico.iterrows():
            data_str = row['Date'].strftime('%Y-%m-%d') if hasattr(row['Date'], 'strftime') else str(row['Date'])[:10]
            dados_grafico.append({
                "data": data_str,
                "fechamento": round(row['Close'], 2),
                "sma20": round(calcular_sma(df, 20).loc[row.name], 2) if row.name in calcular_sma(df, 20).index else None,
                "sma50": round(calcular_sma(df, 50).loc[row.name], 2) if row.name in calcular_sma(df, 50).index else None
            })

        return {
            "ticker": ticker,
            "preco_atual": preco_atual,
            "sma_20": sma_20,
            "sma_50": sma_50,
            "rsi": rsi,
            "macd": macd,
            "max_52_semanas": max_52s,
            "min_52_semanas": min_52s,
            "sinais": sinais,
            "dados_grafico": dados_grafico
        }

    except Exception as e:
        logger.error(f"Erro na análise técnica de {ticker}: {e}")
        return {"erro": str(e)}
