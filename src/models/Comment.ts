import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  hackathon_id: mongoose.Schema.Types.ObjectId;
  user_id: mongoose.Schema.Types.ObjectId; // Assuming user is a User ID
  comment: string;
  created_at: Date;
}

const CommentSchema: Schema = new Schema({
  hackathon_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Hackathon', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  comment: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model<IComment>('Comment', CommentSchema);