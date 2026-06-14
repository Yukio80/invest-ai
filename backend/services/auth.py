import os
from datetime import date
from typing import Optional
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import requests

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY", "")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")
JWT_SECRET = os.environ.get("SUPABASE_JWT_SECRET", SUPABASE_ANON_KEY)

DAILY_LIMIT_FREE = int(os.environ.get("DAILY_LIMIT_FREE", "10"))

security = HTTPBearer(auto_error=False)

_headers = lambda: {
    "apikey": SUPABASE_SERVICE_KEY or SUPABASE_ANON_KEY,
    "Authorization": f"Bearer {SUPABASE_SERVICE_KEY or SUPABASE_ANON_KEY}",
    "Content-Type": "application/json",
}

def _supabase_request(method, table, params=None, body=None):
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    h = _headers()
    if method == "GET":
        r = requests.get(url, headers=h, params=params)
    elif method == "POST":
        r = requests.post(url, headers=h, json=body, params=params)
    elif method == "PATCH":
        r = requests.patch(url, headers=h, json=body, params=params)
    else:
        raise ValueError(f"Unsupported method {method}")
    r.raise_for_status()
    return r.json() if r.text else []


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> dict:
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de autenticação ausente",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials
    try:
        payload = jwt.decode(
            token, JWT_SECRET, algorithms=["HS256"], options={"verify_aud": False},
        )
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Token inválido: sem sub")
        return {
            "id": user_id,
            "email": payload.get("email", ""),
            "role": payload.get("role", "authenticated"),
        }
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token inválido: {str(e)}",
        )


async def verificar_cota(
    request: Request,
    user: dict = Depends(get_current_user),
) -> dict:
    today = date.today().isoformat()
    endpoint = request.url.path

    try:
        rows = _supabase_request("GET", "usage", params={
            "user_id": f"eq.{user['id']}",
            "endpoint": f"eq.{endpoint}",
            "date": f"eq.{today}",
            "select": "count",
            "limit": "1",
        })
        current_count = rows[0]["count"] if rows else 0
    except Exception:
        current_count = 0

    if current_count >= DAILY_LIMIT_FREE:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail={
                "message": f"Limite diário de {DAILY_LIMIT_FREE} consultas atingido para este endpoint.",
                "daily_limit": DAILY_LIMIT_FREE,
                "endpoint": endpoint,
            },
        )

    try:
        if rows:
            _supabase_request("PATCH", "usage", params={
                "user_id": f"eq.{user['id']}",
                "endpoint": f"eq.{endpoint}",
                "date": f"eq.{today}",
            }, body={"count": current_count + 1})
        else:
            _supabase_request("POST", "usage", body={
                "user_id": user["id"],
                "endpoint": endpoint,
                "date": today,
                "count": 1,
            })
    except Exception:
        pass  # falha na contagem não quebra a request

    return user
