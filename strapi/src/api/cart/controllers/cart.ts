/**
 * cart controller
 */

import { factories } from '@strapi/strapi'
import { render } from '@react-email/render';
import { OrderConfirmation, ManagerNotification, OrderApproved, OrderRejected, SchoolBranding, OrderData } from '../../../email-templates';

// Flexible types for populated entities
type School = {
  id: string | number;
  name?: string;
  email?: string;
  phone?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  culinaryLogo?: { url: string } | null;
  managers?: Array<{ id: string | number; email?: string }>;
  [key: string]: any;
};

type Cart = {
  id: string | number;
  school?: School;
  userEmail?: string;
  deliveryDate?: string | Date;
  lines?: any[];
  rejectionReason?: string;
  status?: string;
  createdAt?: string | Date;
  [key: string]: any;
};

async function sendOrderEmail(
  strapi: any,
  template: 'confirmation' | 'manager' | 'approved' | 'rejected',
  to: string,
  school: SchoolBranding,
  order: OrderData,
  strapiUrl?: string
) {
  let html: string;
  let subject: string;

  switch (template) {
    case 'confirmation':
      html = await render(OrderConfirmation({ school, order, strapiUrl }));
      subject = `Order #${order.id} Received - ${school.name}`;
      break;
    case 'manager':
      html = await render(ManagerNotification({ school, order, strapiUrl }));
      subject = `New Order #${order.id} Requires Approval - ${school.name}`;
      break;
    case 'approved':
      html = await render(OrderApproved({ school, order, strapiUrl }));
      subject = `Order #${order.id} Approved - ${school.name}`;
      break;
    case 'rejected':
      html = await render(OrderRejected({ school, order, strapiUrl }));
      subject = `Order #${order.id} Update - ${school.name}`;
      break;
  }

  try {
    await strapi.plugins['email'].services.email.send({
      to,
      subject,
      html,
    });
  } catch (error) {
    strapi.log.error(`Failed to send ${template} email to ${to}:`, error);
  }
}

export default factories.createCoreController('api::cart.cart', ({ strapi }) => ({
  /**
   * Override create to add validation
   */
  async create(ctx) {
    const { data } = ctx.request.body || {};
    
    if (!data) {
      return ctx.badRequest('Request body data is required');
    }

    const { userEmail, school: schoolId, deliveryDate, lines } = data;

    if (!userEmail) {
      return ctx.badRequest('User email is required');
    }

    if (!schoolId) {
      return ctx.badRequest('School is required');
    }

    if (!deliveryDate) {
      return ctx.badRequest('Delivery date is required');
    }

    if (!lines || !Array.isArray(lines) || lines.length === 0) {
      return ctx.badRequest('Order must contain at least one item');
    }

    try {
      // Fetch school with settings
      const school = await strapi.entityService.findOne('api::school.school', schoolId, {
        populate: { managers: true, culinaryLogo: true },
      }) as School | null;

      if (!school) {
        return ctx.badRequest('Invalid school');
      }

      // Validate order window
      const delivery = new Date(deliveryDate);
      const cartService = strapi.service('api::cart.cart');
      
      const windowValidation = cartService.validateOrderWindow(delivery, school);
      if (!windowValidation.valid) {
        return ctx.badRequest(windowValidation.error);
      }

      // Check pending order limit
      const pendingCheck = await cartService.checkPendingOrderLimit(userEmail, schoolId, delivery);
      if (!pendingCheck.canOrder) {
        return ctx.badRequest(
          `You already have a pending order for this date at this school (Order #${pendingCheck.existingOrderId}). Please wait for it to be approved or rejected.`
        );
      }

      // Create the order
      const order = await strapi.entityService.create('api::cart.cart', {
        data: {
          userEmail,
          school: schoolId,
          deliveryDate,
          lines,
          status: 'pending',
          publishedAt: new Date(),
        },
        populate: { school: true, lines: true },
      }) as Cart;

      // Send confirmation email to user
      const schoolBranding: SchoolBranding = {
        name: school.name,
        culinaryLogo: school.culinaryLogo,
        email: school.email,
        phone: school.phone,
        primaryColor: school.primaryColor,
        secondaryColor: school.secondaryColor,
        accentColor: school.accentColor,
      };

      const orderData: OrderData = {
        id: order.id,
        userEmail: order.userEmail,
        status: order.status,
        deliveryDate: order.deliveryDate,
        lines: order.lines,
        createdAt: order.createdAt,
      };

      const strapiUrl = process.env.STRAPI_URL || 'http://localhost:1337';

      // Send confirmation to user
      await sendOrderEmail(strapi, 'confirmation', userEmail, schoolBranding, orderData, strapiUrl);

      // Send notification to managers who have opted in
      if (school.managers && school.managers.length > 0) {
        for (const manager of school.managers) {
          // Check manager preferences
          const preference = await strapi.service('api::admin-preference.admin-preference').getOrCreate(manager.id);
          
          if (preference.emailNotifications?.newOrders !== false) {
            if (manager.email) {
              await sendOrderEmail(strapi, 'manager', manager.email, schoolBranding, orderData, strapiUrl);
            }
          }
        }
      }

      // Also send to school email if configured
      if (school.email) {
        await sendOrderEmail(strapi, 'manager', school.email, schoolBranding, orderData, strapiUrl);
      }

      ctx.body = order;
    } catch (error) {
      strapi.log.error('Order creation error:', error);
      ctx.throw(500, error instanceof Error ? error.message : 'Server error');
    }
  },

  async approveOrder(ctx) {
    const { id } = ctx.params;
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('User not authenticated');
    }

    try {
      // Get the order and its school
      const order = await strapi.entityService.findOne('api::cart.cart', id, {
        populate: { school: true },
      }) as Cart | null;

      if (!order) {
        return ctx.notFound();
      }

      // Check if user is a manager for this school
      if (!order.school) {
        return ctx.badRequest('Order must have an associated school');
      }

      const schoolId = order.school.id;
      const userSchools = await strapi.entityService.findMany('api::school.school', {
        filters: {
          managers: {
            id: user.id,
          },
        },
        fields: ['id'],
      });

      const hasPermission = userSchools.some((s: any) => s.id === schoolId);
      if (!hasPermission) {
        return ctx.forbidden('You do not have permission to approve orders for this school');
      }

      // Update order status
      const updatedOrder = await strapi.entityService.update('api::cart.cart', id, {
        data: {
          status: 'approved',
          approvedBy: user.id,
          approvedAt: new Date(),
        },
        populate: { school: { populate: { culinaryLogo: true } }, approvedBy: true, lines: true },
      }) as Cart;

      // Send approval email to user
      const school = await strapi.entityService.findOne('api::school.school', schoolId, {
        populate: { culinaryLogo: true },
      }) as School | null;

      if (school && updatedOrder.userEmail) {
        const schoolBranding: SchoolBranding = {
          name: school.name,
          culinaryLogo: school.culinaryLogo,
          email: school.email,
          phone: school.phone,
          primaryColor: school.primaryColor,
          secondaryColor: school.secondaryColor,
          accentColor: school.accentColor,
        };

        const orderData: OrderData = {
          id: updatedOrder.id,
          userEmail: updatedOrder.userEmail,
          status: updatedOrder.status,
          deliveryDate: updatedOrder.deliveryDate,
          lines: updatedOrder.lines,
        };

        const strapiUrl = process.env.STRAPI_URL || 'http://localhost:1337';
        await sendOrderEmail(strapi, 'approved', updatedOrder.userEmail, schoolBranding, orderData, strapiUrl);
      }

      ctx.body = updatedOrder;
    } catch (error) {
      ctx.throw(500, error instanceof Error ? error.message : 'Server error');
    }
  },

  async rejectOrder(ctx) {
    const { id } = ctx.params;
    const { rejectionReason } = ctx.request.body || {};
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('User not authenticated');
    }

    try {
      // Get the order and its school
      const order = await strapi.entityService.findOne('api::cart.cart', id, {
        populate: { school: true },
      }) as Cart | null;

      if (!order) {
        return ctx.notFound();
      }

      // Check if user is a manager for this school
      if (!order.school) {
        return ctx.badRequest('Order must have an associated school');
      }

      const schoolId = order.school.id;
      const userSchools = await strapi.entityService.findMany('api::school.school', {
        filters: {
          managers: {
            id: user.id,
          },
        },
        fields: ['id'],
      });

      const hasPermission = userSchools.some((s: any) => s.id === schoolId);
      if (!hasPermission) {
        return ctx.forbidden('You do not have permission to reject orders for this school');
      }

      // Update order status
      const updatedOrder = await strapi.entityService.update('api::cart.cart', id, {
        data: {
          status: 'rejected',
          rejectionReason: rejectionReason || null,
        },
        populate: { school: { populate: { culinaryLogo: true } }, lines: true },
      }) as Cart;

      // Send rejection email to user
      const school = await strapi.entityService.findOne('api::school.school', schoolId, {
        populate: { culinaryLogo: true },
      }) as School | null;

      if (school && updatedOrder.userEmail) {
        const schoolBranding: SchoolBranding = {
          name: school.name,
          culinaryLogo: school.culinaryLogo,
          email: school.email,
          phone: school.phone,
          primaryColor: school.primaryColor,
          secondaryColor: school.secondaryColor,
          accentColor: school.accentColor,
        };

        const orderData: OrderData = {
          id: updatedOrder.id,
          userEmail: updatedOrder.userEmail,
          status: updatedOrder.status,
          deliveryDate: updatedOrder.deliveryDate,
          rejectionReason: updatedOrder.rejectionReason,
          lines: updatedOrder.lines,
        };

        const strapiUrl = process.env.STRAPI_URL || 'http://localhost:1337';
        await sendOrderEmail(strapi, 'rejected', updatedOrder.userEmail, schoolBranding, orderData, strapiUrl);
      }

      ctx.body = updatedOrder;
    } catch (error) {
      ctx.throw(500, error instanceof Error ? error.message : 'Server error');
    }
  },

  /**
   * Preview email templates
   */
  async previewEmail(ctx) {
    const { template } = ctx.params;
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('User not authenticated');
    }

    const validTemplates = ['confirmation', 'manager', 'approved', 'rejected'];
    if (!validTemplates.includes(template)) {
      return ctx.badRequest(`Invalid template. Valid options: ${validTemplates.join(', ')}`);
    }

    // Mock data for preview
    const mockSchool: SchoolBranding = {
      name: 'Sample Culinary School',
      email: 'info@culinaryschool.com',
      phone: '(555) 123-4567',
      primaryColor: '#06604F',
      secondaryColor: '#8BBD5C',
      accentColor: '#f97316',
    };

    const mockOrder: OrderData = {
      id: 12345,
      userEmail: 'student@example.com',
      status: template === 'approved' ? 'approved' : template === 'rejected' ? 'rejected' : 'pending',
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      rejectionReason: template === 'rejected' ? 'This date is no longer available due to a school event.' : undefined,
      lines: [{ uuid: 'item-1' }, { uuid: 'item-2' }, { uuid: 'item-3' }],
      createdAt: new Date().toISOString(),
    };

    const strapiUrl = process.env.STRAPI_URL || 'http://localhost:1337';

    let html: string;
    switch (template) {
      case 'confirmation':
        html = await render(OrderConfirmation({ school: mockSchool, order: mockOrder, strapiUrl }));
        break;
      case 'manager':
        html = await render(ManagerNotification({ school: mockSchool, order: mockOrder, strapiUrl }));
        break;
      case 'approved':
        html = await render(OrderApproved({ school: mockSchool, order: mockOrder, strapiUrl }));
        break;
      case 'rejected':
        html = await render(OrderRejected({ school: mockSchool, order: mockOrder, strapiUrl }));
        break;
      default:
        return ctx.badRequest('Invalid template');
    }

    ctx.type = 'text/html';
    ctx.body = html;
  },
}));
