import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from './models/User.model';
import { Movie } from './models/Movie.model';
import { Theatre } from './models/Theatre.model';
import { Showtime, ISeat, SeatCategory } from './models/Showtime.model';

dotenv.config();

const DEMO_EMAIL = 'demo@movieapp.test';
const DEMO_PASSWORD = 'Demo@1234';

const ROWS = 'ABCDEFGHIJKLM'.split('');
const COLS = 12;

function categoryForRow(row: string): SeatCategory {
  if ('ABCD'.includes(row)) return 'recliner';
  if ('EFGH'.includes(row)) return 'premium';
  return 'standard';
}

export function generateSeats(): ISeat[] {
  const seats: ISeat[] = [];
  for (const row of ROWS) {
    for (let col = 1; col <= COLS; col++) {
      seats.push({
        seatId: `${row}${col}`,
        row,
        col,
        category: categoryForRow(row),
        status: 'available',
      });
    }
  }
  return seats;
}

function datesFromToday(count: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

async function seed() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is required');
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('Seeding database...');

  await Promise.all([
    User.deleteMany({}),
    Movie.deleteMany({}),
    Theatre.deleteMany({}),
    Showtime.deleteMany({}),
  ]);

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);
  await User.create({ name: 'Demo User', email: DEMO_EMAIL, passwordHash });

  const movies = await Movie.insertMany([
    {
      title: 'Interstellar',
      description: 'A team of explorers travel through a wormhole in space.',
      posterUrl: 'https://placehold.co/300x450/1a1a2e/e94560?text=Interstellar',
      bannerUrl: 'https://placehold.co/1200x400/1a1a2e/e94560?text=Interstellar',
      genres: ['Sci-Fi', 'Drama', 'Adventure'],
      formats: ['2D', '3D'],
      cast: [
        { name: 'Matthew McConaughey', role: 'Cooper' },
        { name: 'Anne Hathaway', role: 'Brand' },
      ],
      durationMinutes: 169,
      language: 'English',
      status: 'now_showing',
    },
    {
      title: 'Dune: Part Two',
      description: 'Paul Atreides unites with the Fremen while seeking revenge.',
      posterUrl: 'https://placehold.co/300x450/0f3460/e94560?text=Dune+2',
      bannerUrl: 'https://placehold.co/1200x400/0f3460/e94560?text=Dune+2',
      genres: ['Sci-Fi', 'Adventure'],
      formats: ['2D', '3D'],
      cast: [
        { name: 'Timothée Chalamet', role: 'Paul Atreides' },
        { name: 'Zendaya', role: 'Chani' },
      ],
      durationMinutes: 166,
      language: 'English',
      status: 'now_showing',
    },
    {
      title: 'Oppenheimer',
      description: 'The story of American scientist J. Robert Oppenheimer.',
      posterUrl: 'https://placehold.co/300x450/533483/e94560?text=Oppenheimer',
      bannerUrl: 'https://placehold.co/1200x400/533483/e94560?text=Oppenheimer',
      genres: ['Biography', 'Drama', 'History'],
      formats: ['2D'],
      cast: [
        { name: 'Cillian Murphy', role: 'Oppenheimer' },
        { name: 'Emily Blunt', role: 'Kitty Oppenheimer' },
      ],
      durationMinutes: 180,
      language: 'English',
      status: 'now_showing',
    },
    {
      title: 'Avatar 3',
      description: 'The next chapter in the Avatar saga on Pandora.',
      posterUrl: 'https://placehold.co/300x450/16213e/e94560?text=Avatar+3',
      bannerUrl: 'https://placehold.co/1200x400/16213e/e94560?text=Avatar+3',
      genres: ['Sci-Fi', 'Adventure', 'Action'],
      formats: ['3D'],
      cast: [
        { name: 'Sam Worthington', role: 'Jake Sully' },
        { name: 'Zoe Saldaña', role: 'Neytiri' },
      ],
      durationMinutes: 190,
      language: 'English',
      status: 'coming_soon',
    },
  ]);

  const theatres = await Theatre.insertMany([
    {
      name: 'PVR Phoenix',
      location: 'Lower Parel, Mumbai',
      pricePerCategory: { standard: 250, premium: 400, recliner: 600 },
    },
    {
      name: 'INOX Megaplex',
      location: 'Andheri West, Mumbai',
      pricePerCategory: { standard: 200, premium: 350, recliner: 550 },
    },
  ]);

  const showtimes = [];
  const dates = datesFromToday(3);
  const times = ['10:30', '14:00', '18:30', '21:45'];

  for (const movie of movies.filter((m) => m.status === 'now_showing')) {
    for (const theatre of theatres) {
      for (const date of dates) {
        for (const time of times.slice(0, 2)) {
          showtimes.push({
            movieId: movie._id,
            theatreId: theatre._id,
            format: movie.formats[0],
            date,
            time,
            seats: generateSeats(),
          });
        }
      }
    }
  }

  await Showtime.insertMany(showtimes);

  console.log('Seed complete.');
  console.log(`Demo login: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
