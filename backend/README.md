# Movie Ticket Reservation — Backend API

REST API for a movie ticket booking app. Built with **TypeScript**, **Express**, and **MongoDB** — intentionally kept at medium complexity so the full flow is easy to read and explain in an interview.

## Tech Stack

- Node.js + Express + TypeScript (strict mode)
- MongoDB + Mongoose
- JWT auth (single access token, 7-day expiry)
- bcrypt password hashing
- Zod request validation
- Mock payment gateway (no real provider)

## Prerequisites

- **Node.js** v18+
- **MongoDB** running locally (standalone is fine — no replica set required)

## Setup

```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

The API starts at `http://localhost:4000` by default.

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Server port (default `4000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWTs |
| `CORS_ORIGIN` | Frontend origin for CORS (e.g. `http://localhost:5173`) |
| `BOOKING_FEE` | Flat booking fee added to every order (₹) |

## Demo Credentials

After running `npm run seed`:

| Email | Password |
|---|---|
| `demo@movieapp.test` | `Demo@1234` |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production build |
| `npm run seed` | Reset and populate demo data |

## API Routes

All responses use a consistent envelope:

```json
{ "success": true, "data": { ... } }
{ "success": false, "message": "...", "errors": { ... } }
```

| Method | Route | Auth |
|---|---|---|
| POST | `/api/auth/signup` | — |
| POST | `/api/auth/login` | — |
| GET | `/api/auth/me` | ✓ |
| GET | `/api/movies?status=now_showing\|coming_soon` | — |
| GET | `/api/movies/:id` | — |
| GET | `/api/theatres` | — |
| GET | `/api/showtimes?movieId=&date=` | — |
| GET | `/api/showtimes/:id` | — |
| POST | `/api/bookings` | ✓ |
| GET | `/api/bookings` | ✓ |
| GET | `/api/bookings/:id` | ✓ |
| POST | `/api/bookings/:id/cancel` | ✓ |
| POST | `/api/payments` | ✓ |

## How Seat Booking Works

When a user selects seats and clicks "Pay", the server first creates a **pending** booking after verifying all seats are currently `available`. Seats are **not** marked booked yet — that only happens after payment succeeds. On payment success, a single atomic MongoDB update marks the seats `booked`, confirms the booking, and generates a QR code string. On payment failure, the booking is marked `failed` and seats stay `available` (nothing to roll back). This avoids the need for seat-lock collections or transactions at this scale.

## Mock Payment Gateway

Card validation: 16-digit number, 3-digit CVV, non-expired expiry.

**Deterministic outcome rule** (for reproducible demos):

- Card number ending in **`0000`** → payment fails
- Any other valid card → payment succeeds (after a 1-second simulated delay)

Example success card: `4111111111111111`  
Example failure card: `4111111111110000`

## JWT Storage Tradeoff

The frontend stores the JWT in Redux state (persisted via redux-persist/localStorage). This is simple to implement but exposes the token to XSS — a production app would prefer **httpOnly cookies** for refresh tokens or short-lived access tokens with secure storage.

## What I'd Add for Production

These were deliberately left out to keep the codebase interview-friendly:

1. **Temporary seat holds** — Redis TTL locks between seat selection and payment so two users can't both reach checkout for the same seat.
2. **Refresh tokens** — short-lived access tokens + httpOnly refresh cookies instead of a 7-day bearer token in localStorage.
3. **Real payment provider** — Stripe/Razorpay with webhooks instead of a simulated card check.
4. **MongoDB transactions** — wrap cancel-booking + seat-release (and payment + seat-book) in a transaction when multiple documents must stay in sync.

## Project Structure

```
src/
  models/        User, Movie, Theatre, Showtime, Booking, Payment
  routes/        Mounted in routes/index.ts
  controllers/   Request handling + business logic
  middleware/    auth.ts, errorHandler.ts
  utils/         jwt.ts, asyncHandler.ts
  seed.ts        Demo user + movies, theatres, showtimes
  app.ts         Express app setup
  server.ts      DB connect + listen
```
