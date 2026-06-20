# Movie Ticket Reservation — Frontend

React + TypeScript frontend for the movie ticket booking app, wired to the backend API.

## Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Ensure the backend is running at `http://localhost:4000` (see `backend/README.md`).

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API base URL (default `http://localhost:4000`) |
| `VITE_MAX_SEATS_PER_BOOKING` | Max seats selectable per booking (default `10`) |

## Design Tokens

Tokens were extracted from the Figma file [Creative Upaay hiring assignment](https://www.figma.com/design/CYj0ckSWUMYdJFrRFZQ7Sc/Creative-Upaay-hiring-assignment) via visual inspection (390px frame width, purple `#5D5FEF` primary, seat state colors, typography/spacing). They live in `src/styles/tokens.ts` and are mapped into Tailwind via `@theme` in `src/index.css` — components use semantic classes like `bg-primary`, `text-text-secondary`, `bg-seat-occupied` rather than scattered hex values.

## Auth Gate & Persistence

- **redux-persist** saves `auth` (token + user) and `booking` (selected movie/theatre/showtime/seats/pricing) to `localStorage`.
- A refresh on seat selection or booking summary restores selections.
- `ProtectedRoute` wraps Booking Summary, Checkout, and My Bookings — unauthenticated users redirect to `/login?redirectTo=...` and return after login.
- On API `401`, the axios interceptor clears auth and redirects behavior is handled by route guards.

## Demo

Login: `demo@movieapp.test` / `Demo@1234` (one-tap on login screen)

Payment success card: `4111111111111111`  
Payment failure card: `4111111111110000` (ends in `0000`)

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
