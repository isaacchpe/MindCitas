import { User } from './auth.model.js';

export class UserRepository {
  async findByEmail(email, includePassword = false) {
    const query = User.findOne({ email });
    if (includePassword) {
      query.select('+password');
    }
    return query;
  }

  async findById(id) {
    return User.findById(id);
  }

  async create(data) {
    return User.create(data);
  }

  async updateById(id, data) {
    const doc = await User.findById(id);
    if (!doc) {
      return null;
    }
    Object.assign(doc, data);
    return doc.save();
  }
}
