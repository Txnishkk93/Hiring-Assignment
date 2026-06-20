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
      title: 'The Shawshank Redemption',
      description: 'A banker wrongly imprisoned for murder forms a deep friendship and maintains hope despite years in prison.',
      posterUrl: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
      bannerUrl: 'https://image.tmdb.org/t/p/original/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
      genres: ['Drama'],
      formats: ['2D'],
      cast: [
        { name: 'Tim Robbins', role: 'Andy Dufresne' },
        { name: 'Morgan Freeman', role: 'Ellis Boyd Redding' },
      ],
      durationMinutes: 142,
      language: 'English',
      status: 'now_showing',
    },
    {
      title: 'The Godfather',
      description: 'The story of the Corleone crime family and the rise of Michael Corleone.',
      posterUrl: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
      bannerUrl: 'https://image.tmdb.org/t/p/original/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
      genres: ['Crime', 'Drama'],
      formats: ['2D'],
      cast: [
        { name: 'Marlon Brando', role: 'Vito Corleone' },
        { name: 'Al Pacino', role: 'Michael Corleone' },
      ],
      durationMinutes: 175,
      language: 'English',
      status: 'now_showing',
    },
    {
      title: 'The Dark Knight',
      description: 'Batman faces the Joker, a criminal mastermind determined to plunge Gotham into chaos.',
      posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      bannerUrl: 'https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      genres: ['Action', 'Crime', 'Drama'],
      formats: ['2D', 'IMAX'],
      cast: [
        { name: 'Christian Bale', role: 'Batman' },
        { name: 'Heath Ledger', role: 'The Joker' },
      ],
      durationMinutes: 152,
      language: 'English',
      status: 'now_showing',
    },
    {
      title: 'Schindler\'s List',
      description: 'The true story of Oskar Schindler, who saved over a thousand Jewish lives during World War II.',
      posterUrl: 'https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg',
      bannerUrl: 'https://image.tmdb.org/t/p/original/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg',
      genres: ['Biography', 'Drama', 'History'],
      formats: ['2D'],
      cast: [
        { name: 'Liam Neeson', role: 'Oskar Schindler' },
        { name: 'Ralph Fiennes', role: 'Amon Goeth' },
      ],
      durationMinutes: 195,
      language: 'English',
      status: 'now_showing',
    },
    {
      title: 'The Lord of the Rings: The Return of the King',
      description: 'The final battle for Middle-earth unfolds as Frodo nears Mount Doom.',
      posterUrl: 'https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg',
      bannerUrl: 'https://image.tmdb.org/t/p/original/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg',
      genres: ['Adventure', 'Fantasy'],
      formats: ['2D', '3D'],
      cast: [
        { name: 'Elijah Wood', role: 'Frodo Baggins' },
        { name: 'Ian McKellen', role: 'Gandalf' },
      ],
      durationMinutes: 201,
      language: 'English',
      status: 'now_showing',
    },
    {
      title: 'Pulp Fiction',
      description: 'Interconnected stories of crime, redemption, and dark humor in Los Angeles.',
      posterUrl: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
      bannerUrl: 'https://image.tmdb.org/t/p/original/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
      genres: ['Crime', 'Drama'],
      formats: ['2D'],
      cast: [
        { name: 'John Travolta', role: 'Vincent Vega' },
        { name: 'Samuel L. Jackson', role: 'Jules Winnfield' },
      ],
      durationMinutes: 154,
      language: 'English',
      status: 'now_showing',
    },
    {
      title: 'Forrest Gump',
      description: 'The life journey of Forrest Gump as he unwittingly influences major historical events.',
      posterUrl: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
      bannerUrl: 'https://image.tmdb.org/t/p/original/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
      genres: ['Drama', 'Romance'],
      formats: ['2D'],
      cast: [
        { name: 'Tom Hanks', role: 'Forrest Gump' },
        { name: 'Gary Sinise', role: 'Lt. Dan Taylor' },
      ],
      durationMinutes: 142,
      language: 'English',
      status: 'now_showing',
    },
    {
      title: 'Inception',
      description: 'A thief enters dreams to steal secrets and attempts an impossible mission: planting an idea.',
      posterUrl: 'https://image.tmdb.org/t/p/w500/8IB2e4r4oVhHnANbnm7O3Tj6tF8.jpg',
      bannerUrl: 'https://image.tmdb.org/t/p/original/8IB2e4r4oVhHnANbnm7O3Tj6tF8.jpg',
      genres: ['Sci-Fi', 'Thriller'],
      formats: ['2D', '3D'],
      cast: [
        { name: 'Leonardo DiCaprio', role: 'Cobb' },
        { name: 'Marion Cotillard', role: 'Mal' },
      ],
      durationMinutes: 148,
      language: 'English',
      status: 'now_showing',
    },
    {
      title: 'Fight Club',
      description: 'An office worker and a soap salesman create an underground fight club.',
      posterUrl: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
      bannerUrl: 'https://image.tmdb.org/t/p/original/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
      genres: ['Drama', 'Thriller'],
      formats: ['2D'],
      cast: [
        { name: 'Brad Pitt', role: 'Tyler Durden' },
        { name: 'Edward Norton', role: 'The Narrator' },
      ],
      durationMinutes: 139,
      language: 'English',
      status: 'now_showing',
    },
    {
      title: 'Interstellar',
      description: 'Astronauts travel through a wormhole in search of a new home for humanity.',
      posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      bannerUrl: 'https://image.tmdb.org/t/p/original/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      genres: ['Adventure', 'Drama', 'Sci-Fi'],
      formats: ['2D', '3D', 'IMAX'],
      cast: [
        { name: 'Matthew McConaughey', role: 'Cooper' },
        { name: 'Anne Hathaway', role: 'Brand' },
      ],
      durationMinutes: 169,
      language: 'English',
      status: 'now_showing',
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
