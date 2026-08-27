# NutriScan

NutriScan helps users understand packaged-food ingredients in the context of their health profile. Users can create an account, complete onboarding, scan an ingredient label, receive OCR and AI analysis, save scan results, review history, and manage favourites.

The repository contains two JavaScript applications and one optional Python service:

| Folder | Purpose | Default address |
| --- | --- | --- |
| `frontend/` | React 19 single-page application and installable PWA | `http://localhost:3000` |
| `backend/` | Express API, session authentication, MongoDB persistence, Azure OCR, and Groq analysis | `http://localhost:5000` |
| `backend_ai/` | Separate FastAPI service using Azure OpenAI and Open Food Facts (No needed for now) | `http://localhost:8000` |

## How the application works

1. The frontend authenticates against the Express backend using an HTTP-only session cookie.
2. A user completes an optional health profile containing age, weight, height, conditions, and allergies.
3. The scanner sends an image as binary data to the backend's Azure OCR endpoint.
4. The extracted ingredient text is sent to the backend's Groq analysis endpoint together with the user's profile.
5. The frontend displays the structured verdict and can save it to the user's scan history.
6. User profiles, scans, and favourites are persisted in MongoDB. The frontend also uses IndexedDB through Dexie for local profile, history, favourites, and ingredient-cache data.

> The `backend_ai/` service is an alternative analysis flow. The current frontend services call `backend/` directly, so this Python service is not required for the standard frontend workflow. Also it is not finished completely.

## Prerequisites

- Node.js 18 or newer and npm
- MongoDB, either a MongoDB Atlas URI or a local MongoDB server
- Azure Computer Vision Read API credentials for OCR
- A Groq API key for ingredient analysis
- Google OAuth credentials if Google sign-in is enabled
- Python 3.9 or newer only when using `backend_ai/`

## Clone the repository

```bash
git clone https://github.com/LebelLens/NutriScan.git
cd NutriScan
```

## Environment variables

### Backend

Create `backend/.env`:

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# MongoDB Atlas and/or local MongoDB
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/<database>
LOCAL_MONGO_URI=mongodb://127.0.0.1:27017/nutriscan

# Used as the express-session secret
JWT_SECRET=replace-with-a-long-random-value

# Azure Computer Vision Read API
AZURE_OCR_ENDPOINT=https://<resource>.cognitiveservices.azure.com
AZURE_OCR_API_KEY=replace-with-your-azure-key

# Groq ingredient analysis
GROQ_API_KEY=replace-with-your-groq-key

# Google OAuth (required only for Google sign-in)
GOOGLE_CLIENT_ID=replace-with-your-client-id
GOOGLE_CLIENT_SECRET=replace-with-your-client-secret
```

`MONGO_URI` is tried first. If that connection fails, the server attempts `LOCAL_MONGO_URI`. Use a strong, unique `JWT_SECRET` in every non-development environment. Do not commit `.env` files or API keys.

### Frontend

Create `frontend/.env` only when the API is not running at the default address:

```env
VITE_API_URL=http://localhost:5000
```

The frontend falls back to `http://localhost:5000` when `VITE_API_URL` is not set. Vite serves the application on port `3000`; the Vite proxy also forwards `/api` requests to the configured backend.

### Optional Python AI service

The service reads these variables from `backend_ai/.env`:

```env
AZURE_OPENAI_KEY=replace-with-your-azure-openai-key
AZURE_OPENAI_ENDPOINT=https://<resource>.openai.azure.com
AZURE_OPENAI_MODEL_DEPLOYMENT=replace-with-your-deployment-name
```

## Installation and local development

Open three terminals from the repository root.

### 1. Start the Express backend

```bash
cd backend
npm install
node app.js
```

For automatic restarts during development:

```bash
npx nodemon app.js
```

The server listens on `http://localhost:5000` unless `PORT` is configured.

### 2. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`. Available frontend scripts:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

### 3. Start the optional FastAPI service

```bash
cd backend_ai
python -m venv .venv

# Windows PowerShell
.\.venv\Scripts\Activate.ps1

pip install fastapi uvicorn requests python-dotenv openai pydantic
uvicorn main:app --reload --port 8000
```

The available endpoint is `POST http://localhost:8000/analyze-product`. It expects:

```json
{
  "product_url": "https://world.openfoodfacts.org/api/v2/product/<barcode>",
  "user_health": {
    "diabetes": true,
    "bp": false,
    "allergies": ["peanut"]
  }
}
```

## Frontend structure

- `src/App.jsx` defines the application routes and authentication guards.
- `src/Pages/` contains Splash, Login, Signup, Onboarding, Home, Scanner, Results, History, and Profile screens.
- `src/Components/` contains reusable UI such as the camera, scanner, navbar, footer, previous searches, and profile views.
- `src/Hooks/` contains API hooks for login, signup, user data, profiles, scans, and saving scans.
- `src/Context/authContext.jsx` stores the current authenticated user and authentication-checking state.
- `src/Services/azureOCR.js` uploads label images to `/api/ai/ocr`.
- `src/Services/groqAnalyze.js` sends ingredient text and the health profile to `/api/ai/analyze`.
- `src/Services/db.js` defines the local Dexie database `NutriScanDB`.
- `src/index.css` and Tailwind configuration provide application styling.

### Frontend routes

| Route | Screen | Access |
| --- | --- | --- |
| `/` | Splash | Public |
| `/login` | Login | Public; authenticated users are redirected to `/home` |
| `/signup` | Signup | Public |
| `/onboarding` | Health profile setup | Public route, normally reached after signup or Google login |
| `/home` | Dashboard | Authenticated users |
| `/scan` | Scanner | Authenticated users |
| `/results` | Analysis results | Authenticated users |
| `/history` | Saved scan history | Authenticated users |
| `/profile` | User profile | Authenticated users |

### Local IndexedDB data

Dexie creates `NutriScanDB` with these tables:

- `userProfile`: the local copy of the user's profile
- `scans`: locally stored scan results and timestamps
- `favorites`: locally stored favourite products
- `ingredientCache`: cached ingredient descriptions, risks, and alternatives

## Backend structure

- `app.js` loads environment variables, configures CORS, JSON/body parsing, sessions, Passport, MongoDB, and routes.
- `config/passport.js` configures local and Google authentication.
- `middleware/auth.js` protects authenticated endpoints.
- `models/` contains the Mongoose `User`, `HealthData`, and `Scan` schemas.
- `routes/user.js` handles signup, login, Google OAuth, session checks, profile checks, and logout.
- `routes/healthroute.js` creates, reads, and updates the authenticated user's health data.
- `routes/scan.js` saves, lists, reads, deletes, and favourites scans for the authenticated user.
- `routes/ingredient.js` looks up ingredient details from stored scan data.
- `routes/ai.js` proxies OCR requests to Azure Computer Vision and analysis requests to Groq.

## Backend API

All routes below are prefixed with `http://localhost:5000` in local development. Routes marked **Auth** require the session cookie created by login or signup.

### Authentication: `/api/users`

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| `POST` | `/signup` | No | Create an account and start a session |
| `POST` | `/login` | No | Log in with email and password |
| `GET` | `/auth/google` | No | Start Google OAuth |
| `GET` | `/auth/google/callback` | No | Complete Google OAuth |
| `GET` | `/login/success` | No | Check the current Passport session |
| `GET` | `/profile` | Yes | Return the authenticated user's basic profile |
| `POST` | `/logout` | Yes | Destroy the session and clear the cookie |

### Health data: `/api/health`

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| `POST` | `/` | Yes | Create or update onboarding health data |
| `GET` | `/` | Yes | Get the authenticated user's health data |
| `PUT` | `/` | Yes | Update health conditions and allergies |

Health data fields include `age`, `weight`, `height`, `healthCondition` (array), and `allergy` (array).

### Scans: `/api/scan`

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| `POST` | `/` | Yes | Save a scan result |
| `GET` | `/` | Yes | List the authenticated user's scans |
| `GET` | `/:id` | Yes | Get one of the user's scans |
| `DELETE` | `/:id` | Yes | Delete one of the user's scans |
| `PATCH` | `/:id/favourite` | Yes | Toggle a scan's favourite state |

Required fields when saving a scan are `productName`, `verdict`, and `riskLevel`. Other supported fields include `summary`, `flaggedIngredients`, and `positiveHighlights`.

### AI and ingredients

| Method | Endpoint | Auth | Body / purpose |
| --- | --- | --- | --- |
| `POST` | `/api/ai/ocr` | Yes | Send an image as `application/octet-stream` for Azure OCR |
| `POST` | `/api/ai/analyze` | Yes | Send JSON containing `ingredientText` and `userProfile` for Groq analysis |
| `GET` | `/api/ingredients/:name` | Yes | Look up a stored ingredient by name |

The analysis response is JSON with a verdict (`safe`, `caution`, or `avoid`), risk level, summary, flagged ingredients, positive highlights, and alternatives.

## Data models

- **User:** name, unique email, optional password or Google ID, onboarding status, health-data reference, and scan references.
- **HealthData:** user reference, age, weight, height, health conditions, allergies, and timestamps.
- **Scan:** user reference, product name, verdict, risk level, flagged ingredients, positive highlights, favourite state, summary, and creation date.

## Production notes

- Set `NODE_ENV=production`, use HTTPS, and set `FRONTEND_URL` and `BACKEND_URL` to the deployed origins.
- Because authentication uses cookies, frontend and backend CORS settings must allow the exact frontend origin and credentials.
- Use a persistent session store for production instead of the default in-memory `express-session` store.
- Restrict `backend_ai` CORS from `"*"` to the deployed frontend origin before exposing it publicly.
- Keep Azure, Groq, Google, MongoDB, and session secrets server-side. Only variables beginning with `VITE_` are exposed to the browser.
- Build the frontend with `npm run build`; serve the generated `frontend/dist/` directory with a static host or CDN.

## Troubleshooting

### The frontend cannot reach the API

Confirm that the backend is running on port `5000`, that `frontend/.env` contains the correct `VITE_API_URL`, and that the backend `FRONTEND_URL` matches the browser origin.

### Login succeeds but protected requests return 401

Requests must include credentials. The frontend already uses `credentials: 'include'` for its API calls. In production, use HTTPS and verify the cookie's `secure`, `sameSite`, CORS, and proxy configuration.

### MongoDB does not connect

Check the connection strings, database network access rules, and local MongoDB service. The backend tries `MONGO_URI` first and then `LOCAL_MONGO_URI`.

### OCR or analysis fails

Check the corresponding Azure or Groq environment variables and inspect the backend logs. OCR requests must use an image body with `Content-Type: application/octet-stream`; analysis requests must include non-empty `ingredientText`.

## License

No project license has been specified yet.