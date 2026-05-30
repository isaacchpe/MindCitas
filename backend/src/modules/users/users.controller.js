import { asyncHandler } from '../../utils/asyncHandler.js';

export class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  getMe = asyncHandler(async (req, res) => {
    const user = await this.userService.getUserById(req.user.id);
    res.json({ status: 'ok', data: user });
  });

  updateMe = asyncHandler(async (req, res) => {
    const user = await this.userService.updateUserProfile(req.user.id, req.body);
    res.json({ status: 'ok', data: user });
  });

  getMyBadges = asyncHandler(async (req, res) => {
    const badges = await this.userService.getUserBadges(req.user.id);
    res.json({ status: 'ok', data: badges });
  });
}
