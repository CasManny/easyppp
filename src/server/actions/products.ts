"use server";

import { productCountryDiscountsSchema, productCustomizationSchema, productDetailSchema } from "@/schema/products";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { db } from "@/drizzle/db";
import { ProductTable } from "@/drizzle/schema";
import { createProductCustomization, deleteProductDb, updateCountryDiscountsDb, updateProductCustomizationDb } from "../db/products";
import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";
import { CACHE_TAG, revalidateDbCache } from "@/lib/cache";
import { and, eq } from "drizzle-orm";
import { canCreateProduct, canCustomizeBanner } from "../permission";

export const createProduct = async (
  unsafeData: z.infer<typeof productDetailSchema>
): Promise<{ error: boolean; message: string } | undefined> => {
  const { userId } = await auth();
    const { success, data } = productDetailSchema.safeParse(unsafeData);
    const canCreate = await canCreateProduct(userId!)

  if (!success || userId == null || !canCreate) {
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
    id: product.id,
  });

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

export const updateProduct = async (
    {id}: { id: string},
    unsafeData: z.infer<typeof productDetailSchema>
): Promise<{ error: boolean; message: string } | undefined> => {
  const { userId } = await auth();
  const { success, data } = productDetailSchema.safeParse(unsafeData);

  if (!success || userId == null) {
    return { error: true, message: "There was error updating your product" };
  }

  const { rowCount } = await db
    .update(ProductTable)
    .set(data)
      .where(and(eq(ProductTable.id, id), eq(ProductTable.clerkUserId, userId)));
    
    const isSuccess = rowCount > 0

  if (isSuccess) {
    revalidateDbCache({
      tag: CACHE_TAG.products,
      userId: userId,
      id: id,
    });
  }
    
    
    return { error: !isSuccess , message: "successfully updated your product"}

};


export const updateCountryDiscounts = async (id: string, unsafeData: z.infer<typeof productCountryDiscountsSchema>) => {
    const { userId } = await auth();
    const { success, data } = productCountryDiscountsSchema.safeParse(unsafeData);
  
    if (!success || userId == null) {
      return { error: true, message: "There was error saving your country product" };
    }

    const insert: { 
        countryGroupId: string
        productId: string
        coupon: string,
        discountPercentage: number
    }[] = []

    const deleteIds: { countryGroupId: string }[] = []
    
    data.groups.forEach(group => {
        if (group.coupon != null && group.coupon.length > 0 && group.discountPercentage != null && group.discountPercentage > 0) {
            insert.push({
                countryGroupId: group.countryGroupId,
                coupon: group.coupon,
                discountPercentage: group.discountPercentage / 100,
                productId: id
            })
        } else {
            deleteIds.push({countryGroupId: group.countryGroupId})
        }
    })


    await updateCountryDiscountsDb(deleteIds, insert, { productId: id, userId })
    
    return { error: false, message: "Country discounts saved"}



}

export const updateProductCustomization = async (id: string, unsafeData: z.infer<typeof productCustomizationSchema>) => {
    const { userId } = await auth()
    const { success, data } = productCustomizationSchema.safeParse(unsafeData)
    const canCustomize = await canCustomizeBanner(userId!)
    
    if (!success || userId == null || !canCustomize) {
        return { error: true, message: "There was an error updating your banner"}
    }

    await updateProductCustomizationDb(data, { productId: id, userId })
    
    return { error: false, message: "Banner updated"}
}