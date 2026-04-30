import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI no definida en .env');
  process.exit(1);
}

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, lowercase: true },
    password: String,
    academicProgram: String,
  },
  { timestamps: true }
);

const entrySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: Date,
    mood: Number,
    note: String,
  },
  { timestamps: true }
);
entrySchema.index({ userId: 1, date: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);
const EmotionalEntry = mongoose.model('EmotionalEntry', entrySchema);

const NOTES = [
  'Dia tranquilo, pude concentrarme bien.',
  'Me senti algo agotado despues del parcial.',
  'Buen dia, comparti con amigos en la tarde.',
  null,
  'Mucho estres con las entregas.',
  null,
  'Fin de semana relajado.',
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Conectado a MongoDB');

  const password = await bcrypt.hash('Demo1234!', 12);

  const user = await User.findOneAndUpdate(
    { email: 'demo@mindcitas.local' },
    {
      name: 'Usuario Demo',
      email: 'demo@mindcitas.local',
      password,
      academicProgram: 'Ingenieria de Software',
    },
    { upsert: true, new: true }
  );
  console.log(`Usuario: ${user.email} (${user._id})`);

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setUTCDate(date.getUTCDate() - i);
    const mood = Math.floor(Math.random() * 5) + 1;
    const note = NOTES[6 - i] || undefined;

    await EmotionalEntry.findOneAndUpdate(
      { userId: user._id, date },
      { mood, note },
      { upsert: true, new: true }
    );
  }
  console.log('7 entradas emocionales creadas');

  await mongoose.disconnect();
  console.log('Seed completado');
}

seed().catch((err) => {
  console.error('Error en seed:', err);
  process.exit(1);
});
