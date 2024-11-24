CREATE TYPE "public"."tier" AS ENUM('Free', 'Basic', 'Standard', 'Premium');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "country_group_discounts" (
	"id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"coupon" text NOT NULL,
	"discount_percentage" real NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "country_group_discounts_id_product_id_pk" PRIMARY KEY("id","product_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "country_group" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"recommended_discount_percentage" real,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "country_group_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "countries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"code" text NOT NULL,
	"country_group_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "countries_name_unique" UNIQUE("name"),
	CONSTRAINT "countries_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_customizations" (
	"id" uuid NOT NULL,
	"class_prefix" text,
	"location_message" text DEFAULT 'Hey! it looks like you are from <b>{country}</b>. We support parity purchasing power, so if you need it, use code <b>''{coupon}''</b> to get <b>{discount}%</b> off' NOT NULL,
	"background_color" text DEFAULT 'hsl(193, 82%, 31%)' NOT NULL,
	"text_color" text DEFAULT '1rem' NOT NULL,
	"banner_container" text DEFAULT 'body' NOT NULL,
	"is_sticky" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_customizations_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"description" text,
	"create_at" timestamp DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"country_id" uuid,
	"visited_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_subscription" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"stripe_subscription_item_id" text,
	"stripe_subscription_id" text NOT NULL,
	"stripe_customer_id" text,
	"tier" "tier" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_subscription_clerk_user_id_unique" UNIQUE("clerk_user_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "country_group_discounts" ADD CONSTRAINT "country_group_discounts_id_country_group_id_fk" FOREIGN KEY ("id") REFERENCES "public"."country_group"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "country_group_discounts" ADD CONSTRAINT "country_group_discounts_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "countries" ADD CONSTRAINT "countries_country_group_id_country_group_id_fk" FOREIGN KEY ("country_group_id") REFERENCES "public"."country_group"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_customizations" ADD CONSTRAINT "product_customizations_id_products_id_fk" FOREIGN KEY ("id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_views" ADD CONSTRAINT "product_views_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_views" ADD CONSTRAINT "product_views_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "products.clerk_user_id_index" ON "products" USING btree ("clerk_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_subscription.clerk_user_id_index" ON "user_subscription" USING btree ("clerk_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_subscription.stripe_customer_id_index" ON "user_subscription" USING btree ("stripe_customer_id");