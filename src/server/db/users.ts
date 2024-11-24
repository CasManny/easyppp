"use server";
import { db } from "@/drizzle/db";
import { productTable, userSubscriptionTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const deleteUser = async (clerkUserId: string) => {
  return db.batch([
    db
      .delete(userSubscriptionTable)
      .where(eq(userSubscriptionTable.clerkUserId, clerkUserId)),
    db.delete(productTable).where(eq(productTable.clerkUserId, clerkUserId)),
  ]);
};
