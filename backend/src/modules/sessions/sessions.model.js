import mongoose from 'mongoose';

const workingHourSchema = new mongoose.Schema(
  {
    dayOfWeek: { type: Number, min: 0, max: 6, required: true },
    startHour: { type: Number, min: 0, max: 23, required: true },
    endHour: { type: Number, min: 1, max: 24, required: true },
  },
  { _id: false }
);

const professionalSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  specialty: {
    type: String,
    enum: ['psychology', 'mindfulness', 'academic', 'group'],
    required: true,
  },
  email: { type: String, trim: true, lowercase: true },
  workingHours: [workingHourSchema],
  isActive: { type: Boolean, default: true },
});

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    userSnapshot: {
      fullName: { type: String },
      program: { type: String },
    },
    professionalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Professional',
      required: true,
      index: true,
    },
    sessionType: {
      type: String,
      enum: ['psychology', 'mindfulness', 'academic', 'group'],
      required: true,
    },
    scheduledAt: { type: Date, required: true },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'canceled', 'no_show'],
      default: 'scheduled',
    },
    confirmationCode: { type: String, unique: true, required: true },
    notes: { type: String, maxlength: 500 },
  },
  { timestamps: true }
);

sessionSchema.index(
  { professionalId: 1, scheduledAt: 1 },
  {
    unique: true,
    partialFilterExpression: { status: 'scheduled' },
  }
);

export const Professional = mongoose.model('Professional', professionalSchema);
export const Session = mongoose.model('Session', sessionSchema);
