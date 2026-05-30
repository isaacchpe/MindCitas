import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxlength: [80, 'El nombre no puede exceder 80 caracteres'],
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      lowercase: true,
      trim: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'El email no es valido'],
    },
    password: {
      type: String,
      required: [true, 'La contrasena es obligatoria'],
      minlength: [8, 'La contrasena debe tener al menos 8 caracteres'],
      select: false,
    },
    academicProgram: {
      type: String,
      maxlength: [120, 'El programa academico no puede exceder 120 caracteres'],
    },
    role: {
      type: String,
      enum: ['student', 'professional', 'admin'],
      default: 'student',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = mongoose.model('User', userSchema);
