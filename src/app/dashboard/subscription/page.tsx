import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  subscriptionTiers,
  subscriptionTiersInOrder,
  TierNames,
} from "@/data/subscription";
import { cn, formatCompactNumber } from "@/lib/utils";
import { getProductCount } from "@/server/db/products";
import { getProductViewCount } from "@/server/db/productViews";
import { getUserSubscriptionTier } from "@/server/db/subscription";
import {
  createCancelSession,
  createCheckoutSession,
  createCustomerPortalSession,
} from "@/server/stripe";
import { auth } from "@clerk/nextjs/server";
import { startOfMonth } from "date-fns";
import { Check, CheckIcon } from "lucide-react";
import { ReactNode } from "react";

const SubscriptionPage = async () => {
  const { userId, redirectToSignIn } = await auth();
  if (userId == null) {
    return redirectToSignIn();
  }
  const tier = await getUserSubscriptionTier(userId);
  const productCount = await getProductCount(userId);
  const pricingViewCount = await getProductViewCount(
    userId,
    startOfMonth(new Date())
  );
  return (
    <>
      <h1 className="mb-6 font-semibold">Your subscription</h1>
      <div className="flex flex-col gap-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Monthly Usage</CardTitle>
              <CardDescription>
                {formatCompactNumber(pricingViewCount)} /{" "}
                {formatCompactNumber(tier.maxNumberOfVisits)} pricing page
                visits this month
              </CardDescription>
              <CardContent>
                <Progress
                  value={(pricingViewCount / tier.maxNumberOfVisits) * 100}
                />
              </CardContent>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Number of products</CardTitle>
              <CardDescription>
                {formatCompactNumber(productCount)} /{" "}
                {formatCompactNumber(tier.maxNumberOfProducts)} products created
              </CardDescription>
              <CardContent>
                <Progress
                  value={(productCount / tier.maxNumberOfProducts) * 100}
                />
              </CardContent>
            </CardHeader>
          </Card>
        </div>
        {tier != subscriptionTiers.Free && (
          <Card>
            <CardHeader>
              <CardTitle>You are currently on the {tier.name} plan</CardTitle>
              <CardDescription>
                if you would like to upgrade, cancel, or change your payment
                method use the button below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
              // action={createCustomerPortalSession}
              >
                <Button
                  variant={"accent"}
                  className="text-lg rounded-lg"
                  size={"lg"}
                >
                  Manage Subscription
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
      <div className="grid-cols-2 lg:grid-cols-4 grid gap-4 max-w-screen-xl mx-auto">
        {subscriptionTiersInOrder.map((t) => (
          <PricingCard key={t.name} currentTierName={tier.name} {...t} />
        ))}
      </div>
    </>
  );
};

export default SubscriptionPage;

function PricingCard({
  name,
  priceInCents,
  maxNumberOfVisits,
  maxNumberOfProducts,
  canRemoveBranding,
  canAccessAnalytics,
  canCustomizeBanner,
  currentTierName,
}: (typeof subscriptionTiersInOrder)[number] & { currentTierName: TierNames }) {
  const isCurrent = currentTierName === name;

  return (
    <Card className="shadow-none rounded-3xl overflow-hidden">
      <CardHeader>
        <div className="text-accent font-semibold mb-8">{name}</div>
        <CardTitle className="text-xl font-bold">
          ${priceInCents / 100} /mo
        </CardTitle>
        <CardDescription>
          {formatCompactNumber(maxNumberOfVisits)} pricing page visits/mo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
        //   action={
        //     name === "Free"
        //       ? createCancelSession
        //       : createCheckoutSession.bind(null, name)
        //   }
        >
          <Button
            disabled={isCurrent}
            className="text-lg w-full rounded-lg"
            size="lg"
          >
            {isCurrent ? "Current" : "Swap"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 items-start">
        <Feature className="font-bold">
          {maxNumberOfProducts}{" "}
          {maxNumberOfProducts === 1 ? "product" : "products"}
        </Feature>
        <Feature>PPP discounts</Feature>
        {canCustomizeBanner && <Feature>Banner customization</Feature>}
        {canAccessAnalytics && <Feature>Advanced analytics</Feature>}
        {canRemoveBranding && <Feature>Remove Easy PPP branding</Feature>}
      </CardFooter>
    </Card>
  );
}

function Feature({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <CheckIcon className="size-4 stroke-accent bg-accent/25 rounded-full p-0.5" />
      <span>{children}</span>
    </div>
  );
}
