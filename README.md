# AI Health Public ChatBot

This repository contains the full AI Health ChatBot project with a Next.js frontend and an Express/TypeScript backend.

## Structure

- `frontend/` — Next.js app for the user interface
- `backend/` — Express API server written in TypeScript

## Local development

Install dependencies and run both apps locally:

```powershell
cd "c:\Users\megha\Downloads\AI ChatBot\AI ChatBot"
npm install
cd backend
npm install
cd ../frontend
npm install
```

Run each project separately:

```powershell
cd backend
npm run dev

cd ../frontend
npm run dev
```

## GitHub Actions

This repo includes two workflows:

- `CI` builds both `backend` and `frontend` on every push and pull request.
- `Deploy frontend to Vercel` publishes the `frontend` folder to Vercel on `main`.

### Required GitHub secrets

Set these repository secrets in GitHub before deploying:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Vercel deployment

The frontend deploy workflow publishes the `frontend` app to Vercel.

If you want the whole backend deployed as well, host the backend on a Node-compatible service such as Railway, Render, or Heroku.

## Notes

- Do not commit secrets or `.env` files.
- The backend build is validated in CI, but backend hosting is separate from the frontend Vercel deployment.
