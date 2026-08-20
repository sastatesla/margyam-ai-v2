/**
 * DeleteProvider
 * App-independent utility to execute soft deletes safely on database collections/models.
 */
export class DeleteProvider {
  static async softDeleteById({ prismaModel, id }) {
    return prismaModel.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }

  static async softDeleteMany({ prismaModel, filter }) {
    const result = await prismaModel.updateMany({
      where: filter,
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
    return result.count;
  }
}
