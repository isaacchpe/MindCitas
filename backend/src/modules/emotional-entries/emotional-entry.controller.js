import { asyncHandler } from '../../utils/asyncHandler.js';

export class EmotionalEntryController {
  constructor(entryService) {
    this.entryService = entryService;
  }

  register = asyncHandler(async (req, res) => {
    const entry = await this.entryService.createOrUpdateToday({
      userId: req.user.id,
      mood: req.body.mood,
      note: req.body.note,
    });
    res.status(200).json({ status: 'ok', data: entry });
  });

  getByDate = asyncHandler(async (req, res) => {
    const entry = await this.entryService.getByDate({
      userId: req.user.id,
      date: req.params.date,
    });
    res.json({ status: 'ok', data: entry });
  });

  weeklyTrend = asyncHandler(async (req, res) => {
    const trend = await this.entryService.getWeeklyTrend({ userId: req.user.id });
    res.json({ status: 'ok', data: trend });
  });

  recent = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 7;
    const entries = await this.entryService.getRecentEntries({
      userId: req.user.id,
      limit,
    });
    res.json({ status: 'ok', data: entries });
  });
}
