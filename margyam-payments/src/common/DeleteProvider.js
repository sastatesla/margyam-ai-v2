export class DeleteProvider {
  static async softDeleteById({ prismaModel, id }) {
    return prismaModel.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() },
    });
  }
}
