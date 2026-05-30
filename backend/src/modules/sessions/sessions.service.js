import crypto from 'node:crypto';
import { AppError } from '../../utils/AppError.js';

const SESSION_TYPES = [
  {
    code: 'psychology',
    name: 'Psicologia individual',
    durationMinutes: 60,
    description: 'Sesion uno a uno con profesional de psicologia.',
  },
  {
    code: 'mindfulness',
    name: 'Mindfulness',
    durationMinutes: 60,
    description: 'Sesion guiada de mindfulness y relajacion.',
  },
  {
    code: 'academic',
    name: 'Orientacion academica',
    durationMinutes: 60,
    description: 'Asesoria sobre rendimiento academico y habitos de estudio.',
  },
  {
    code: 'group',
    name: 'Sesion grupal',
    durationMinutes: 60,
    description: 'Espacio de apoyo emocional en grupo con facilitador.',
  },
];

const MIN_ADVANCE_MS = 60 * 60 * 1000;
const CANCEL_ADVANCE_MS = 24 * 60 * 60 * 1000;

export function genConfirmationCode() {
  return 'MC-' + crypto.randomBytes(3).toString('hex').toUpperCase();
}

export class SessionService {
  constructor(sessionRepository, userRepository) {
    this.repo = sessionRepository;
    this.userRepo = userRepository;
  }

  /**
   * @returns {Array<{code, name, durationMinutes, description}>}
   */
  listSessionTypes() {
    return SESSION_TYPES.map((t) => ({ ...t }));
  }

  /**
   * @param {string} dateStr YYYY-MM-DD
   * @param {string} sessionType
   */
  async getAvailableSlots(dateStr, sessionType) {
    const dayStart = new Date(dateStr + 'T00:00:00Z');
    if (isNaN(dayStart.getTime())) {
      throw new AppError('Fecha no valida', 400);
    }

    const now = new Date();
    const dayEnd = new Date(dateStr + 'T23:59:59Z');
    if (dayEnd < now) {
      return [];
    }

    const dayOfWeek = dayStart.getUTCDay();
    const professionals = await this.repo.findActiveProfessionalsBySpecialty(sessionType);
    const result = [];

    for (const prof of professionals) {
      const wh = prof.workingHours.find((h) => h.dayOfWeek === dayOfWeek);
      if (!wh) {
        continue;
      }

      const booked = await this.repo.findScheduledByProfessionalAndDate(prof._id, dayStart, dayEnd);
      const bookedSet = new Set(booked.map((s) => s.scheduledAt.toISOString()));

      const slots = [];
      for (let h = wh.startHour; h < wh.endHour; h++) {
        const slot = new Date(dayStart);
        slot.setUTCHours(h, 0, 0, 0);
        if (slot <= now) {
          continue;
        }
        if (!bookedSet.has(slot.toISOString())) {
          slots.push(slot.toISOString());
        }
      }

      if (slots.length) {
        result.push({
          professionalId: prof._id,
          professionalName: prof.fullName,
          slots,
        });
      }
    }

    return result;
  }

  /**
   * @param {string} userId
   * @param {{professionalId, sessionType, scheduledAt}} data
   */
  async createSession(userId, { professionalId, sessionType, scheduledAt }) {
    const slotDate = new Date(scheduledAt);
    if (isNaN(slotDate.getTime())) {
      throw new AppError('Fecha no valida', 400);
    }
    if (slotDate.getTime() - Date.now() < MIN_ADVANCE_MS) {
      throw new AppError('La sesion debe agendarse con al menos 1 hora de anticipacion', 400);
    }

    const professional = await this.repo.findProfessionalById(professionalId);
    if (!professional || !professional.isActive) {
      throw new AppError('Profesional no disponible', 404);
    }
    if (professional.specialty !== sessionType) {
      throw new AppError('El tipo de sesion no coincide con la especialidad del profesional', 400);
    }

    let userSnapshot = { fullName: '', program: '' };
    if (this.userRepo) {
      const user = await this.userRepo.findById(userId);
      if (user) {
        userSnapshot = {
          fullName: user.name || user.fullName || '',
          program: user.academicProgram || user.program || '',
        };
      }
    }

    const confirmationCode = genConfirmationCode();

    try {
      const session = await this.repo.create({
        userId,
        userSnapshot,
        professionalId,
        sessionType,
        scheduledAt: slotDate,
        confirmationCode,
      });
      return session;
    } catch (err) {
      if (err.code === 11000) {
        throw new AppError('El horario seleccionado ya esta reservado', 409);
      }
      throw err;
    }
  }

  /**
   * @param {string} userId
   * @param {string} [statusFilter]
   */
  async listMySessions(userId, statusFilter) {
    return this.repo.findByUser(userId, statusFilter);
  }

  /**
   * @param {string} userId
   * @param {string} sessionId
   */
  async getSessionDetail(userId, sessionId) {
    const session = await this.repo.findById(sessionId);
    if (!session) {
      throw new AppError('Sesion no encontrada', 404);
    }
    if (session.userId.toString() !== userId) {
      throw new AppError('No tienes acceso a esta sesion', 403);
    }
    return session;
  }

  /**
   * @param {string} userId
   * @param {string} sessionId
   * @param {string} newScheduledAt
   */
  async reschedule(userId, sessionId, newScheduledAt) {
    const session = await this.repo.findById(sessionId);
    if (!session) {
      throw new AppError('Sesion no encontrada', 404);
    }
    if (session.userId.toString() !== userId) {
      throw new AppError('No tienes acceso a esta sesion', 403);
    }
    if (session.status !== 'scheduled') {
      throw new AppError('Solo se pueden reprogramar sesiones con estado agendado', 400);
    }
    if (session.scheduledAt.getTime() - Date.now() < CANCEL_ADVANCE_MS) {
      throw new AppError('Solo se puede reprogramar con al menos 24 horas de anticipacion', 400);
    }

    const newDate = new Date(newScheduledAt);
    if (isNaN(newDate.getTime())) {
      throw new AppError('Fecha no valida', 400);
    }
    if (newDate.getTime() - Date.now() < MIN_ADVANCE_MS) {
      throw new AppError('La nueva fecha debe ser al menos 1 hora en el futuro', 400);
    }

    try {
      return await this.repo.updateById(sessionId, { scheduledAt: newDate });
    } catch (err) {
      if (err.code === 11000) {
        throw new AppError('El nuevo horario ya esta reservado', 409);
      }
      throw err;
    }
  }

  /**
   * @param {string} userId
   * @param {string} sessionId
   */
  async cancel(userId, sessionId) {
    const session = await this.repo.findById(sessionId);
    if (!session) {
      throw new AppError('Sesion no encontrada', 404);
    }
    if (session.userId.toString() !== userId) {
      throw new AppError('No tienes acceso a esta sesion', 403);
    }
    if (session.status !== 'scheduled') {
      throw new AppError('Solo se pueden cancelar sesiones con estado agendado', 400);
    }
    if (session.scheduledAt.getTime() - Date.now() < CANCEL_ADVANCE_MS) {
      throw new AppError('Solo se puede cancelar con al menos 24 horas de anticipacion', 400);
    }

    return this.repo.updateById(sessionId, { status: 'canceled' });
  }
}
