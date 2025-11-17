// /src/index.ts
export default {
  async bootstrap({ strapi }) {
    const getAssignedSchoolIds = async (user) => {
      if (!user) return [];
      const assignment = await strapi
        .documents("api::admin-assignment.admin-assignment")
        .findFirst({
          filters: { user: { id: user.id } },
          populate: ["schools"],
          fields: ["id"],
        });

      const schools = assignment.schools;
      return schools.map((school) => school.id);
    };

    const getMenuItemIds = async (schoolId: string): Promise<number[]> => {
      const itemIds = await strapi
        .documents("api::menu-item.menu-item")
        .findMany({
          filters: { school: { id: schoolId } },
          populate: ["school"],
          fields: ["id"],
        });

      return itemIds.map((item) => item.id);
    };

    await strapi.admin.services.permission.conditionProvider.registerMany([
      {
        displayName: "Schools assigned to current admin",
        name: "schools-assigned-to-admin",
        async handler(user) {
          const schoolIds = await getAssignedSchoolIds(user);
          if (schoolIds.length === 0) return false;
          return { id: { $in: schoolIds } };
        },
      },
      {
        displayName: "Menu items for admin's schools",
        name: "menu-items-for-admin-schools",
        async handler(user) {
          const schoolIds = await getAssignedSchoolIds(user);
          if (schoolIds.length === 0) return false;

          const itemIds = (await Promise.all(
            schoolIds.map(async schoolId => await getMenuItemIds(schoolId))
          )).flat();

          return { id: { $in: itemIds } };
        },
      },
    ]);
  },
};
