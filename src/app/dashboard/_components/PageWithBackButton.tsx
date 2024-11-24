import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface PageWithBackButtonProps {
  backButtonHref: string;
  pageTitle: string;
  children: ReactNode;
}
const PageWithBackButton = ({
  backButtonHref,
  pageTitle,
  children,
}: PageWithBackButtonProps) => {
  return (
    <div className="grid grid-cols-[auto, 1fr] gap-x-4 gap-y-8">
      <Button
        asChild
        className="rounded-full"
        variant={"outline"}
        size={"icon"}
      >
        <Link href={backButtonHref}>
          <div className="sr-only">Back</div>
          <ChevronLeft className="size-8" />
        </Link>
      </Button>
      <h1 className="text-2xl font-semibold self-center">{pageTitle}</h1>
      <div className="col-start-2">{children}</div>
    </div>
  );
};

export default PageWithBackButton;
