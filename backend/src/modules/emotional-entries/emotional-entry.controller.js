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

  monthlyTrend = asyncHandler(async (req, res) => {
    const trend = await this.entryService.getMonthlyTrend({ userId: req.user.id });
    res.json({ status: 'ok', data: trend });
  });

  exportCsv = asyncHandler(async (req, res) => {
    const csv = await this.entryService.exportCsv({ userId: req.user.id });
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="mindcitas-export-${req.user.id}-${today}.csv"`
    );
    res.send(csv);
  });

  checkAlert = asyncHandler(async (req, res) => {
    const result = await this.entryService.checkAlert({ userId: req.user.id });
    res.json({ status: 'ok', data: result });
  });
}
