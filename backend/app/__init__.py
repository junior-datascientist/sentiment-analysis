from flask import Flask, jsonify, request
from werkzeug.exceptions import HTTPException

from app.routes.sentiment_routes import sentiment_blueprint
from app.services.sentiment_service import SentimentService
from app.utils.errors import ModelPredictionError, ValidationError
from config import CORS_ORIGINS, MODEL_PATH


def create_app() -> Flask:
    app = Flask(__name__)
    app.extensions["sentiment_service"] = SentimentService(MODEL_PATH)

    app.register_blueprint(sentiment_blueprint)
    _register_error_handlers(app)
    _register_cors(app)

    return app


def _register_error_handlers(app: Flask) -> None:
    @app.errorhandler(ValidationError)
    def handle_validation_error(error: ValidationError) -> tuple:
        return jsonify({"success": False, "error": str(error)}), 400

    @app.errorhandler(ModelPredictionError)
    def handle_model_error(error: ModelPredictionError) -> tuple:
        return jsonify({"success": False, "error": str(error)}), 503

    @app.errorhandler(HTTPException)
    def handle_http_error(error: HTTPException) -> tuple:
        return (
            jsonify({"success": False, "error": error.description or "Request failed."}),
            error.code or 500,
        )

    @app.errorhandler(Exception)
    def handle_unexpected_error(error: Exception) -> tuple:
        app.logger.exception("Unexpected API error", exc_info=error)
        return jsonify({"success": False, "error": "Internal server error."}), 500


def _register_cors(app: Flask) -> None:
    @app.before_request
    def handle_preflight() -> tuple | None:
        if request.method == "OPTIONS" and "Access-Control-Request-Method" in request.headers:
            return "", 204
        return None

    @app.after_request
    def add_cors_headers(response):
        origin = request.headers.get("Origin")
        allowed_origin = origin if origin in CORS_ORIGINS else (
            CORS_ORIGINS[0] if CORS_ORIGINS else "*"
        )

        response.headers["Access-Control-Allow-Origin"] = allowed_origin
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        response.headers["Access-Control-Max-Age"] = "600"
        response.headers["Vary"] = "Origin"

        return response
