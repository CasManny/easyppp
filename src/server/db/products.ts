"use server"

import { db } from "@/drizzle/db"
import { productTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"

export const getProducts = async (userId: string, { limit}: { limit?: number}) => {
    const products = await db.query.productTable.findMany({
        where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
        orderBy: ({ createdAt }, { desc }) => desc(createdAt),
        limit
    })
    return products
}