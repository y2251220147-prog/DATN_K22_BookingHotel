"use client";

import { Card } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { SeasonalRate } from "./types";
import { formatPrice } from "@/lib/formatPrice";
import DeleteSeasonal from "./DeleteSeasonal";
import UpdateSeasonal from "./UpdateSeasonal";

interface SeasonalRatesManagerProps {
  initialData: SeasonalRate[];
}

export function SeasonalRatesManager({
  initialData = [],
}: SeasonalRatesManagerProps) {
  return (
    <div className="w-full space-y-6">
      <Card className="overflow-hidden">
        <div className="overflow-x-auto ">
          <Table>
            <TableHeader className="border ">
              <TableRow>
                <TableHead className="font-semibold">Tên Mùa</TableHead>
                <TableHead className="font-semibold">Số Phòng</TableHead>
                <TableHead className="font-semibold">Ngày Bắt Đầu</TableHead>
                <TableHead className="font-semibold">Ngày Kết Thúc</TableHead>
                <TableHead className="font-semibold">Hệ Số</TableHead>
                <TableHead className="font-semibold">Giá Cơ Bản</TableHead>
                <TableHead className="font-semibold">Giá Điều Chỉnh</TableHead>
                <TableHead className="font-semibold">Trạng Thái</TableHead>
                <TableHead className="font-semibold text-right">
                  Hành Động
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Chưa có dữ liệu. Hãy thêm mục giá mùa mới.
                  </TableCell>
                </TableRow>
              ) : (
                initialData.map((rate) => (
                  <TableRow key={rate.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {rate.seasonName}
                    </TableCell>
                    <TableCell>{rate.room.roomNumber}</TableCell>
                    <TableCell>
                      {new Date(rate.startDate).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell>
                      {new Date(rate.endDate).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{rate.multiplier}x</Badge>
                    </TableCell>
                    <TableCell>
                      {formatPrice(rate.room.originalPrice)}
                    </TableCell>
                    <TableCell className="font-semibold text-primary">
                      {formatPrice(rate.room.originalPrice * rate.multiplier)}
                    </TableCell>
                    <TableCell>
                      <button className="inline-flex items-center gap-1">
                        {rate.isActive ? (
                          <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30">
                            <Check className="w-3 h-3 mr-1" />
                            Hoạt Động
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className=" text-white">
                            Không Hoạt Động
                          </Badge>
                        )}
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <UpdateSeasonal rate={rate} />

                        <DeleteSeasonal id={rate.id} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {initialData.length > 0 && (
        <Card className="p-4 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Tổng Số Mục</p>
              <p className="text-2xl font-bold text-foreground">
                {initialData.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Đang Hoạt Động</p>
              <p className="text-2xl font-bold text-green-600">
                {initialData.filter((r) => r.isActive).length}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Không Hoạt Động</p>
              <p className="text-2xl font-bold text-red-600">
                {initialData.filter((r) => !r.isActive).length}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
