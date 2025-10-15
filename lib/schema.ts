import { pgTable, text, timestamp, uuid, integer, boolean, decimal, json, date } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table (extends NextAuth users)
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').unique().notNull(),
  image: text('image'),
  role: text('role').default('user').notNull(), // 'user', 'admin'
  schoolId: uuid('school_id').references(() => schools.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Schools table
export const schools = pgTable('schools', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  address: text('address'),
  phone: text('phone'),
  email: text('email'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Menu categories
export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  isActive: boolean('is_active').default(true),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Menu items
export const menuItems = pgTable('menu_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  categoryId: uuid('category_id').references(() => categories.id),
  schoolId: uuid('school_id').references(() => schools.id), // Added schoolId
  image: text('image'),
  isAvailable: boolean('is_available').default(true),
  isCustomizable: boolean('is_customizable').default(false),
  isFeatured: boolean('is_featured').default(false),
  allergens: json('allergens'), // JSON array of allergens
  nutritionInfo: json('nutrition_info'), // JSON object with nutrition data
  preparationTime: integer('preparation_time'), // in minutes
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const carts = pgTable('carts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  schoolId: uuid('school_id').references(() => schools.id),
  status: text('status').default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const cartItems = pgTable('cart_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  cartId: uuid('cart_id').references(() => carts.id, { onDelete: 'cascade' }).notNull(),
  menuItemId: uuid('menu_item_id').references(() => menuItems.id).notNull(),
  quantity: integer('quantity').notNull().default(1),
  customizations: json('customizations'),
  specialInstructions: text('special_instructions'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Orders table
export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id),
  schoolId: uuid('school_id').references(() => schools.id),
  status: text('status').default('pending').notNull(), // 'pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  specialInstructions: text('special_instructions'),
  pickupTime: timestamp('pickup_time'),
  orderType: text('order_type').default('pickup').notNull(), // 'pickup', 'delivery'
  paymentStatus: text('payment_status').default('pending').notNull(), // 'pending', 'paid', 'failed'
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Order items
export const orderItems = pgTable('order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }),
  menuItemId: uuid('menu_item_id').references(() => menuItems.id),
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  customizations: json('customizations'), // JSON object with customizations
  specialInstructions: text('special_instructions'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Reservations table
export const reservations = pgTable('reservations', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id),
  schoolId: uuid('school_id').references(() => schools.id),
  date: date('date').notNull(),
  time: text('time').notNull(), // 'breakfast', 'lunch', 'dinner'
  partySize: integer('party_size').notNull(),
  status: text('status').default('pending').notNull(), // 'pending', 'confirmed', 'cancelled'
  specialRequests: text('special_requests'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Availability settings (for admin to block out times)
export const availabilitySettings = pgTable('availability_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  schoolId: uuid('school_id').references(() => schools.id),
  date: date('date').notNull(),
  timeSlot: text('time_slot').notNull(), // 'breakfast', 'lunch', 'dinner'
  isAvailable: boolean('is_available').default(true),
  maxCapacity: integer('max_capacity'),
  reason: text('reason'), // Why it's blocked out
  createdBy: text('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Custom item requests
export const customRequests = pgTable('custom_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id),
  schoolId: uuid('school_id').references(() => schools.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  estimatedPrice: decimal('estimated_price', { precision: 10, scale: 2 }),
  status: text('status').default('pending').notNull(), // 'pending', 'approved', 'rejected', 'completed'
  adminNotes: text('admin_notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  school: one(schools, {
    fields: [users.schoolId],
    references: [schools.id],
  }),
  orders: many(orders),
  reservations: many(reservations),
  customRequests: many(customRequests),
  carts: many(carts),
}));

export const schoolsRelations = relations(schools, ({ many }) => ({
  users: many(users),
  orders: many(orders),
  reservations: many(reservations),
  customRequests: many(customRequests),
  availabilitySettings: many(availabilitySettings),
  menuItems: many(menuItems), // Added relation to menuItems
  carts: many(carts),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  menuItems: many(menuItems),
}));

export const menuItemsRelations = relations(menuItems, ({ one, many }) => ({
  category: one(categories, {
    fields: [menuItems.categoryId],
    references: [categories.id],
  }),
  school: one(schools, { // Added relation to schools
    fields: [menuItems.schoolId],
    references: [schools.id],
  }),
  orderItems: many(orderItems),
  cartItems: many(cartItems),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  school: one(schools, {
    fields: [orders.schoolId],
    references: [schools.id],
  }),
  orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  menuItem: one(menuItems, {
    fields: [orderItems.menuItemId],
    references: [menuItems.id],
  }),
}));

export const cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id],
  }),
  school: one(schools, {
    fields: [carts.schoolId],
    references: [schools.id],
  }),
  cartItems: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  menuItem: one(menuItems, {
    fields: [cartItems.menuItemId],
    references: [menuItems.id],
  }),
}));

export const reservationsRelations = relations(reservations, ({ one }) => ({
  user: one(users, {
    fields: [reservations.userId],
    references: [users.id],
  }),
  school: one(schools, {
    fields: [reservations.schoolId],
    references: [schools.id],
  }),
}));

export const customRequestsRelations = relations(customRequests, ({ one }) => ({
  user: one(users, {
    fields: [customRequests.userId],
    references: [users.id],
  }),
  school: one(schools, {
    fields: [customRequests.schoolId],
    references: [schools.id],
  }),
}));