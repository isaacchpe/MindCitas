import { asyncHandler } from '../../utils/asyncHandler.js';

export class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  register = asyncHandler(async (req, res) => {
    const result = await this.authService.register(req.body);
    res.status(201).json({ status: 'ok', data: result });
  });

  login = asyncHandler(async (req, res) => {
    const result = await this.authService.login(req.body);
    res.json({ status: 'ok', data: result });
  });

  refresh = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const result = await this.authService.refresh(refreshToken);
    res.json({ status: 'ok', data: result });
  });

  logout = asyncHandler(async (_req, res) => {
    const result = this.authService.logout();
    res.json({ status: 'ok', data: result });
  });

  forgotPassword = asyncHandler(async (req, res) => {
    const result = await this.authService.forgotPassword(req.body);
    res.json({ status: 'ok', data: result });
  });

  resetPassword = asyncHandler(async (req, res) => {
    const result = await this.authService.resetPassword(req.body);
    res.json({ status: 'ok', data: result });
  });
}
