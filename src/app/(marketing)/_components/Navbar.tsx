import BrandLogo from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

const headerLinks = [
  {
    label: "Features",
    path: "#",
  },
  {
    label: "Pricing",
    path: "/#pricing",
  },
  {
    label: "About",
    path: "#",
  },
];

const Navbar = () => {
  return (
    <header className="flex py-6 shadow-lg fixed top-0 w-full z-10 bg-background/95">
      <nav className="flex items-center gap-10 container font-semibold">
        <Link href={"/"} className="mr-auto">
          <BrandLogo />
        </Link>
        <div className="flex gap-10 items-center text-lg">
          {headerLinks.map((link, index) => (
            <Link href={link.path} key={index}>
              {link.label}
            </Link>
          ))}
        </div>
        <span className="text-lg">
          <SignedIn>
            <Link href={"/dashboard"}>Dashboard</Link>
          </SignedIn>
          <SignedOut>
            <Button asChild>
              <Link href={"/sign-in"}>Login</Link>
            </Button>
          </SignedOut>
        </span>
      </nav>
    </header>
  );
};

export default Navbar;
