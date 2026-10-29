# Free demo deployment: Vercel + Render

Status: configuration prepared and checked locally; no hosted services created yet.

The selected setup is Vercel for the React frontend and Render's free Python web
service for the backend. Render's free filesystem is temporary: saved assessments,
messages and the shared Gemini counter may reset on restart, redeploy or idle
spin-down. The 50-attempt cap applies to the current database, rather than the
lifetime of a free service. A public demo starts with a new empty database; local
visitor records and the local counter are not uploaded.

## Backend

Import the repository as a Render Blueprint using the root `render.yaml`. It
selects the Free plan, the `backend` directory, Python 3.14.0 (the locally tested
version), the existing requirements and model, and `/health` for startup checks.

Render prompts for two values:

- `GEMINI_API_KEY`: enter the key directly in Render; never put it in Git or chat.
- `CORS_ORIGINS`: the exact frontend origin, such as
  `https://your-project.vercel.app`, without a trailing slash. If the frontend
  project has not been created yet, use `http://localhost:5173` temporarily and
  update this setting after Vercel assigns the production domain.

Wait for the service to report healthy, then record its public HTTPS URL and
verify `GET /health` returns `{"status":"ok"}`. Free services may sleep after
inactivity, so their first request can take longer than a normal request.

## Frontend

Import the same GitHub repository into Vercel with these settings:

| Setting | Value |
| --- | --- |
| Root Directory | `frontend` |
| Framework Preset | Vite |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Environment variable | `VITE_API_BASE=https://your-backend.onrender.com` |

`frontend/vercel.json` records the build settings. The Vite configuration rejects
missing, insecure, loopback and credential-bearing backend URLs on Vercel so the
site cannot silently target a visitor's local machine. `VITE_API_BASE` is public
and embedded at build time; changing it requires redeployment. Keep the Gemini
key only on the backend.

After the frontend has a domain, update Render's `CORS_ORIGINS` to that exact
origin and allow the backend to redeploy. Preview domains require their own
explicit CORS entries if they also need API access.

## Verification before sharing

Check the public health endpoint, complete one check-in and view its history,
verify one real chat reply, verify the fixed crisis response without consuming
an AI call, and delete the synthetic session. Check the site from a different
device to confirm it uses the hosted API. Each live non-crisis chat attempt
consumes one backend budget slot, including provider failures.

Local verification completed during preparation: frontend tests pass; the Vercel
build succeeds with a public HTTPS backend setting; missing, local and
credential-bearing settings are rejected. Hosted verification remains pending.

References: [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite),
[Render Blueprints](https://render.com/docs/blueprint-spec),
[Render free-service limits](https://render.com/docs/free).
