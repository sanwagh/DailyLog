# DailyLog

A personal daily rumination/anxiety tracker. Log a rating and whether you did your
coping practice each day, browse past entries, and see trends over time. Built as a
single-user tool for self-hosting — no accounts, no auth.

## Stack

- **Backend:** Java 26, Spring Boot 4.1.0 (Web MVC, Spring Data JPA, Bean Validation), Lombok
- **Database:** PostgreSQL 16 (Docker)
- **Frontend:** React 19 + Vite, React Router

## Features

- Log one entry per day: a rumination rating (1–10) and whether you completed your practice
- Browse entries over a chosen date range
- View a 7-day rolling average of your rating
- Scatter-plot graph of ratings over time, colored by practice completion

## API

Base path: `/api/entry`

| Method | Path | Description | Success | Error cases |
|---|---|---|---|---|
| `POST` | `/api/entry` | Create today's entry | `201 Created` | `409 Conflict` if today already has an entry; `400 Bad Request` on validation failure |
| `GET` | `/api/entry/{date}` | Fetch the entry for a specific date (`YYYY-MM-DD`) | `200 OK` | `404 Not Found` if no entry exists on that date |
| `GET` | `/api/entry/range?startDate=&endDate=` | Fetch all entries between two dates (inclusive) | `200 OK` (may be an empty list) | — |
| `GET` | `/api/entry/average?endDate=` | 7-day rolling average of rating ending on `endDate` (defaults to today) | `200 OK` | `404 Not Found` if there are no entries in that window |

**Request body** (`POST /api/entry`):
```json
{
  "date": "2026-07-07",
  "ruminationRating": 4,
  "practiceCompleted": true
}
```
`date` is accepted but always overwritten server-side with today's date — an entry can
only ever be created for the current day.

**Response body** (entry object):
```json
{
  "id": "b3f1c2b0-...-uuid",
  "date": "2026-07-07",
  "ruminationRating": 4,
  "practiceCompleted": true
}
```

Errors are returned as a plain-text body with the corresponding HTTP status code
(e.g. a `409` response body is just `Entity Already exists`).

## Running locally

**1. Start the database:**
```bash
docker compose up -d
```
This starts Postgres in a container, exposed on host port `5430` (mapped to the
container's internal `5432`).

**2. Start the backend:**
```bash
./mvnw spring-boot:run
```
Runs on `http://localhost:8080`, connecting to the Postgres container per
`src/main/resources/application.properties`.

**3. Start the frontend:**
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173` by default (Vite dev server).

## Deploying to a home server

Since the frontend runs as a static build in the *visiting browser* (not on the
server), and the backend enforces CORS by allowed origin, a few things need to
change from the local-dev defaults when deploying:

- **CORS** (`src/main/java/com/sanwagh/dailylog/config/WebConfig.java`): add the
  server's LAN IP/hostname to `allowedOriginPatterns` — `localhost` there refers to
  whichever origin a *browser* is loading from, not the server itself.
- **Frontend API base URL**: set it via a Vite env var (e.g. `VITE_API_BASE_URL`)
  pointing at `http://<server-lan-ip>:8080` before running `npm run build`, rather
  than hardcoding `localhost`.
- **Serving the build**: `npm run build` outputs static files to `frontend/dist/` —
  these need a static file server (e.g. `serve`, nginx) to actually be served.
- No authentication exists anywhere in this API — keep it LAN-only; don't expose it
  to the public internet without adding auth first.

## Project structure

```
src/main/java/com/sanwagh/dailylog/
  entity/       JPA entities
  dto/          Request/response DTOs
  mapper/       Entity <-> DTO conversion
  repositories/ Spring Data JPA repositories
  services/     Business logic
  controller/   REST endpoints
  exceptions/   Custom exceptions + global exception handling
  config/       CORS and other app configuration

frontend/src/
  pages/        Entries, New Entry, Graphs pages
  components/   Shared UI pieces (top bar, banners, charts, skeletons)
  api.js        Backend API client
```
