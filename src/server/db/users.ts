"use server";
import { db } from "@/drizzle/db";
import { ProductTable, UserSubscriptionTable } from "@/drizzle/schema";
import { CACHE_TAG, revalidateDbCache } from "@/lib/cache";
import { eq } from "drizzle-orm";

export const deleteUser = async (clerkUserId: string) => {
  const [userSubscriptions, products] =  await db.batch([
    db
      .delete(UserSubscriptionTable)
      .where(eq(UserSubscriptionTable.clerkUserId, clerkUserId)).returning({id: UserSubscriptionTable.id}),
    db.delete(ProductTable).where(eq(ProductTable.clerkUserId, clerkUserId)).returning({id: ProductTable.id}),
  ]);

  userSubscriptions.forEach((sub) => {
    revalidateDbCache({
      tag: CACHE_TAG.subscription,
      id: sub.id,
      userId: clerkUserId
    })
  })

  products.forEach((pro) => {
    revalidateDbCache({
      tag: CACHE_TAG.products,
      id: pro.id,
      userId: clerkUserId
    })
  })

  return [userSubscriptions, products]
};
