import { ApiResponse } from '../common/index.js';
import userService from '../services/user.service.js';
import prisma from '../configs/db.js';
import { sendEmail } from '../mailer/emailServer.js';
import { getBetaInviteEmail } from '../mailer/templates/betaInvite.js';

class AdminController {
  constructor() {
    this.listUsers       = this.listUsers.bind(this);
    this.getUserById     = this.getUserById.bind(this);
    this.updateUser      = this.updateUser.bind(this);
    this.deleteUser      = this.deleteUser.bind(this);
    this.listWaitlist    = this.listWaitlist.bind(this);
    this.approveBetaUser = this.approveBetaUser.bind(this);
  }

  async listUsers(req, res, next) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const result = await userService.list({ page: +page, limit: +limit });
      return new ApiResponse(res).success({ data: result.items, meta: { total: result.total, page: +page, limit: +limit } });
    } catch (e) { next(e); }
  }

  async getUserById(req, res, next) {
    try {
      const user = await userService.getById(req.params.id);
      return new ApiResponse(res).success({ data: user });
    } catch (e) { next(e); }
  }

  async updateUser(req, res, next) {
    try {
      const user = await userService.update(req.params.id, req.body);
      return new ApiResponse(res).success({ data: user });
    } catch (e) { next(e); }
  }

  async deleteUser(req, res, next) {
    try {
      await userService.delete(req.params.id);
      return new ApiResponse(res).success({ message: 'User deleted' });
    } catch (e) { next(e); }
  }

  async listWaitlist(req, res, next) {
    try {
      const waitlist = await prisma.betaUser.findMany({ orderBy: { createdAt: 'desc' } });
      return new ApiResponse(res).success({ data: waitlist });
    } catch (e) { next(e); }
  }

  async approveBetaUser(req, res, next) {
    try {
      const { betaUserId, inviteLink } = req.body;
      const betaUser = await prisma.betaUser.update({
        where: { id: betaUserId },
        data: { inviteLinkSent: true, emailDelivered: true },
      });

      await sendEmail({
        to: betaUser.email,
        subject: "Swagatam! You've been accepted to Margyam Beta",
        html: getBetaInviteEmail({ name: betaUser.name, inviteLink: inviteLink || 'https://margyam.in/signup' }),
      });

      return new ApiResponse(res).success({ message: 'Beta user approved and invite email sent' });
    } catch (e) { next(e); }
  }
}

export default new AdminController();
