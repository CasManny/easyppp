import PageWithBackButton from "@/app/dashboard/_components/PageWithBackButton";
import { getProduct } from "@/server/db/products";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DetailsTab from "@/app/dashboard/_components/DetailsTab";
import CountryTab from "@/app/dashboard/_components/CountryTab";
import CustomizationTabs from "@/app/dashboard/_components/CustomizationTabs";

interface ProductEditPageProps {
  params: { productId: string };
  searchParams: { tab?: string };
}

const ProductEditPage = async ({
  params,
  searchParams,
}: ProductEditPageProps) => {
  const { userId, redirectToSignIn } = await auth();
  if (userId == null) {
    return redirectToSignIn();
  }
  const product = await getProduct({ id: params.productId, userId });
  if (product == null) {
    return notFound();
  }
  return (
    <PageWithBackButton
      backButtonHref="/dashboard/products"
      pageTitle="Edit product"
    >
      <Tabs defaultValue={searchParams.tab} className="w-full">
        <TabsList className="bg-background/60">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="country">Country</TabsTrigger>
          <TabsTrigger value="customization">custimization</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="w-full">
          <DetailsTab product={product} />
        </TabsContent>
        <TabsContent value="country" className="w-full">
          <CountryTab productId={product.id} userId={userId} />
        </TabsContent>
        <TabsContent value="customization" className="w-full">
          <CustomizationTabs />
        </TabsContent>
      </Tabs>
    </PageWithBackButton>
  );
};

export default ProductEditPage;
