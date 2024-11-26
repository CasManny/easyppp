import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductTable } from "@/drizzle/schema";
import ProductDetailsForm from "./forms/ProductDetailsForm";

interface DetailsTabProps {
  product: typeof ProductTable.$inferSelect;
}

const DetailsTab = ({ product }: DetailsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Product Details</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <ProductDetailsForm product={product} />
      </CardContent>
    </Card>
  );
};

export default DetailsTab;
