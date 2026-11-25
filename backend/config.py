import os
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = Path(
    os.getenv("SENTIMENT_MODEL_PATH", BASE_DIR / "models" / "nlp.joblib")
).resolve()
PORT = int(os.getenv("PORT", "5000"))
MAX_TEXTS = int(os.getenv("MAX_TEXTS", "100"))
MAX_TEXT_LENGTH = int(os.getenv("MAX_TEXT_LENGTH", "10000"))
CORS_ORIGINS = tuple(
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGIN", "http://localhost:3000,http://127.0.0.1:3000"
    ).split(",")
    if origin.strip()
)
