"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Switch } from "@/components/ui/switch";

import { ProductCustomizationTable } from "@/drizzle/schema";
import { productCustomizationSchema } from "@/schema/products";
import RequiredLabelIcon from "@/components/RequiredLabelIcon";
import { Textarea } from "@/components/ui/textarea";
import Banner from "../Banner";
import { updateProductCustomization } from "@/server/actions/products";
import { useToast } from "@/hooks/use-toast";
import NoPermissionCard from "@/components/NoPermissionCard";

interface ProductCustomizationFormProps {
  product: typeof ProductCustomizationTable.$inferSelect | undefined | null;
  canRemoveBranding: boolean;
  canCustomizeBanner: boolean;
}

const ProductCustomizationForm = ({
  product,
  canCustomizeBanner,
  canRemoveBranding,
}: ProductCustomizationFormProps) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof productCustomizationSchema>>({
    resolver: zodResolver(productCustomizationSchema),
    defaultValues: {
      classPrefix: product?.classPrefix ?? "",
      backgroundColor: product?.backgroundColor ?? "",
      textColor: product?.textColor ?? "",
      fontSize: product?.fontSize ?? "",
      locationMessage: product?.locationMessage ?? "",
      bannerContainer: product?.bannerContainer ?? "",
      isSticky: product?.isSticky ?? false,
    },
  });

  async function onSubmit(values: z.infer<typeof productCustomizationSchema>) {
    const data = await updateProductCustomization(product?.id!, values);
    if (data.message) {
      toast({
        title: data.error ? "Error" : "Success",
        description: data.message,
        variant: data.error ? "destructive" : "default",
      });
    }
  }

  const formValues = form.watch();
  return (
    <>
      <div>
        <Banner
          message={formValues.locationMessage}
          mappings={{
            country: "India",
            coupon: "HALF-OFF",
            discount: "50",
          }}
          customization={formValues}
          canRemoveBranding={canRemoveBranding}
        />
      </div>
      {!canCustomizeBanner && (
        <div className="mt-8">
          <NoPermissionCard />
        </div>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex gap-6 flex-col mt-8"
        >
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
            <FormField
              control={form.control}
              name="locationMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    PPP Discount message <RequiredLabelIcon />
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={canCustomizeBanner}
                      {...field}
                      className="min-h-20 resize-none"
                    />
                  </FormControl>
                  <FormDescription>
                    {"Data parameters: {country}, {coupon}, {discount}"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="backgroundColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Background color <RequiredLabelIcon />
                    </FormLabel>
                    <FormControl>
                      <Input disabled={!canCustomizeBanner} {...field} />
                    </FormControl>
                    <FormDescription>
                      {"Data parameters: {country}, {coupon}, {discount}"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="textColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Text color <RequiredLabelIcon />
                    </FormLabel>
                    <FormControl>
                      <Input disabled={!canCustomizeBanner} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fontSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      font size <RequiredLabelIcon />
                    </FormLabel>
                    <FormControl>
                      <Input disabled={!canCustomizeBanner} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isSticky"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Sticky <RequiredLabelIcon />
                    </FormLabel>
                    <FormControl>
                      <Switch
                        className="block"
                        disabled={!canCustomizeBanner}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bannerContainer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Banner container <RequiredLabelIcon />
                    </FormLabel>
                    <FormControl>
                      <Input disabled={!canCustomizeBanner} {...field} />
                    </FormControl>
                    <FormDescription>
                      HTML container selector where you want to place the
                      banner. EX: #container, .container, body
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="classPrefix"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      CSS Prefix <RequiredLabelIcon />
                    </FormLabel>
                    <FormControl>
                      <Input disabled={!canCustomizeBanner} {...field} />
                    </FormControl>
                    <FormDescription>
                      An optional prefix added to all CSS classes to avoid
                      conflicts
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {canCustomizeBanner && (
            <div className="self-end">
              <Button type="submit">save</Button>
            </div>
          )}
        </form>
      </Form>
    </>
  );
};

export default ProductCustomizationForm;
