import { ApiResponse } from '../common/index.js';
import roleService from '../services/role.service.js';

class RoleController {
  constructor() {
    this.getRoles   = this.getRoles.bind(this);
    this.assignRole = this.assignRole.bind(this);
  }

  async getRoles(req, res, next) {
    try {
      const roles = await roleService.getRoles();
      return new ApiResponse(res).success({ data: roles });
    } catch (e) { next(e); }
  }

  async assignRole(req, res, next) {
    try {
      const { userId, role } = req.body;
      const user = await roleService.assignRole(userId, role);
      return new ApiResponse(res).success({ data: user, message: 'Role assigned successfully' });
    } catch (e) { next(e); }
  }
}

export default new RoleController();
