import React from "react";
import { Avatar } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { formatPrice } from "@/lib/formatPrice";
import UpdateStatus from "./UpdateStatus";
import DeleteMaintenance from "./DeleteMaintenance";

interface IRoom {
  id: string;
  roomNumber: string;
  floor: number;
  images: { imageUrl: string }[];
}

interface IMaintenance {
  id: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  cost: string;
  notes: string;
  room: IRoom;
}

interface TableMaintenanceProps {
  maintenance: IMaintenance[];
}
export function getMaintenanceStatusText(status: string): string {
  switch (status) {
    case "SCHEDULED":
      return "Đã lên lịch";
    case "  ":
      return "Đang thực hiện";
    case "COMPLETED":
      return "Đã hoàn thành";
    case "CANCELLED":
      return "Đã hủy";
    default:
      return "Không xác định";
  }
}

const TableMaintenance = ({ maintenance }: TableMaintenanceProps) => {
  return (
    <Table className="w-full border">
      <TableHeader>
        <TableRow>
          <TableHead> Ảnh Phòng</TableHead>
          <TableHead>Số Phòng</TableHead>
          <TableHead>Mô Tả</TableHead>
          <TableHead>Ngày Bắt Đầu</TableHead>
          <TableHead>Ngày Kết Thúc</TableHead>
          <TableHead className="text-start">Trạng Thái</TableHead>
          <TableHead>Chi Phí</TableHead>
          <TableHead>Ghi Chú</TableHead>
          <TableHead>Hành Động</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {maintenance && maintenance.length > 0 ? (
          maintenance.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Avatar className="w-16 h-16">
                  <Image
                    width={500}
                    height={500}
                    priority
                    src={item.room.images[0]?.imageUrl}
                    alt={`Phòng ${item.room.roomNumber}`}
                    className=" rounded-full object-cover"
                  />
                </Avatar>
              </TableCell>
              <TableCell>{item.room.roomNumber}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>
                {new Date(item.startDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(item.endDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <UpdateStatus status={item.status} id={item.id} />
              </TableCell>
              <TableCell>{formatPrice(Number(item.cost))}</TableCell>
              <TableCell>{item.notes}</TableCell>
              <TableCell>
                <DeleteMaintenance id={item.id} />
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={9} className="text-center">
              Không có dữ liệu
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default TableMaintenance;
