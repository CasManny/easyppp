"use server";
import { db } from "@/drizzle/db";
import { UserSubscriptionTable } from "@/drizzle/schema";
import { CACHE_TAG, revalidateDbCache } from "@/lib/cache";

export const createUserSubscription = async (
  data: typeof UserSubscriptionTable.$inferSelect
) => {
  const [newSubscription] = await db
    .insert(UserSubscriptionTable)
    .values(data)
    .onConflictDoNothing({
      target: UserSubscriptionTable.clerkUserId,
    })
    .returning({
      id: UserSubscriptionTable.id,
      userId: UserSubscriptionTable.clerkUserId,
    });

  if (newSubscription != null) {
    revalidateDbCache({
      tag: CACHE_TAG.subscription,
      id: newSubscription.id,
      userId: newSubscription.userId,
    });
  }
    
    return newSubscription
};
