import { AppError } from '../../utils/AppError.js';

export class AdminService {
  constructor(adminRepository) {
    this.repo = adminRepository;
  }

  /**
   * @param {{page: number, pageSize: number, search?: string}} params
   */
  async listUsers({ page = 1, pageSize = 20, search }) {
    const p = Math.max(1, parseInt(page, 10) || 1);
    const ps = Math.min(100, Math.max(1, parseInt(pageSize, 10) || 20));

    const { items, total } = await this.repo.findUsers({ page: p, pageSize: ps, search });
    return { items, total, page: p, pageSize: ps };
  }

  /**
   * @param {string} adminId
   * @param {string} targetUserId
   * @param {boolean} isActive
   */
  async toggleUserActive(adminId, targetUserId, isActive) {
    if (adminId === targetUserId) {
      throw new AppError('No puedes desactivar tu propia cuenta', 400);
    }

    const user = await this.repo.updateUserById(targetUserId, { isActive });
    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }
    return user;
  }

  /**
   * Metricas agregadas de la plataforma (8 indicadores).
   * @returns {Promise<object>} objeto con totalUsers, activeUsers, totalSessions, etc.
   */
  async getStats() {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 7);
    sevenDaysAgo.setUTCHours(0, 0, 0, 0);
    const todayDow = now.getUTCDay();

    const [
      totalUsers,
      activeUsers,
      totalSessions,
      sessionsLast7Days,
      totalEmotionalEntries,
      entriesLast7Days,
      totalHabits,
      completedTodayCount,
    ] = await Promise.all([
      this.repo.countUsers(),
      this.repo.countUsers({ isActive: true }),
      this.repo.countSessions(),
      this.repo.countSessions({ createdAt: { $gte: sevenDaysAgo } }),
      this.repo.countEntries(),
      this.repo.countEntries({ date: { $gte: sevenDaysAgo } }),
      this.repo.countHabits({ isActive: true }),
      this.repo.countCompletedToday(todayDow),
    ]);

    return {
      totalUsers,
      activeUsers,
      totalSessions,
      sessionsLast7Days,
      totalEmotionalEntries,
      entriesLast7Days,
      totalHabits,
      completedTodayCount,
    };
  }
}
