import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CountryDiscountForm from "./forms/CountryDiscountForm";
import { getProductCountryGroups } from "@/server/db/products";

interface CountryTabProps {
  productId: string;
  userId: string;
}

const CountryTab = async ({ productId, userId }: CountryTabProps) => {
  const countryGroups = await getProductCountryGroups({ productId, userId });
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Country Discount</CardTitle>
        <CardDescription>
          Leave the discount field blank if you do not want to display deals for
          any specific parity deals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CountryDiscountForm
          productId={productId}
          countryGroups={countryGroups}
        />
      </CardContent>
    </Card>
  );
};

export default CountryTab;
