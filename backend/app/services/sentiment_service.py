import logging
import math
from pathlib import Path
from typing import Any

import joblib

from app.utils.errors import ModelPredictionError


logger = logging.getLogger(__name__)


class SentimentService:
    def __init__(self, model_path: Path) -> None:
        try:
            self.model: Any = joblib.load(model_path)
        except Exception as exc:
            raise ModelPredictionError("Sentiment model could not be loaded.") from exc

        if not hasattr(self.model, "predict"):
            raise ModelPredictionError("Loaded model does not support prediction.")

        self.classes = self._read_classes()
        self.supports_probabilities = hasattr(self.model, "predict_proba")

    def predict(self, texts: list[str]) -> list[dict[str, Any]]:
        try:
            labels = self.model.predict(texts)
        except Exception as exc:
            raise ModelPredictionError("Prediction failed.") from exc

        probabilities = (
            self._get_probabilities(texts) if self.supports_probabilities else None
        )

        return [
            self._format_result(
                text,
                str(labels[index]),
                probabilities[index] if probabilities is not None else None,
            )
            for index, text in enumerate(texts)
        ]

    def health_info(self) -> dict[str, Any]:
        return {
            "model_loaded": True,
            "supports_confidence": self.supports_probabilities,
            "labels": self.classes,
        }

    def _read_classes(self) -> list[str]:
        estimator = self.model
        if hasattr(self.model, "steps") and self.model.steps:
            estimator = self.model.steps[-1][1]

        classes = getattr(estimator, "classes_", None)
        if classes is None or len(classes) == 0:
            raise ModelPredictionError("Loaded model does not expose prediction labels.")

        return [str(label) for label in classes]

    def _get_probabilities(self, texts: list[str]) -> Any:
        try:
            probabilities = self.model.predict_proba(texts)
        except Exception as exc:
            logger.warning("Probability prediction unavailable: %s", exc)
            return None

        if probabilities is None or len(probabilities) != len(texts):
            logger.warning("Probability prediction returned an unexpected shape.")
            return None

        return probabilities

    def _format_result(
        self,
        text: str,
        label: str,
        probabilities: Any,
    ) -> dict[str, Any]:
        result: dict[str, Any] = {"text": text, "sentiment": label}

        if probabilities is None:
            return result

        try:
            if len(probabilities) != len(self.classes) or label not in self.classes:
                return result

            confidence = float(probabilities[self.classes.index(label)])
            if math.isfinite(confidence):
                result["confidence"] = round(confidence, 4)
        except (TypeError, ValueError, IndexError):
            logger.warning("Confidence score could not be read from model output.")

        return result
