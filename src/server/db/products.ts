import { db } from "@/drizzle/db"
import { ProductCustomizationTable, ProductTable } from "@/drizzle/schema"
import { CACHE_TAG, dbCache, getUserTag, revalidateDbCache } from "@/lib/cache"
import { and, eq } from "drizzle-orm"

export const getProducts = (userId: string, { limit}: { limit?: number}) => {
    const cacheFn = dbCache(getProductsInternal, { tags: [getUserTag(userId, CACHE_TAG.products)] })
    return cacheFn(userId, { limit})
}

export const createProductCustomization = async (id: string) => {
    try {
        await db.insert(ProductCustomizationTable).values({productId: id}).onConflictDoNothing({target: ProductCustomizationTable.productId})
    } catch (error) {
        await db.delete(ProductTable).where(eq(ProductTable.id, id))
    }
}

export const deleteProductDb = async ({ id, userId }: { id: string, userId: string }) => {
    const { rowCount } = await db.delete(ProductTable).where(and(eq(ProductTable.id, id), eq(ProductTable.clerkUserId, userId)))
    if (rowCount > 0) {
        revalidateDbCache({
            tag: CACHE_TAG.products,
            userId,
            id
        })
    }
    return rowCount > 0
}

const getProductsInternal = (userId: string, { limit }: { limit?: number }) => {
    return db.query.ProductTable.findMany({
        where: eq(ProductTable.clerkUserId, userId),
        orderBy: ({createdAt}, { desc}) => [desc(createdAt)],
        limit
    })
}
