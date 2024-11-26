import { getProductCount } from "./db/products"
import { getUserSubscriptionTier } from "./db/subscription"

export const canRemoveBranding = async (userId: string) => {
    if (userId == null) return false
    const tier = await getUserSubscriptionTier(userId)
    return tier.canRemoveBranding
}

export const canCustomizeBanner = async (userId: string) => {
    if(userId == null) return false

    const tier = await getUserSubscriptionTier(userId)
    return tier.canCustomizeBanner
}

export const canAccessAnalytics = async (userId: string) => {
    if(userId == null) return false

    const tier = await getUserSubscriptionTier(userId)
    return tier.canAccessAnalytics
}  

export const canCreateProduct = async (userId: string) => {
    if (userId == null) return false
    const tier = await getUserSubscriptionTier(userId)
    const productCount = await getProductCount(userId)
    return productCount < tier.maxNumberOfProducts
    
}