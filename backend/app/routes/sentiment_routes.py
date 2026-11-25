from flask import Blueprint, current_app, jsonify, request

from app.schemas.sentiment_schema import parse_prediction_request


sentiment_blueprint = Blueprint("sentiment", __name__, url_prefix="/api")


@sentiment_blueprint.get("/health")
def health() -> tuple:
    service = current_app.extensions["sentiment_service"]
    return jsonify({"success": True, "status": "ok", **service.health_info()}), 200


@sentiment_blueprint.post("/sentiment/predict")
def predict_sentiment() -> tuple:
    payload = request.get_json(silent=True)
    texts = parse_prediction_request(payload)
    service = current_app.extensions["sentiment_service"]
    results = service.predict(texts)

    return jsonify({"success": True, "count": len(results), "results": results}), 200
