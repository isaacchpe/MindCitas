import 'dotenv/config';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI no definida en .env');
  process.exit(1);
}

const workingHourSchema = new mongoose.Schema(
  {
    dayOfWeek: Number,
    startHour: Number,
    endHour: Number,
  },
  { _id: false }
);

const professionalSchema = new mongoose.Schema({
  fullName: String,
  specialty: String,
  email: String,
  workingHours: [workingHourSchema],
  isActive: { type: Boolean, default: true },
});

const Professional = mongoose.model('Professional', professionalSchema);

const WEEKDAY_HOURS = { startHour: 8, endHour: 17 };
const SATURDAY_HOURS = { startHour: 8, endHour: 12 };

function buildWorkingHours() {
  const hours = [];
  for (let d = 1; d <= 5; d++) {
    hours.push({ dayOfWeek: d, ...WEEKDAY_HOURS });
  }
  hours.push({ dayOfWeek: 6, ...SATURDAY_HOURS });
  return hours;
}

const PROFESSIONALS = [
  {
    fullName: 'Dra. Maria Gonzalez',
    specialty: 'psychology',
    email: 'mgonzalez@mindcitas.local',
  },
  {
    fullName: 'Carlos Ramirez',
    specialty: 'mindfulness',
    email: 'cramirez@mindcitas.local',
  },
  {
    fullName: 'Dra. Laura Torres',
    specialty: 'academic',
    email: 'ltorres@mindcitas.local',
  },
  {
    fullName: 'Ana Castillo',
    specialty: 'group',
    email: 'acastillo@mindcitas.local',
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Conectado a MongoDB');

  for (const prof of PROFESSIONALS) {
    await Professional.updateOne(
      { email: prof.email },
      { $setOnInsert: { ...prof, workingHours: buildWorkingHours() } },
      { upsert: true }
    );
  }
  console.log('4 profesionales insertados (idempotente)');

  await mongoose.disconnect();
  console.log('Seed de profesionales completado');
}

seed().catch((err) => {
  console.error('Error en seed:', err);
  process.exit(1);
});
