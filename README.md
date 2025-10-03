# Task Tracker CRUD App

Full-stack Task Tracker built with Django REST + PostgreSQL and React + Tailwind.

## Features
- JWT auth: register, login
- Tasks: create, read, update, delete
- Filters: status, priority, title search, sorting, pagination
- Clean responsive UI (Tailwind)
- Dockerized: backend, frontend, Postgres
- Tests: backend `pytest`, simple frontend tests

## Repo Structure
- `backend/` Django project `core`, apps: `tasks`, `users`
- `frontend/` React (Vite) + Tailwind
- `docker-compose.yml`, `.env.example`, `README.md`

## Local Development
1. Copy `.env.example` to `.env` and adjust values if needed.
2. Backend (SQLite fallback):
   - `cd backend`
   - `pip install -r requirements.txt`
   - `python manage.py migrate`
   - `python manage.py createsuperuser` (optional)
   - `python manage.py create_demo_user` (demo: `demo` / `demo12345`)
   - `python manage.py runserver`
3. Frontend:
   - `cd frontend`
   - `npm install`
   - `npm run dev`

Open `http://localhost:5173/` (or port auto-chosen) for UI.

## Docker
1. Ensure Docker is installed.
2. `docker-compose up --build`
3. Backend at `http://localhost:8000/`, Frontend at `http://localhost:5173/`

## API Endpoints
- `POST /api/auth/register/` { username, email, password }
- `POST /api/auth/token/` { username, password }
- `GET /api/tasks/` list with filters: `status`, `priority`, `search`, `ordering`, `page`
- `POST /api/tasks/` create
- `GET /api/tasks/:id/` retrieve
- `PUT /api/tasks/:id/` update
- `DELETE /api/tasks/:id/` delete

## Tests
- Backend: `cd backend && pytest`
- Frontend: `cd frontend && npm test` (sample test added)

## Deployment (Render)
You can deploy both backend and frontend on Render in minutes.

### One-click (Blueprint)
- Commit and push this repo to GitHub.
- In Render, choose “Blueprint” and point to `render.yaml` in the repo.
- This provisions:
  - `inzint-backend` (Python Web Service) with Postgres `inzint-db`.
  - `inzint-frontend` (Static Site) built from `frontend` and published from `dist`.

Set these environment variables in the Render dashboard after provisioning:
- Backend:
  - `DEBUG=false`
  - `SECRET_KEY=<strong-random-string>`
  - `ALLOWED_HOSTS=<your-backend.onrender.com,yourdomain.com>`
  - `CORS_ALLOWED_ORIGINS=<https://your-frontend.onrender.com,https://yourdomain.com>`
  - `CSRF_TRUSTED_ORIGINS=<https://your-frontend.onrender.com,https://yourdomain.com>`
  - `GOOGLE_CLIENT_ID=<your-client-id.apps.googleusercontent.com>`
  - `DATABASE_URL` is auto-injected from `inzint-db` by the blueprint
- Frontend:
  - `VITE_API_URL=https://<your-backend-host>/api`
  - `VITE_GOOGLE_CLIENT_ID=<your-client-id.apps.googleusercontent.com>`

### Manual Setup (if not using Blueprint)
- Backend Web Service (Environment: Python):
  - Root Directory: `backend`
  - Build Command: `pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput`
  - Start Command: `gunicorn core.wsgi:application --bind 0.0.0.0:8000`
  - Link a Render Postgres instance; `DATABASE_URL` will be injected automatically
  - Add env vars listed above under Backend
- Frontend Static Site:
  - Root Directory: `frontend`
  - Build Command: `npm ci && npm run build`
  - Publish Directory: `dist`
  - Add env vars listed above under Frontend

### Google OAuth
- In Google Cloud Console, add your frontend URL to Authorized JavaScript origins: `https://your-frontend.onrender.com` (and your custom domain if used).
- Keep `GOOGLE_CLIENT_ID` identical in both backend and frontend.

## Demo Credentials
- Username: `demo`
- Password: `demo12345`