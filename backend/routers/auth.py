from fastapi import APIRouter, Depends
from ..services.auth import get_current_user, verificar_cota

router = APIRouter()

@router.get("/me")
def me(user: dict = Depends(get_current_user)):
    return {"user": user}

@router.get("/usage")
def usage(user: dict = Depends(verificar_cota)):
    return {"status": "ok", "user_id": user["id"]}
