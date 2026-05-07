import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, boolean, integer, index, uniqueIndex } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').default(false).notNull(),
	image: text('image'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
	role: text('role'),
	banned: boolean('banned').default(false),
	banReason: text('ban_reason'),
	banExpires: timestamp('ban_expires')
});

export const session = pgTable(
	'session',
	{
		id: text('id').primaryKey(),
		expiresAt: timestamp('expires_at').notNull(),
		token: text('token').notNull().unique(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
		ipAddress: text('ip_address'),
		userAgent: text('user_agent'),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		impersonatedBy: text('impersonated_by')
	},
	(table) => [index('session_userId_idx').on(table.userId)]
);

export const account = pgTable(
	'account',
	{
		id: text('id').primaryKey(),
		accountId: text('account_id').notNull(),
		providerId: text('provider_id').notNull(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		accessToken: text('access_token'),
		refreshToken: text('refresh_token'),
		idToken: text('id_token'),
		accessTokenExpiresAt: timestamp('access_token_expires_at'),
		refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
		scope: text('scope'),
		password: text('password'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull()
	},
	(table) => [index('account_userId_idx').on(table.userId)]
);

export const verification = pgTable(
	'verification',
	{
		id: text('id').primaryKey(),
		identifier: text('identifier').notNull(),
		value: text('value').notNull(),
		expiresAt: timestamp('expires_at').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull()
	},
	(table) => [index('verification_identifier_idx').on(table.identifier)]
);

export const category = pgTable(
	'category',
	{
		id: text('id').primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		name: text('name').notNull(),
		color: text('color').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull()
	},
	(table) => [
		index('category_userId_idx').on(table.userId),
		uniqueIndex('category_userId_name_uq').on(table.userId, table.name)
	]
);

export const pill = pgTable(
	'pill',
	{
		id: text('id').primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		categoryId: text('category_id').references(() => category.id, { onDelete: 'set null' }),
		number: integer('number').notNull(),
		title: text('title').notNull(),
		excerpt: text('excerpt').notNull(),
		body: text('body').notNull(),
		source: text('source'),
		sourceUrl: text('source_url'),
		favorite: boolean('favorite').default(false).notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull()
	},
	(table) => [
		index('pill_userId_idx').on(table.userId),
		index('pill_categoryId_idx').on(table.categoryId),
		uniqueIndex('pill_userId_number_uq').on(table.userId, table.number),
		index('pill_userId_createdAt_idx').on(table.userId, table.createdAt)
	]
);

export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	accounts: many(account),
	pills: many(pill),
	categories: many(category)
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, { fields: [session.userId], references: [user.id] })
}));

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, { fields: [account.userId], references: [user.id] })
}));

export const categoryRelations = relations(category, ({ one, many }) => ({
	user: one(user, { fields: [category.userId], references: [user.id] }),
	pills: many(pill)
}));

export const pillRelations = relations(pill, ({ one }) => ({
	user: one(user, { fields: [pill.userId], references: [user.id] }),
	category: one(category, { fields: [pill.categoryId], references: [category.id] })
}));

export type DBUser = typeof user.$inferSelect;
export type DBCategory = typeof category.$inferSelect;
export type DBNewCategory = typeof category.$inferInsert;
export type DBPill = typeof pill.$inferSelect;
export type DBNewPill = typeof pill.$inferInsert;
