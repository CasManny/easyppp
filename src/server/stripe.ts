"use server";
import { PaidTierNames, subscriptionTiers } from "@/data/subscription";
import { auth, currentUser, User } from "@clerk/nextjs/server";
import { getUserSubscription } from "./db/subscription";
import { Stripe } from "stripe";
import { env as stripeEnv } from "@/data/env/server";
import { env as ClientEnv } from "@/data/env/client";
import { redirect } from "next/navigation";

const stripe = new Stripe(stripeEnv.STRIPE_SECRET_KEY);

export const createCancelSession = async () => {
    const { userId } = await auth();
    if (userId == null) {
      return { error: true };
    }
  
    const subscription = await getUserSubscription(userId);
    if (subscription?.stripeCustomerId) {
      return { error: true };
    }

    if (subscription?.stripeCustomerId == null || subscription.stripeSubscriptionItemId == null) {
        throw new Error("Internal server error")
    }

    const portalSession = await stripe.billingPortal.sessions.create({
        customer: subscription.stripeCustomerId,
        return_url: `${ClientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`,
        flow_data: {
          type: "subscription_cancel",
            subscription_cancel: {
              subscription: subscription?.stripeSubscriptionId!
          }
        },
    });
    
    redirect(portalSession.url)
        

};

export const createCustomerPortalSession = async () => {
  const { userId } = await auth();
  if (userId == null) {
    return { error: true };
  }

  const subscription = await getUserSubscription(userId);
  if (subscription?.stripeCustomerId) {
    return { error: true };
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription?.stripeCustomerId!,
    return_url: `${ClientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`,
  });

  redirect(portalSession.url);
};

export const createCheckoutSession = async (tier: PaidTierNames) => {
  const user = await currentUser();
  if (user == null) return { error: true };
  const subscription = await getUserSubscription(user.id);
  if (subscription == null) return { error: true };

  if (subscription.stripeCustomerId == null) {
    const url = await getCheckoutSession(tier, user);
    if (url == null) {
      return { error: true };
    }
    redirect(url);
  } else {
    const url = await getSubscriptionUpgradeSession(tier, subscription);
    redirect(url!)
  }
};

const getCheckoutSession = async (tier: PaidTierNames, user: User) => {
  const customerDetails = {
    customer_email: user.primaryEmailAddress?.emailAddress,
  };
  const session = await stripe.checkout.sessions.create({
    customer_email: user.primaryEmailAddress?.emailAddress,
    subscription_data: {
      metadata: {
        clerkUserId: user.id,
      },
    },
    line_items: [
      {
        price: subscriptionTiers[tier].stripePriceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${ClientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`,
    cancel_url: `${ClientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`,
  });
  return session.url;
};

const getSubscriptionUpgradeSession = async (
  tier: PaidTierNames,
  subscription: {
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
    stripeSubscriptionItemId: string | null;
  }
) => {
  if (
    subscription.stripeCustomerId == null ||
    subscription.stripeSubscriptionId == null ||
    subscription.stripeSubscriptionItemId
  ) {
    throw new Error("")
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${ClientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`,
    flow_data: {
      type: "subscription_update_confirm",
      subscription_update_confirm: {
        subscription: subscription.stripeSubscriptionItemId!,
        items: [
          {
            id: subscription.stripeSubscriptionItemId!,
            price: subscriptionTiers[tier].stripePriceId,
            quantity: 1,
          },
        ],
      },
    },
  });
    
    return  portalSession.url
};
