import 'dotenv/config';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI no definida en .env');
  process.exit(1);
}

const badgeSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  name: String,
  description: String,
  threshold: Number,
  iconUrl: String,
});

const Badge = mongoose.model('Badge', badgeSchema);

const BADGES = [
  {
    code: 'streak-7',
    name: 'Primera semana',
    description: '7 dias consecutivos completando un habito',
    threshold: 7,
  },
  {
    code: 'streak-14',
    name: 'Quincena imparable',
    description: '14 dias consecutivos completando un habito',
    threshold: 14,
  },
  {
    code: 'streak-30',
    name: 'Mes de hierro',
    description: '30 dias consecutivos completando un habito',
    threshold: 30,
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Conectado a MongoDB');

  for (const badge of BADGES) {
    await Badge.updateOne({ code: badge.code }, { $setOnInsert: badge }, { upsert: true });
  }
  console.log('3 badges base insertados (idempotente)');

  await mongoose.disconnect();
  console.log('Seed de badges completado');
}

seed().catch((err) => {
  console.error('Error en seed:', err);
  process.exit(1);
});
