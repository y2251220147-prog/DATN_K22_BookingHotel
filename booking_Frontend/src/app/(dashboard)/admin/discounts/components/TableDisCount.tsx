"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IDiscount } from "../page";
import DeleteDisCount from "./DeleteDisCount";
import { formatDate } from "@/lib/formatDate";
import UpdateDisCount from "./UpdateDisCount";
import { is } from "date-fns/locale";

interface TableDiscountProps {
  discounts: IDiscount[];
  isLoading?: boolean;
  setStatusFilter?: React.Dispatch<
    React.SetStateAction<"" | "EXPIRED" | "ACTIVE">
  >;
  statusFilter?: "" | "EXPIRED" | "ACTIVE";
}

const TableDiscount = ({
  discounts,
  isLoading,
  setStatusFilter,
  statusFilter,
}: TableDiscountProps) => {
  const getDiscountStatus = (validTo: string | Date) => {
    return new Date(validTo) < new Date() ? "EXPIRED" : "ACTIVE";
  };
  const filteredData = discounts?.filter((discount) => {
    if (statusFilter === "") return true;

    return getDiscountStatus(discount.validTo) === statusFilter;
  });
  return (
    <div className="rounded-2xl">
      <Table className=" border ">
        <TableHeader>
          <TableRow>
            <TableHead>Mã Giảm Giá</TableHead>
            <TableHead>Phần Trăm(%)</TableHead>
            <TableHead>Ngày Bắt Đầu</TableHead>
            <TableHead>Ngày Kết Thúc</TableHead>
            <TableHead className="text-right">Trạng Thái</TableHead>
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Đang Tải Dữ Liệu...
              </TableCell>
            </TableRow>
          ) : (
            filteredData?.map((discount) => (
              <TableRow key={discount.id}>
                <TableCell className="font-medium">{discount.code}</TableCell>
                <TableCell>{discount.percentage}%</TableCell>
                <TableCell>{formatDate(discount.validFrom)}</TableCell>
                <TableCell>{formatDate(discount.validTo)} </TableCell>
                <TableCell className="text-right">
                  {getDiscountStatus(discount.validTo) === "EXPIRED" ? (
                    <span className="ml-2 inline-block px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                      Hết hạn
                    </span>
                  ) : (
                    <span className="ml-2 inline-block px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                      Còn hạn
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <UpdateDisCount discounts={discount} />
                    <DeleteDisCount id={discount.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableDiscount;
