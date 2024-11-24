import { subscriptionTiers, TierNames } from "@/data/subscription";
import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

const createdAt = timestamp("created_at", { withTimezone: true })
  .notNull()
  .defaultNow();
const updatedAt = timestamp("updated_at", { withTimezone: true })
  .notNull()
  .defaultNow();

export const productTable = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkUserId: text("clerk_user_id").notNull(),
    name: text("name").notNull(),
    url: text("url").notNull(),
    description: text("description"),
    createAt: timestamp("create_at").defaultNow(),
    createdAt,
    updatedAt,
  },
  (table) => ({
    clerkUserIdIndex: index("products.clerk_user_id_index").on(
      table.clerkUserId
    ),
  })
);

export const productRelations = relations(productTable, ({ one, many }) => ({
  productCustomization: one(productCustomizationTable),
  productViews: many(productViewTable),
  countryGroupDiscounts: many(countryGroupDiscountTable),
}));

export const productCustomizationTable = pgTable("product_customizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  classPrefix: text("class_prefix"),
  productId: uuid("id")
    .notNull()
    .references(() => productTable.id, { onDelete: "cascade" })
    .unique(),
  locationMessage: text("location_message")
    .notNull()
    .default(
      "Hey! it looks like you are from <b>{country}</b>. We support parity purchasing power, so if you need it, use code <b>'{coupon}'</b> to get <b>{discount}%</b> off"
    ),
  backgroundColor: text("background_color")
    .notNull()
    .default("hsl(193, 82%, 31%)"),
  textColor: text("text_color").default("hsl(0, 0%, 100%)"),
  fontSize: text("text_color").notNull().default("1rem"),
  banerContainer: text("banner_container").notNull().default("body"),
  isSticky: boolean("is_sticky").notNull().default(true),
  createdAt,
  updatedAt,
});

export const productCustomizationRelations = relations(
  productCustomizationTable,
  ({ one }) => ({
    product: one(productTable, {
      fields: [productCustomizationTable.productId],
      references: [productTable.id],
    }),
  })
);

export const productViewTable = pgTable("product_views", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => productTable.id, { onDelete: "cascade" }),
  countryId: uuid("country_id").references(() => countryTable.id, {
    onDelete: "cascade",
  }),
  visitedAt: timestamp("visited_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const productViewRelations = relations(
  productViewTable,
  ({ one, many }) => ({
    product: one(productTable, {
      fields: [productViewTable.productId],
      references: [productTable.id],
    }),
    country: one(countryTable, {
      fields: [productViewTable.countryId],
      references: [countryTable.id],
    }),
  })
);

export const countryTable = pgTable("countries", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").unique(),
  code: text("code").notNull().unique(),
  countryGroupId: uuid("country_group_id")
    .notNull()
    .references(() => countryGroupTable.id, { onDelete: "cascade" }),
  createdAt,
  updatedAt,
});

export const countryTableRelations = relations(
  countryTable,
  ({ one, many }) => ({
    countryGroup: one(countryGroupTable, {
      fields: [countryTable.countryGroupId],
      references: [countryGroupTable.id],
    }),
    productViews: many(productViewTable),
  })
);

export const countryGroupTable = pgTable("country_group", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  recommendedDiscountPercentage: real("recommended_discount_percentage"),
  createdAt,
  updatedAt,
});

export const countryGroupRelations = relations(
  countryGroupTable,
  ({ many }) => ({
    countries: many(countryTable),
    countryGroupDiscount: many(countryGroupDiscountTable),
  })
);

export const countryGroupDiscountTable = pgTable(
  "country_group_discounts",
  {
    countryGroupId: uuid("id")
      .notNull()
      .references(() => countryGroupTable.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => productTable.id, { onDelete: "cascade" }),
    coupon: text("coupon").notNull(),
    discountPercentage: real("discount_percentage").notNull(),
    createdAt,
    updatedAt,
  },
  (table) => ({
    pk: primaryKey({ columns: [table.countryGroupId, table.productId] }),
  })
);

export const countryGroupDiscountRelations = relations(
  countryGroupDiscountTable,
  ({ one }) => ({
    product: one(productTable, {
      fields: [countryGroupDiscountTable.productId],
      references: [productTable.id],
    }),
    countryGroup: one(countryTable, {
      fields: [countryGroupDiscountTable.countryGroupId],
      references: [countryTable.id],
    }),
  })
);

export const TierEnum = pgEnum(
  "tier",
  Object.keys(subscriptionTiers) as [TierNames]
);
export const userSubscriptionTable = pgTable(
  "user_subscription",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkUserId: text("clerk_user_id").notNull().unique(),
    stripeSubscriptionItemId: text("stripe_subscription_item_id"),
    stripeSubscriptionId: text("stripe_subscription_id"),
    stripeCustomerId: text("stripe_customer_id"),
    tier: TierEnum("tier").notNull(),
    createdAt,
    updatedAt,
  },
  (table) => ({
    clerkUserIndex: index("user_subscription.clerk_user_id_index").on(
      table.clerkUserId
    ),
    stripeCustomerIdIndex: index(
      "user_subscription.stripe_customer_id_index"
    ).on(table.stripeCustomerId),
  })
);
