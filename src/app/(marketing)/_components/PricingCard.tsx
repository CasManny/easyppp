import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, formatCompactNumber } from "@/lib/utils";
import { SignUpButton } from "@clerk/nextjs";
import { Check } from "lucide-react";
import { ReactNode } from "react";

interface PricingCardProps {
  tire: {
    name: string;
    priceInCents: number;
    maxNumberOfProducts: number;
    maxNumberOfVisits: number;
    canAccessAnalytics: boolean;
    canCustomizeBanner: boolean;
    canRemoveBranding: boolean;
  };
}

const PricingCard = ({ tire }: PricingCardProps) => {
  const {
    priceInCents,
    maxNumberOfProducts,
    maxNumberOfVisits,
    canAccessAnalytics,
    canCustomizeBanner,
    canRemoveBranding,
    name,
  } = tire;

  const mostPopular = name === "Standard";
  return (
    <Card>
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
        <SignUpButton>
          <Button
            variant={mostPopular ? "accent" : "default"}
            className="text-xl w-full rounded-lg"
          >
            Get Started
          </Button>
        </SignUpButton>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
        <Feature className="font-bold">
          {maxNumberOfProducts}{" "}
          {maxNumberOfProducts === 1 ? "product" : "products"}
        </Feature>
        <Feature>PPP Discounts</Feature>
        {canCustomizeBanner && <Feature>Banner customization</Feature>}
        {canAccessAnalytics && <Feature>Advanced Analytics</Feature>}
        {canRemoveBranding && <Feature>Remove EasyPPP Branding</Feature>}
      </CardFooter>
    </Card>
  );
};

export default PricingCard;

function Feature({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Check className="size-4 stroke-accent bg-accent/25 rounded-full p-0.5" />
      <span>{children}</span>
    </div>
  );
}
