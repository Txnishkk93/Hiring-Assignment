import mongoose, { Document, Schema } from 'mongoose';

export type MovieFormat = '2D' | '3D';
export type MovieStatus = 'now_showing' | 'coming_soon';

export interface ICastMember {
  name: string;
  role: string;
}

export interface IMovie extends Document {
  title: string;
  description: string;
  posterUrl: string;
  bannerUrl: string;
  genres: string[];
  formats: MovieFormat[];
  cast: ICastMember[];
  durationMinutes: number;
  language: string;
  status: MovieStatus;
}

const castMemberSchema = new Schema<ICastMember>(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
  },
  { _id: false }
);

const movieSchema = new Schema<IMovie>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    posterUrl: { type: String, required: true },
    bannerUrl: { type: String, required: true },
    genres: [{ type: String }],
    formats: [{ type: String, enum: ['2D', '3D'] }],
    cast: [castMemberSchema],
    durationMinutes: { type: Number, required: true },
    language: { type: String, required: true },
    status: { type: String, enum: ['now_showing', 'coming_soon'], required: true },
  },
  { timestamps: false }
);

export const Movie = mongoose.model<IMovie>('Movie', movieSchema);
