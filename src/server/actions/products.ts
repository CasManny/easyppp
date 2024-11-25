"use server";

import { productDetailSchema } from "@/schema/products";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { db } from "@/drizzle/db";
import { ProductTable } from "@/drizzle/schema";
import { createProductCustomization, deleteProductDb } from "../db/products";
import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";
import { CACHE_TAG, revalidateDbCache } from "@/lib/cache";

export const createProduct = async (
  unsafeData: z.infer<typeof productDetailSchema>
): Promise<{ error: boolean; message: string } | undefined> => {
  const { userId } = await auth();
  const { success, data } = productDetailSchema.safeParse(unsafeData);

  if (!success || userId == null) {
    return { error: true, message: "There was error creating your product" };
  }

  const [product] = await db
    .insert(ProductTable)
    .values({ ...data, clerkUserId: userId })
    .returning({ id: ProductTable.id, clerkUserId: ProductTable.clerkUserId });
    await createProductCustomization(product.id);
    revalidateDbCache({
        tag: CACHE_TAG.products,
        userId: product.clerkUserId,
        id: product.id
    })

  redirect(`/dashboard/products/${product.id}/edit?tab=countries`);
};

export const deleteProduct = async (id: string) => {
  const { userId } = await auth();
  const errorMessage = "There was an error deleting your product";
  if (userId == null) {
    return { error: true, message: errorMessage };
  }

  const isSuccess = await deleteProductDb({ id, userId });
  if (isSuccess) {
    return {
      error: !isSuccess,
      message: isSuccess ? "Successfully deleted your product" : errorMessage,
    };
  }
};
