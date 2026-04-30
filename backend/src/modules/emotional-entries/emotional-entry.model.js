import mongoose from 'mongoose';

const emotionalEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El usuario es obligatorio'],
      index: true,
    },
    date: {
      type: Date,
      required: [true, 'La fecha es obligatoria'],
    },
    mood: {
      type: Number,
      required: [true, 'El nivel de animo es obligatorio'],
      min: [1, 'El nivel minimo es 1'],
      max: [5, 'El nivel maximo es 5'],
    },
    note: {
      type: String,
      maxlength: [500, 'La nota no puede exceder 500 caracteres'],
    },
  },
  { timestamps: true }
);

emotionalEntrySchema.index({ userId: 1, date: 1 }, { unique: true });

emotionalEntrySchema.statics.normalizeDate = (date) => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

export const EmotionalEntry = mongoose.model('EmotionalEntry', emotionalEntrySchema);
