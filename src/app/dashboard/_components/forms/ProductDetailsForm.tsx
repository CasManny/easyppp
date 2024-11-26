"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { productDetailSchema } from "@/schema/products";
import { createProduct, updateProduct } from "@/server/actions/products";
import { ProductTable } from "@/drizzle/schema";
import RequiredLabelIcon from "@/components/RequiredLabelIcon";

interface ProductDetailsFormProps {
  product?: typeof ProductTable.$inferSelect;
}

const ProductDetailsForm = ({ product }: ProductDetailsFormProps) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof productDetailSchema>>({
    resolver: zodResolver(productDetailSchema),
    defaultValues: product
      ? { ...product, description: product.description ?? "" }
      : {
          name: "",
          description: "",
          url: "",
        },
  });

  async function onSubmit(values: z.infer<typeof productDetailSchema>) {
    const action =
      product == null
        ? createProduct
        : updateProduct.bind(null, { id: product.id });
    const data = await action(values);
    if (data?.message) {
      toast({
        title: data?.error ? "Error" : "success",
        description: data?.message,
        variant: data?.error ? "destructive" : "default",
      });
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 w-full">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Product name <RequiredLabelIcon /> </FormLabel>
                <FormControl className="w-full">
                  <Input placeholder="" {...field} className="" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Enter your website Url <RequiredLabelIcon /> </FormLabel>
                <FormControl className="w-full">
                  <Input placeholder="url" {...field} className="" />
                </FormControl>
                <FormDescription>
                  Include the protocol (http/https) and the full path to the
                  sales page
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product description</FormLabel>
              <FormControl>
                <Textarea className="min-h-20 resize-none" {...field} />
              </FormControl>
              <FormDescription>
                An optional description to help distinguish your product from
                other product
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="self-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductDetailsForm;
