import type { ApiErrorResponse, PredictionPayload, PredictionResponse } from "./types";


const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000"
).replace(/\/$/, "");

type ApiResponse = PredictionResponse | ApiErrorResponse;

export async function predictSentiment(
  payload: PredictionPayload,
): Promise<PredictionResponse> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/api/sentiment/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      "Could not connect to the prediction API. Check that the Flask server is running.",
    );
  }

  const data = await parseResponse(response);

  if (!response.ok || !data.success) {
    const message = "error" in data ? data.error : null;
    throw new Error(message ?? `Prediction failed with status ${response.status}.`);
  }

  return data;
}

async function parseResponse(response: Response): Promise<ApiResponse> {
  try {
    return (await response.json()) as ApiResponse;
  } catch {
    throw new Error("The API returned an invalid response.");
  }
}
