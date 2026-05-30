import { asyncHandler } from '../../utils/asyncHandler.js';

export class HabitController {
  constructor(habitService) {
    this.svc = habitService;
  }

  getPredefined = asyncHandler(async (_req, res) => {
    const list = this.svc.listPredefinedHabits();
    res.json({ status: 'ok', data: list });
  });

  create = asyncHandler(async (req, res) => {
    const habit = await this.svc.createHabit(req.user.id, req.body);
    res.status(201).json({ status: 'ok', data: habit });
  });

  listMine = asyncHandler(async (req, res) => {
    const habits = await this.svc.listMyHabits(req.user.id);
    res.json({ status: 'ok', data: habits });
  });

  getStreak = asyncHandler(async (req, res) => {
    const details = await this.svc.getStreakDetails(req.user.id, req.params.id);
    res.json({ status: 'ok', data: details });
  });

  check = asyncHandler(async (req, res) => {
    const result = await this.svc.checkHabit(req.user.id, req.params.id);
    res.json({ status: 'ok', data: result });
  });

  remove = asyncHandler(async (req, res) => {
    const result = await this.svc.deleteHabit(req.user.id, req.params.id);
    res.json({ status: 'ok', data: result });
  });

  listBadges = asyncHandler(async (_req, res) => {
    const badges = await this.svc.listBadges();
    res.json({ status: 'ok', data: badges });
  });
}
