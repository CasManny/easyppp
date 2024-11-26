import { db } from "@/drizzle/db";
import {
  CountryGroupDiscountTable,
  CountryGroupTable,
  ProductCustomizationTable,
  ProductTable,
} from "@/drizzle/schema";
import {
  CACHE_TAG,
  dbCache,
  getGlobalTag,
  getIdTag,
  getUserTag,
  revalidateDbCache,
} from "@/lib/cache";
import { and, eq, inArray, sql } from "drizzle-orm";
import { BatchItem } from "drizzle-orm/batch";
import { revalidateTag } from "next/cache";

export const getProductCountryGroups = ({
  productId,
  userId,
}: {
  productId: string;
  userId: string;
}) => {
  const cacheFn = dbCache(getProductCountryGroupsInternal, {
    tags: [
      getIdTag(productId, CACHE_TAG.products),
      getGlobalTag(CACHE_TAG.countries),
      getGlobalTag(CACHE_TAG.countryGroup),
    ],
  });
  return cacheFn({ productId, userId });
};

export const getProducts = (userId: string, { limit }: { limit?: number }) => {
  const cacheFn = dbCache(getProductsInternal, {
    tags: [getUserTag(userId, CACHE_TAG.products)],
  });
  return cacheFn(userId, { limit });
};

export const createProductCustomization = async (id: string) => {
  try {
    await db
      .insert(ProductCustomizationTable)
      .values({ productId: id })
      .onConflictDoNothing({ target: ProductCustomizationTable.productId });
  } catch (error) {
    await db.delete(ProductTable).where(eq(ProductTable.id, id));
  }
};

export const deleteProductDb = async ({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) => {
  const { rowCount } = await db
    .delete(ProductTable)
    .where(and(eq(ProductTable.id, id), eq(ProductTable.clerkUserId, userId)));
  if (rowCount > 0) {
    revalidateDbCache({
      tag: CACHE_TAG.products,
      userId,
      id,
    });
  }
  return rowCount > 0;
};

export const updateCountryDiscountsDb = async (
  deleteGroup: { countryGroupId: string }[],
  insertGroup: InsertType[],
  { productId, userId }: { productId: string; userId: string }
) => {
  const product = await getProduct({ id: productId, userId });
  if (product == null) return false;

  const statements: BatchItem<"pg">[] = [];

  if (deleteGroup.length > 0) {
    statements.push(
      db.delete(CountryGroupDiscountTable).where(
        and(
          eq(CountryGroupDiscountTable.productId, productId),
          inArray(
            CountryGroupDiscountTable.countryGroupId,
            deleteGroup.map((group) => group.countryGroupId)
          )
        )
      )
    );
  }

  if (insertGroup.length > 0) {
    statements.push(
      db
        .insert(CountryGroupDiscountTable)
        .values(insertGroup)
        .onConflictDoUpdate({
          target: [
            CountryGroupDiscountTable.productId,
            CountryGroupDiscountTable.countryGroupId,
          ],
          set: {
            coupon: sql.raw(
              `excluded.${CountryGroupDiscountTable.coupon.name}`
            ),
            discountPercentage: sql.raw(
              `excluded.${CountryGroupDiscountTable.discountPercentage.name}`
            ),
          },
        })
    );
  }
    
    if (statements.length > 0) {
             await db.batch(statements as [BatchItem<'pg'>])
    }

    revalidateDbCache({
        tag: CACHE_TAG.products,
        userId,
        id: productId
   })
};

const getProductsInternal = (userId: string, { limit }: { limit?: number }) => {
  return db.query.ProductTable.findMany({
    where: eq(ProductTable.clerkUserId, userId),
    orderBy: ({ createdAt }, { desc }) => [desc(createdAt)],
    limit,
  });
};

export const getProduct = ({ id, userId }: { id: string; userId: string }) => {
  const cacheFn = dbCache(getProductInternal, {
    tags: [getIdTag(id, CACHE_TAG.products)],
  });
  return cacheFn({ id, userId });
};
export const getProductInternal = ({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) => {
  return db.query.ProductTable.findFirst({
    where: and(eq(ProductTable.id, id), eq(ProductTable.clerkUserId, userId)),
  });
};

export const getProductCountryGroupsInternal = async ({
  productId,
  userId,
}: {
  productId: string;
  userId: string;
}) => {
  const product = await getProduct({ id: productId, userId });
  if (product == null) return [];
  const data = await db.query.CountryGroupTable.findMany({
    with: {
      countries: {
        columns: {
          name: true,
          code: true,
        },
      },
      countryGroupDiscounts: {
        columns: {
          coupon: true,
          discountPercentage: true,
        },
        where: eq(CountryGroupDiscountTable.productId, productId),
        limit: 1,
      },
    },
  });

  return data.map((group) => {
    return {
      id: group.id,
      name: group.name,
      recommendedDiscountPercentage: group.recommendedDiscountPercentage,
      countries: group.countries,
      discount: group.countryGroupDiscounts.at(0),
    };
  });
};
