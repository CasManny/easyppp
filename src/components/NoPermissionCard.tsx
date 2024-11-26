import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReactNode } from "react";
import { Button } from "./ui/button";
import Link from "next/link";

const NoPermissionCard = ({
  children = "You do no have permission to perform this action. Try upgrading your account to access this feature",
}: {
  children?: ReactNode;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Permission Denied</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{children}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link href={`/dashboard/subscription`}>Upgrade Account</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NoPermissionCard;
