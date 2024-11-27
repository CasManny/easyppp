import BrandLogo from "@/components/BrandLogo";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

const links = [
  {
    label: "Products",
    href: "/products",
  },
  {
    label: "Analytics",
    href: "/analytics",
  },
  {
    label: "Subscription",
    href: "/subscription",
  },
];

const DashboardNavbar = () => {
  return (
    <header className="flex py-4 shadow bg-background">
      <nav className="flex items-center gap-10 container">
        <Link href={"/dashboard"} className="mr-auto">
          <BrandLogo />
        </Link>
        {links.map((link, index) => (
          <Link href={`/dashboard${link.href}`} key={index}>{link.label}</Link>
        ))}
        <UserButton />
      </nav>
    </header>
  );
};

export default DashboardNavbar;
