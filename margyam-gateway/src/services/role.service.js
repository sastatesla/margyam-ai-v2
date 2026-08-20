import prisma from '../configs/db.js';
import { ApiError } from '../common/index.js';

class RoleService {
  async getRoles() {
    return ['USER', 'ASTROLOGER', 'OPS', 'ADMIN'];
  }

  async assignRole(userId, role) {
    const validRoles = ['USER', 'ASTROLOGER', 'OPS', 'ADMIN'];
    if (!validRoles.includes(role)) {
      throw ApiError.BadRequest(`Invalid role: ${role}`);
    }

    return prisma.user.update({
      where: { id: userId },
      data:  { role },
    });
  }
}

export default new RoleService();

