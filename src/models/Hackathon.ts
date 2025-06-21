import mongoose, { Schema, Document } from 'mongoose';

export interface IHackathon extends Document {
  name: string;
  description: string;
  date: Date;
  location: string;
  image_url?: string;
  organizer_id: mongoose.Schema.Types.ObjectId; // Assuming organizer is a User ID
  views: number;
  created_at: Date;
}

const HackathonSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  image_url: { type: String },
  organizer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  views: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model<IHackathon>('Hackathon', HackathonSchema);