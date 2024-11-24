'use server'
import { db } from "@/drizzle/db";
import { userSubscriptionTable } from "@/drizzle/schema";

export const createUserSubscription = async (data: typeof userSubscriptionTable.$inferSelect) => {
    return db.insert(userSubscriptionTable).values(data).onConflictDoNothing({
        target: userSubscriptionTable.clerkUserId
    })
}