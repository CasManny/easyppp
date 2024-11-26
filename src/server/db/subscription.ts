import { subscriptionTiers } from "@/data/subscription";
import { db } from "@/drizzle/db";
import { UserSubscriptionTable } from "@/drizzle/schema";
import { CACHE_TAG, dbCache, getUserTag, revalidateDbCache } from "@/lib/cache";
import { eq } from "drizzle-orm";

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

export const getUserSubscription =  (userId: string) => {
    const cacheFn = dbCache(getUserSubscriptionInternal, {
        tags: [getUserTag(userId, CACHE_TAG.subscription)]
    })

    return cacheFn(userId)
}

export const getUserSubscriptionTier = async (userId: string) => {
    const subscription = await getUserSubscription(userId)
    if (subscription == null) {
        throw new Error("User has no subscription")
    }

    return subscriptionTiers[subscription.tier]
}

export const getUserSubscriptionInternal = (userId: string) => {
    return db.query.UserSubscriptionTable.findFirst({
        where: eq(UserSubscriptionTable.clerkUserId, userId)
    })
}
