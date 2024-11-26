import { revalidateTag, unstable_cache } from "next/cache";
import { cache } from "react";

export type ValidTags =
  | ReturnType<typeof getGlobalTag>
  | ReturnType<typeof getUserTag>
  | ReturnType<typeof getIdTag>;

export const CACHE_TAG = {
  products: "products",
  productViews: "productViews",
  subscription: "subscription",
  countries: "countries",
  countryGroup: "countryGroup",
} as const;

export const getGlobalTag = (tag: keyof typeof CACHE_TAG) => {
  return `global:${CACHE_TAG[tag]}` as const;
};

export const getUserTag = (userId: string, tag: keyof typeof CACHE_TAG) => {
  return `user:${userId}-${CACHE_TAG[tag]}` as const;
};

export const getIdTag = (id: string, tag: keyof typeof CACHE_TAG) => {
  return `${id}-${CACHE_TAG[tag]}` as const;
};

export const clearFullCache = () => {
  revalidateTag("*");
};

export const dbCache = <T extends (...args: any[]) => Promise<any>>(
  cb: Parameters<typeof unstable_cache<T>>[0],
  { tags }: { tags: ValidTags[] }
) => {
  return cache(unstable_cache<T>(cb, undefined, { tags: [...tags, "*"] }));
};

export const revalidateDbCache = ({
  tag,
  userId,
  id,
}: {
  tag: keyof typeof CACHE_TAG;
  userId?: string;
  id?: string;
}) => {
  revalidateTag(getGlobalTag(tag));
  if (userId != null) {
    revalidateTag(getUserTag(userId, tag));
  }

  if (id != null) {
    revalidateTag(getIdTag(id, tag));
  }
};
