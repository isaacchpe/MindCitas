import { asyncHandler } from '../../utils/asyncHandler.js';

export class AdminController {
  constructor(adminService) {
    this.svc = adminService;
  }

  listUsers = asyncHandler(async (req, res) => {
    const result = await this.svc.listUsers(req.query);
    res.json({ status: 'ok', data: result });
  });

  toggleUser = asyncHandler(async (req, res) => {
    const user = await this.svc.toggleUserActive(req.user.id, req.params.id, req.body.isActive);
    res.json({ status: 'ok', data: user });
  });

  getStats = asyncHandler(async (req, res) => {
    const stats = await this.svc.getStats();
    res.json({ status: 'ok', data: stats });
  });
}
