import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  habitType: {
    type: String,
    enum: ['meditation', 'exercise', 'reading', 'hydration', 'sleep', 'custom'],
    required: true,
  },
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
    maxlength: [60, 'El nombre no puede exceder 60 caracteres'],
    trim: true,
  },
  description: {
    type: String,
    maxlength: [200, 'La descripcion no puede exceder 200 caracteres'],
    trim: true,
  },
  frequency: {
    type: String,
    enum: ['daily'],
    default: 'daily',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const habitLogSchema = new mongoose.Schema({
  habitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit',
    required: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  weekStart: {
    type: Date,
    required: true,
    index: true,
  },
  entries: [
    {
      dayOfWeek: { type: Number, min: 0, max: 6 },
      completedAt: { type: Date, default: Date.now },
    },
  ],
  currentStreak: { type: Number, default: 0 },
  bestStreak: { type: Number, default: 0 },
});

habitLogSchema.index({ habitId: 1, weekStart: 1 }, { unique: true });

const badgeSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  threshold: { type: Number, required: true },
  iconUrl: { type: String },
});

const userBadgeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  badgeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Badge',
    required: true,
  },
  habitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit',
    required: true,
  },
  awardedAt: { type: Date, default: Date.now },
});

userBadgeSchema.index({ userId: 1, badgeId: 1, habitId: 1 }, { unique: true });

export const Habit = mongoose.model('Habit', habitSchema);
export const HabitLog = mongoose.model('HabitLog', habitLogSchema);
export const Badge = mongoose.model('Badge', badgeSchema);
export const UserBadge = mongoose.model('UserBadge', userBadgeSchema);
