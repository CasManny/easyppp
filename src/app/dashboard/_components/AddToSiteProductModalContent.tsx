"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { env } from "@/data/env/client";
import { CopyCheck, CopyIcon, CopyXIcon } from "lucide-react";
import { useState } from "react";

type CopyState = "idle" | "copied" | "error";

const getCopyIcon = (copyState: CopyState) => {
  switch (copyState) {
    case "idle":
      return CopyIcon;
    case "copied":
      return CopyCheck;
    case "error":
      return CopyXIcon;
  }
};

const getChildren = (copyState: CopyState) => {
  switch (copyState) {
    case "idle":
      return "copy code";
    case "copied":
      return "copied!";
    case "error":
      return "Error";
  }
};

const AddToSiteProductModalContent = ({ id }: { id: string }) => {
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const code = `<script src="${env.NEXT_PUBLIC_SERVER_URL}/api/products/${id}/banner"></script>`;
  const Icon = getCopyIcon(copyState);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopyState("copied");
        setTimeout(() => setCopyState("idle"), 2000);
      })
      .catch(() => {
        setTimeout(() => setCopyState("idle"), 2000);
      });
  };
    
    

  return (
    <DialogContent className="max-w-max">
      <DialogHeader>
        <DialogTitle className="text-2xl">Start Earning PPP sales</DialogTitle>
        <DialogDescription>
          All you need to do is copy the below script into your site and your
          customers will start seeing PPP DISCOUNT
        </DialogDescription>
      </DialogHeader>
      <pre className="mb-4 overflow-x-auto p-4 bg-secondary rounded max-w-screen-xl text-secondary-foreground">
        <code>{code}</code>
      </pre>
      <div className="flex gap-2">
        <Button onClick={copyToClipboard}>
          {<Icon className="size-4 mr-2" />}
          {getChildren(copyState)}
        </Button>
      </div>
    </DialogContent>
  );
};

export default AddToSiteProductModalContent;
