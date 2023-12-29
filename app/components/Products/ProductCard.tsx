"use client";
import React from "react";
import Image from "next/image";
import { truncateText } from "@/utils/TruncateText";

interface ProductCardProps {
  data: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
  return (
    <div className="col-span-1 cursor-pointer border-[1.2px] border-slate-200 bg-slate-50 rounded-sm p-2 transition hover:scale-105 text-center text-sm">
      <div className=" flex flex-col items-center w-full gap-1 ">
        <div className="aspect-square overflow-hidden relative w-ful">
          <Image
            src={data.images[0].image}
            alt={data.name}
            fill
            className="w-full h-full object-contain "
          />
        </div>
        <div className="mt-4">{truncateText(data.name)}</div>
        <div>rating</div>
        <div>review</div>
        <div>price</div>
      </div>
    </div>
  );
};

export default ProductCard;