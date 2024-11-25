import React from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";
import { ProductTable } from "@/drizzle/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import AddToSiteProductModalContent from "../AddToSiteProductModalContent";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import DeleteProductAlertDialogContent from "../DeleteProductAlertDialogContent";
interface ProductGridProps {
  products: (typeof ProductTable.$inferSelect)[];
}

const ProductCard = ({
  id,
  name,
  url,
  description,
}: {
  id: string;
  name: string;
  url: string;
  description?: string;
}) => (
  <Card>
    <CardHeader>
      <div className="flex gap-2 justify-between items-end">
        <CardTitle>
          <Link href={`/dashboard/products/${id}/edit?tab`}>{name}</Link>
        </CardTitle>

        <Dialog>
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"outline"} className="size-8 p-0">
                  <div className="sr-only">Action menu</div>
                  <DotsHorizontalIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/products/${id}/edits`}>Edit</Link>
                </DropdownMenuItem>
                <DialogTrigger asChild>
                  <DropdownMenuItem>Add to site</DropdownMenuItem>
                </DialogTrigger>
                <DropdownMenuSeparator />
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
              <AddToSiteProductModalContent id={id} />
              <DeleteProductAlertDialogContent id={id} />
            </DropdownMenu>
          </AlertDialog>
        </Dialog>
      </div>
      <CardDescription>{url}</CardDescription>
    </CardHeader>
    {description && <CardContent>{description}</CardContent>}
  </Card>
);

const ProductGrid = ({ products }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map(({ id, name, url, description }) => (
        <ProductCard
          key={id}
          id={id}
          name={name}
          url={url}
          description={description!}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
