import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductCustomizationForm from "./forms/ProductCustomizationForm";
import { getProductCustomization } from "@/server/db/products";
import { notFound } from "next/navigation";
import { canCustomizeBanner, canRemoveBranding } from "@/server/permission";

interface CustomizationTabsProps {
  productId: string;
  userId: string;
}
const CustomizationTabs = async ({
  productId,
  userId,
}: CustomizationTabsProps) => {
  const productCustomization = await getProductCustomization({
    productId,
    userId,
  });
  if (productCustomization == null) {
    return notFound();
  }
  const canRemove = await canRemoveBranding(userId);
  const cancustomizeBanner = await canCustomizeBanner(userId);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Banner customization</CardTitle>
      </CardHeader>
      <CardContent>
        <ProductCustomizationForm
          canRemoveBranding={canRemove}
          canCustomizeBanner={cancustomizeBanner}
          product={productCustomization}
        />
      </CardContent>
    </Card>
  );
};

export default CustomizationTabs;
