import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { NextRequest } from "next/server";

export const Get = async (
  request: NextRequest,
  { params }: { params: { productId: string } }
) => {
  const headersMap = headers();
  const requestUrl =
    (await headersMap).get("referer") || (await headersMap).get("origin");
  if (requestUrl == null) {
    return notFound();
  }

};








