import sys
import os

# Adiciona a raiz do projeto ao path do Python
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.main import app
