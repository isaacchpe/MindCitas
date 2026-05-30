import { Professional, Session } from './sessions.model.js';

export class SessionRepository {
  async findActiveProfessionalsBySpecialty(specialty) {
    return Professional.find({ specialty, isActive: true });
  }

  async findProfessionalById(id) {
    return Professional.findById(id);
  }

  async findScheduledByProfessionalAndDate(professionalId, dayStart, dayEnd) {
    return Session.find({
      professionalId,
      scheduledAt: { $gte: dayStart, $lt: dayEnd },
      status: 'scheduled',
    });
  }

  async create(data) {
    return Session.create(data);
  }

  async findByUser(userId, statusFilter, limit = 50) {
    const query = { userId };
    if (statusFilter && statusFilter !== 'all') {
      query.status = statusFilter;
    }
    return Session.find(query)
      .populate('professionalId', 'fullName specialty')
      .sort({ scheduledAt: -1 })
      .limit(limit);
  }

  async findById(id) {
    return Session.findById(id).populate('professionalId', 'fullName specialty');
  }

  async updateById(id, patch) {
    return Session.findByIdAndUpdate(id, patch, { new: true }).populate(
      'professionalId',
      'fullName specialty'
    );
  }
}
