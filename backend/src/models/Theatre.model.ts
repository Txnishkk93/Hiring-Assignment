import mongoose, { Document, Schema } from 'mongoose';

export interface IPricePerCategory {
  standard: number;
  premium: number;
  recliner: number;
}

export interface ITheatre extends Document {
  name: string;
  location: string;
  pricePerCategory: IPricePerCategory;
}

const pricePerCategorySchema = new Schema<IPricePerCategory>(
  {
    standard: { type: Number, required: true },
    premium: { type: Number, required: true },
    recliner: { type: Number, required: true },
  },
  { _id: false }
);

const theatreSchema = new Schema<ITheatre>(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true },
    pricePerCategory: { type: pricePerCategorySchema, required: true },
  },
  { timestamps: false }
);

export const Theatre = mongoose.model<ITheatre>('Theatre', theatreSchema);
