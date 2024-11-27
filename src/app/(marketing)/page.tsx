import { Button } from "@/components/ui/button";
import { SignUpButton } from "@clerk/nextjs";
import { ArrowRight, ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import { NeonIcon } from "./_icons/Neon";
import Link from "next/link";
import { ClerkIcon } from "./_icons/Clerk";
import { subscriptionTiersInOrder } from "@/data/subscription";
import PricingCard from "./_components/PricingCard";
import BrandLogo from "@/components/BrandLogo";
import { footerLinks } from "@/data/footerLinks";
import FooterLinkGroup from "./_components/FooterLinkGroup";

export default function Home() {
  return (
    <>
      <section className="min-h-screen flex items-center justify-center text-balance flex-col gap-8 px-4 bg-[radial-gradient(hsl(0,72%,65%,40%),hsl(24,62%,73%,40%),hsl(var(--background))_60%)]">
        <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight m-4">
          Price Smarter, Sell bigger!
        </h1>
        <p className="text-lg lg:text-3xl max-w-screen-xl text-center">
          Optimize your product pricing across countries to maximize sales.
          Capture 85% of the untapped market with location based dynamic pricing
        </p>
        <SignUpButton>
          <Button className="text-lg p-6 rounded-xl flex gap-2">
            Get started for free <ArrowRightIcon className="size-5" />
          </Button>
        </SignUpButton>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="container py-16 flex flex-col gap-16 px-8 md:px-16">
          <h2 className="text-3xl text-center text-balance font-semibold">
            Trusted by the top modern company
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-16">
            <Link href={"https://neon.tech"}>
              <NeonIcon />
            </Link>
            <Link href={"https://clerk.icon"}>
              <ClerkIcon />
            </Link>
            <Link href={"https://neon.tech"}>
              <NeonIcon />
            </Link>
            <Link href={"https://clerk.icon"}>
              <ClerkIcon />
            </Link>
            <Link href={"https://neon.tech"}>
              <NeonIcon />
            </Link>
            <Link href={"https://clerk.icon"}>
              <ClerkIcon />
            </Link>
            <Link href={"https://neon.tech"}>
              <NeonIcon />
            </Link>
            <Link href={"https://clerk.icon"}>
              <ClerkIcon />
            </Link>
            <Link href={"https://neon.tech"}>
              <NeonIcon />
            </Link>
            <Link href={"https://clerk.icon"} className="md:max-xl:hidden">
              <ClerkIcon />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-8 py-16 bg-accent/5" id="pricing">
        <h4 className="text-4xl text-center text-balance font-semibold mb-8">
          Pricing software which pays for itself 20x over
        </h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-screen-xl mx-auto">
          {subscriptionTiersInOrder.map((tier) => (
            <PricingCard key={tier.name} tier={tier} />
          ))}
        </div>
      </section>

      <footer className="container pt-16 pb-8 flex flex-col sm:flex-row gap-8 sm:gap-4 justify-between items-start">
        <Link href={"/"}>
          <BrandLogo />
        </Link>
        <div className="flex flex-col sm:flex-row">
          <div className="flex flex-col gap-8 sm:flex-row">
            {footerLinks.map((group, index) => (
              <FooterLinkGroup  key={index} group={group}/>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
