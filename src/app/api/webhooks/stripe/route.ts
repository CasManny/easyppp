import { env as stripeEnv } from "@/data/env/server";
import { getTierByPriceId, subscriptionTiers } from "@/data/subscription";
import { UserSubscriptionTable } from "@/drizzle/schema";
import { updateUserSubscription } from "@/server/db/subscription";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import Stripe from "stripe";
import { custom } from "zod";

const stripe = new Stripe(stripeEnv.STRIPE_SECRET_KEY);

export const POST = async (request: NextRequest) => {
  const event = await stripe.webhooks.constructEvent(
    await request.text(),
    request.headers.get("stripe-signature") as string,
    stripeEnv.STRIPE_WEBHOOK_SECRET
  );

  switch (event.type) {
      case "customer.subscription.deleted": {
          await handleDelete(event.data.object)
    }
      case "customer.subscription.updated": {
          await handleUpdate(event.data.object)
    }
      case "customer.subscription.created": {
          await handleCreate(event.data.object)
    }
  }

  return new Response(null, { status: 200 });
};



const handleCreate = async (subscription: Stripe.Subscription) => {
    const tier = getTierByPriceId(subscription.items.data[0].price.id)
    const clerkUserId = subscription.metadata.clerkUserId
    if (clerkUserId == null || tier == null) {
        return new Response(null, { status: 500})
    }

    const customer = subscription.customer
    const customerId = typeof customer === "string" ? customer : customer.id

   return  await updateUserSubscription(eq(UserSubscriptionTable.clerkUserId, clerkUserId), {
        stripeCustomerId: customerId,
        tier: tier.name,
        stripeSubscriptionId: subscription.id,
        stripeSubscriptionItemId: subscription.items.data[0].id
    })

}

const handleUpdate = async (subscription: Stripe.Subscription) => {
    const tier = getTierByPriceId(subscription.items.data[0].price.id)
    const customer = subscription.customer
    const customerId = typeof customer === "string" ? customer : customer.id
    if (tier == null) {
        return new Response(null, { status: 500})
    }

    return  await updateUserSubscription(eq(UserSubscriptionTable.stripeCustomerId, customerId), {
        tier: tier.name,
    })

}

const handleDelete = async (subscription: Stripe.Subscription) => {
    const customer = subscription.customer
    const customerId = typeof customer === "string" ? customer : customer.id

    return  await updateUserSubscription(eq(UserSubscriptionTable.stripeCustomerId, customerId), {
        tier: subscriptionTiers.Free.name,
        stripeSubscriptionId: null,
        stripeSubscriptionItemId: null,
    })
}
