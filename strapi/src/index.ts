// /src/index.ts
export default {
  async bootstrap({ strapi }) {
    const getAssignedSchoolIds = async (user) => {
      if (!user) return [];

      const schools = await strapi.entityService.findMany(
        "api::school.school",
        {
          filters: {
            managers: {
              id: user.id,
            },
          },
          fields: ["id"],
        }
      );

      console.log(schools);

      return schools.map((school) => school.id);
    };

    const getMenuItemIds = async (schoolIds: string[]): Promise<any[]> => {
      const itemIds = await strapi.entityService.findMany(
        "api::menu-item.menu-item",
        {
          filters: { school: { id: { $in: schoolIds } } },
          populate: ["school"],
          fields: ["id"],
        }
      );

      return itemIds.map((item) => item.id);
    };

    const getOrderIds = async (schoolIds: string[]): Promise<any[]> => {
      const orders = await strapi.entityService.findMany("api::cart.cart", {
        filters: { school: { id: { $in: schoolIds } } },
        fields: ["id"],
      });

      return orders.map((order) => order.id);
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
      {
        displayName: "Manager Permissions for Orders",
        name: "orders-for-manager",
        async handler(user) {
          const schoolIds = await getAssignedSchoolIds(user);
          if (schoolIds.length === 0) return false;

          const orderIds = await getOrderIds(schoolIds);

          return { id: { $in: orderIds } };
        },
      },
    ]);
  },
};
