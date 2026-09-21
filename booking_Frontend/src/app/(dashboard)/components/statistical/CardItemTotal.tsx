import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CardItemTotalProps {
  title: string;
  total: number | string;
  description?: string;
  className?: string;
  image?: string;
}
const CardItemTotal: React.FC<CardItemTotalProps> = ({
  title,
  total,
  description,
  className,
  image,
}) => {
  return (
    <Card className={cn("border-t-8 border-t-primary", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
        <CardTitle className="text-sm font-medium text-card-foreground">
          {title}{" "}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <div className="w-[50px] h-[50px] relative">
          <Image
            src={image || "/images/defaultIcon.png"}
            alt="doanh thu"
            fill
            className="object-contain rounded"
          />
        </div>
        <div className="text-2xl font-bold  ">
          <p className="text-center"> {total}</p>
          <p className="text-xs ">{description} </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardItemTotal;
