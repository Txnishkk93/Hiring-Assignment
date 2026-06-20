import mongoose, { Document, Schema, Types } from 'mongoose';

export type SeatCategory = 'standard' | 'premium' | 'recliner';
export type SeatStatus = 'available' | 'booked';
export type ShowtimeFormat = '2D' | '3D';

export interface ISeat {
  seatId: string;
  row: string;
  col: number;
  category: SeatCategory;
  status: SeatStatus;
}

export interface IShowtime extends Document {
  movieId: Types.ObjectId;
  theatreId: Types.ObjectId;
  format: ShowtimeFormat;
  date: string;
  time: string;
  seats: ISeat[];
}

const seatSchema = new Schema<ISeat>(
  {
    seatId: { type: String, required: true },
    row: { type: String, required: true },
    col: { type: Number, required: true },
    category: { type: String, enum: ['standard', 'premium', 'recliner'], required: true },
    status: { type: String, enum: ['available', 'booked'], default: 'available' },
  },
  { _id: false }
);

const showtimeSchema = new Schema<IShowtime>(
  {
    movieId: { type: Schema.Types.ObjectId, ref: 'Movie', required: true },
    theatreId: { type: Schema.Types.ObjectId, ref: 'Theatre', required: true },
    format: { type: String, enum: ['2D', '3D'], required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    seats: [seatSchema],
  },
  { timestamps: false }
);

showtimeSchema.index({ movieId: 1, date: 1 });

export const Showtime = mongoose.model<IShowtime>('Showtime', showtimeSchema);
