from config import MAX_TEXT_LENGTH, MAX_TEXTS

from app.utils.errors import ValidationError


def parse_prediction_request(payload: object) -> list[str]:
    if not isinstance(payload, dict):
        raise ValidationError("Request body must be a JSON object.")

    has_text = "text" in payload
    has_texts = "texts" in payload

    if has_text == has_texts:
        raise ValidationError("Provide either 'text' or 'texts', but not both.")

    if has_text:
        return [_validate_text(payload["text"], "text")]

    return _validate_text_list(payload["texts"])


def _validate_text_list(value: object) -> list[str]:
    if not isinstance(value, list):
        raise ValidationError("'texts' must be an array of strings.")

    if not value:
        raise ValidationError("'texts' must contain at least one review.")

    if len(value) > MAX_TEXTS:
        raise ValidationError(f"'texts' may contain at most {MAX_TEXTS} reviews.")

    return [
        _validate_text(text, f"texts[{index}]")
        for index, text in enumerate(value)
    ]


def _validate_text(value: object, field_name: str) -> str:
    if not isinstance(value, str):
        raise ValidationError(f"{field_name} must be a string.")

    text = value.strip()

    if not text:
        raise ValidationError(f"{field_name} must not be empty.")

    if len(text) > MAX_TEXT_LENGTH:
        raise ValidationError(
            f"{field_name} must be at most {MAX_TEXT_LENGTH} characters."
        )

    return text
