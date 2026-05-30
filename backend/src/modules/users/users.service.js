import { AppError } from '../../utils/AppError.js';

function toProfile(user) {
  return {
    _id: user._id,
    email: user.email,
    fullName: user.name,
    program: user.academicProgram || null,
    role: user.role || 'user',
    createdAt: user.createdAt,
  };
}

export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * @param {string} userId
   * @returns {Promise<object>} perfil sin password
   */
  async getUserById(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }
    return toProfile(user);
  }

  /**
   * @param {string} userId
   * @param {object} fields
   * @param {string} [fields.fullName]
   * @param {string} [fields.program]
   * @returns {Promise<object>} perfil actualizado
   */
  async updateUserProfile(userId, fields) {
    const { fullName, program } = fields;

    if (fullName !== undefined && fullName.length < 2) {
      throw new AppError('El nombre debe tener al menos 2 caracteres', 400);
    }
    if (program !== undefined && program.length > 0 && program.length < 2) {
      throw new AppError('El programa debe tener al menos 2 caracteres', 400);
    }

    const patch = {};
    if (fullName !== undefined) {
      patch.name = fullName;
    }
    if (program !== undefined) {
      patch.academicProgram = program;
    }

    const user = await this.userRepository.updateById(userId, patch);
    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }
    return toProfile(user);
  }

  /**
   * @param {string} userId
   * @returns {Promise<Array>} insignias del usuario
   */
  async getUserBadges(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }
    // TODO(MIN-25): delegar a badges repository cuando exista el modulo habits
    return [];
  }
}
