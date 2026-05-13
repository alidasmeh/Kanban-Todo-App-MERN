import User from '../models/User';
import Team from '../models/Team';
import Board from '../models/Board';
import crypto from 'crypto';

export const initDefaults = async () => {
  try {
    // 1. Ensure a System Admin user exists to own default entities
    let systemUser = await User.findOne({ email: 'system@kinetic.com' });
    if (!systemUser) {
      systemUser = await User.create({
        name: 'System Admin',
        email: 'system@kinetic.com',
        password: crypto.randomBytes(32).toString('hex'), // Random password for security
      });
      console.log('System Admin user created.');
    }

    // 2. Ensure "Everyone" team exists
    let everyoneTeam = await Team.findOne({ name: 'Everyone' });
    if (!everyoneTeam) {
      everyoneTeam = await Team.create({
        name: 'Everyone',
        description: 'Default team for all users.',
        owners: [systemUser._id],
        members: []
      });
      console.log('"Everyone" team created.');
    }

    // 3. Ensure "General" board exists and is assigned to "Everyone" team
    let generalBoard = await Board.findOne({ title: 'General' });
    if (!generalBoard) {
      await Board.create({
        title: 'General',
        description: 'Main board for everyone.',
        owner: systemUser._id,
        team: everyoneTeam._id,
        members: [systemUser._id],
        columns: {
          'todo': { id: 'todo', title: 'TO DO', taskIds: [] },
          'in-progress': { id: 'in-progress', title: 'IN PROGRESS', taskIds: [] },
          'done': { id: 'done', title: 'DONE', taskIds: [] }
        },
        columnOrder: ['todo', 'in-progress', 'done']
      });
      console.log('"General" board created.');
    }
  } catch (error) {
    console.error('Error initializing defaults:', error);
  }
};
