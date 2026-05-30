import { asyncHandler } from '../../utils/asyncHandler.js';

export class SessionController {
  constructor(sessionService) {
    this.svc = sessionService;
  }

  getTypes = asyncHandler(async (_req, res) => {
    const types = this.svc.listSessionTypes();
    res.json({ status: 'ok', data: types });
  });

  getAvailableSlots = asyncHandler(async (req, res) => {
    const { date, sessionType } = req.query;
    const slots = await this.svc.getAvailableSlots(date, sessionType);
    res.json({ status: 'ok', data: slots });
  });

  create = asyncHandler(async (req, res) => {
    const session = await this.svc.createSession(req.user.id, req.body);
    res.status(201).json({ status: 'ok', data: session });
  });

  listMine = asyncHandler(async (req, res) => {
    const sessions = await this.svc.listMySessions(req.user.id, req.query.status);
    res.json({ status: 'ok', data: sessions });
  });

  getDetail = asyncHandler(async (req, res) => {
    const session = await this.svc.getSessionDetail(req.user.id, req.params.id);
    res.json({ status: 'ok', data: session });
  });

  reschedule = asyncHandler(async (req, res) => {
    const session = await this.svc.reschedule(req.user.id, req.params.id, req.body.scheduledAt);
    res.json({ status: 'ok', data: session });
  });

  cancel = asyncHandler(async (req, res) => {
    const session = await this.svc.cancel(req.user.id, req.params.id);
    res.json({ status: 'ok', data: session });
  });
}
