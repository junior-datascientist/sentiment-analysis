# Sentiment Analysis

A full-stack NLP application that serves an already-trained sentiment classifier through a Flask REST API and a Next.js interface. Reviews are classified as `Positive`, `Negative`, or `Neutral`.

## Technology stack

- Backend: Flask, joblib, scikit-learn
- Frontend: Next.js App Router, React, TypeScript, CSS Modules
- Model: existing `backend/models/nlp.joblib` scikit-learn pipeline
- No database, authentication, or dataset is included in the application code

## Project structure

```text
sentiment-analysis/
├─ backend/
│  ├─ app/
│  │  ├─ routes/
│  │  ├─ schemas/
│  │  ├─ services/
│  │  ├─ utils/
│  │  └─ __init__.py
│  ├─ data/
│  ├─ models/
│  │  └─ nlp.joblib
│  ├─ notebooks/
│  ├─ config.py
│  ├─ requirements.txt
│  └─ run.py
├─ frontend/
│  ├─ app/
│  ├─ components/
│  ├─ lib/
│  ├─ .env.example
│  ├─ package.json
│  └─ tsconfig.json
├─ .gitignore
└─ README.md
```

## Prerequisites

- Python 3.10 or newer
- Node.js 20 or newer
- npm
- The existing trained model at `backend/models/nlp.joblib`

## Backend setup

Open a PowerShell terminal in the project root:

```powershell
cd F:\D\AI\NLP\School\Works\sentiment-analysis\backend
python -m pip install -r requirements.txt
```

If you want to use the existing environment explicitly:

```powershell
& F:\D\AI\NLP\env\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

Start the Flask API:

```powershell
$env:PORT = "5000"
python run.py
```

The API will be available at `http://localhost:5000`. The model is loaded once at startup; the first load may take about two minutes in this environment.

Backend configuration is read from environment variables:

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `5000` | Flask port |
| `SENTIMENT_MODEL_PATH` | `backend/models/nlp.joblib` | Model file location |
| `MAX_TEXTS` | `100` | Maximum reviews per request |
| `MAX_TEXT_LENGTH` | `10000` | Maximum characters per review |
| `CORS_ORIGIN` | `http://localhost:3000,http://127.0.0.1:3000` | Allowed browser origins |

## Frontend setup

Use a second PowerShell terminal:

```powershell
cd F:\D\AI\NLP\School\Works\sentiment-analysis\frontend
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

For a production build:

```powershell
cd F:\D\AI\NLP\School\Works\sentiment-analysis\frontend
npm run build
npm run start
```

If the Flask API runs on another origin, update `frontend/.env.local`:

```powershell
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

## API documentation

### Health check

```http
GET /api/health
```

Example:

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method Get | ConvertTo-Json -Depth 6
```

### Prediction endpoint

```http
POST /api/sentiment/predict
```

The request body must contain either `text` or `texts`, but not both. Each review must be a non-empty string. A request may contain between 1 and 100 reviews.

Successful response shape:

```json
{
  "success": true,
  "count": 3,
  "results": [
    {
      "text": "The food was excellent.",
      "sentiment": "Positive",
      "confidence": 0.94
    }
  ]
}
```

`confidence` is the actual probability from the model's `predict_proba` output for the predicted label, rounded to four decimal places. It is omitted only if probability prediction is unavailable.

### Example single-review request

```powershell
$body = @{
  text = "The food was excellent and the service was amazing."
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "http://localhost:5000/api/sentiment/predict" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body | ConvertTo-Json -Depth 6
```

### Example multiple-review request

```powershell
$body = @{
  texts = @(
    "The food was excellent.",
    "The service was terrible.",
    "The restaurant was okay.",
    "I really like this place soo much and they have great experience",
    "Not good at all"
  )
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "http://localhost:5000/api/sentiment/predict" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body | ConvertTo-Json -Depth 6
```

Invalid requests return HTTP `400` with:

```json
{
  "success": false,
  "error": "Validation message"
}
```

Prediction failures return HTTP `503`, and unexpected server failures return HTTP `500`. Internal Python tracebacks are never returned to clients.

## Frontend functionality

- Single-review mode with a large textarea and `Predict Sentiment`
- Multiple-review mode with add/remove fields, bulk paste one review per line, and `Predict All`
- One batched API request for all reviews
- Separate result cards for every review
- Positive, Negative, and Neutral color-coded badges
- Confidence display when supplied by the API
- Counts per sentiment and total reviews analyzed
- Loading states, inline validation, API errors, and clear/reset actions
- Responsive layout for desktop and mobile

## Model notes and limitations

- The saved model is a complete scikit-learn `Pipeline`: `TfidfVectorizer` followed by `LogisticRegression`. The API passes raw review strings directly to it; no extra preprocessing is needed.
- Labels were derived from Yelp star ratings: 1–2 stars are `Negative`, 3 stars are `Neutral`, and 4–5 stars are `Positive`.
- The model is trained on English Yelp-style reviews. Short, sarcastic, domain-specific, or non-English text may be classified poorly.
- The notebook evaluation reported about `0.84` accuracy. Neutral is the weakest class, with an F1 score around `0.46`; predictions and confidence scores are estimates, not ground truth.
- Do not retrain, replace, or modify `backend/models/nlp.joblib` when using this application.

## Data protection

- The original Yelp dataset and all generated data files are kept outside the application source and are ignored by Git.
- The existing ignore rules for `backend/data/raw/*` and `backend/notebooks/*` are preserved.
- No CSV, JSON, or raw dataset files are copied into `frontend/` or `backend/app/`.
- The trained model remains available locally at `backend/models/nlp.joblib`.
