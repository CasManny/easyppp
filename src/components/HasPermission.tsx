import { auth } from "@clerk/nextjs/server";
import NoPermissionCard from "./NoPermissionCard";

interface HasPermissionProps {
  permission: (userId: string) => Promise<boolean>;
  renderFallback?: boolean;
  fallbackText: string;
  children: React.ReactNode;
}
const HasPermission = async ({
  permission,
  renderFallback = false,
  fallbackText,
  children,
}: HasPermissionProps) => {
  const { userId } = await auth();
  const hasPermission = await permission(userId!);
  if (hasPermission) {
    return <div className="">{children}</div>;
  }

  if (renderFallback) {
    return <NoPermissionCard>{fallbackText}</NoPermissionCard>;
  }
  return null;
};

export default HasPermission;
