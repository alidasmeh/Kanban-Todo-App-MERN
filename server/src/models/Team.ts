import mongoose, { Document } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  description?: string;
  owners: mongoose.Types.ObjectId[];
  members: mongoose.Types.ObjectId[];
}

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  owners: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

const Team = mongoose.model<ITeam>('Team', teamSchema);

export default Team;
