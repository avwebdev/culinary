// /src/index.ts
export default {
  async bootstrap({ strapi }) {
    const getAssignedSchoolIds = async (user) => {
      if (!user) return [];

      const schools = await strapi
        .documents("api::school.school")
        .findMany({
          filters: {
            managers: {
              id: user.id,
            },
          },
          fields: ["id"],
        });

      console.log(schools)

      return schools.map((school) => school.id);
    };

    const getMenuItemIds = async (schoolIds: string[]): Promise<number[]> => {
      const itemIds = await strapi
        .documents("api::menu-item.menu-item")
        .findMany({
          filters: { school: { id: { $in: schoolIds } } },
          populate: ["school"],
          fields: ["id"],
        });

      return itemIds.map((item) => item.id);
    };

    await strapi.admin.services.permission.conditionProvider.registerMany([
      {
        displayName: "Manager Permissions for School",
        name: "school-for-manager",
        async handler(user) {
          const schoolIds = await getAssignedSchoolIds(user);
          if (schoolIds.length === 0) return false;
          return { id: { $in: schoolIds } };
        },
      },
      {
        displayName: "Manager Permissions for Menu Items",
        name: "menu-items-for-manager",
        async handler(user) {
          const schoolIds = await getAssignedSchoolIds(user);
          if (schoolIds.length === 0) return false;

          const itemIds = await getMenuItemIds(schoolIds);

          return { id: { $in: itemIds } };
        },
      },
    ]);
  },
};
