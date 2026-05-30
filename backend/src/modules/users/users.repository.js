import { User } from '../auth/auth.model.js';

export class UserRepository {
  async findById(id) {
    return User.findById(id);
  }

  async updateById(id, patch) {
    return User.findByIdAndUpdate(id, patch, {
      runValidators: true,
      new: true,
    });
  }
}
