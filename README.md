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

## Deployment (Render/Railway)
### Render
- Create a new Postgres instance
- Create a Web Service for backend:
  - Build: `pip install -r backend/requirements.txt && python backend/manage.py collectstatic --noinput`
  - Start: `gunicorn core.wsgi:application --bind 0.0.0.0:8000`
  - Env vars: `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_HOST`, `POSTGRES_PORT`, `CORS_ALLOWED_ORIGINS`
- Create a Static Site for frontend:
  - Build Command: `npm ci && npm run build`
  - Publish Directory: `frontend/dist`
  - Env var: `VITE_API_URL` to backend URL

### Railway
- Add Postgres plugin
- Backend: Dockerfile at `backend/Dockerfile`
- Frontend: Dockerfile at `frontend/Dockerfile`
- Set env vars similar to Render

## Demo Credentials
- Username: `demo`
- Password: `demo12345`