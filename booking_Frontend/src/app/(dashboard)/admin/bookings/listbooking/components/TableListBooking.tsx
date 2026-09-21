"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/formatPrice";
import React, { useState } from "react";
import UpdateStatus from "./UpdateStatus";
import { FilterDropdown } from "./FilterDropdown";
import { ArrowDown, ArrowDownUp, ArrowUp, Phone } from "lucide-react";
import {
  translatepaymentMethodDisplayNames,
  translatePaymentStatus,
  translateStatus,
} from "@/lib/translate";
import { IBookingRecord } from "./bookingad";
import { formatDate } from "@/lib/formatDate";

interface BookingProps {
  booking: IBookingRecord[];
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  order: "default" | "asc" | "desc";
  setOrder: (value: "default" | "asc" | "desc") => void;
}

const TableListBooking = ({
  booking,
  selectedStatus,
  setSelectedStatus,
  order,
  setOrder,
}: BookingProps) => {
  const [filterOpen, setFilterOpen] = useState(false);

  const statusOptions = [
    { value: "PENDING", label: "Đang chờ" },
    { value: "CHECKED_IN", label: "Đã nhận phòng" },
    { value: "CHECKED_OUT", label: "Đã trả phòng" },
    { value: "CANCELLED", label: "Đã hủy" },
  ];
  const handleToggleOrder = () => {
    if (order === "default") setOrder("asc");
    else if (order === "asc") setOrder("desc");
    else setOrder("default"); // cycles back to default
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-x-auto">
      <Table className="w-full divide-y divide-gray-200">
        <TableHeader>
          <TableRow>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Mã đặt phòng
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Khách hàng
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Loại Phòng
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ngày nhận phòng{"_ "}Ngày trả phòng
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1">
              Tổng tiền
              {order === "asc" ? (
                <ArrowUp
                  onClick={handleToggleOrder}
                  className="hover:cursor-pointer h-5 w-5"
                />
              ) : order === "desc" ? (
                <ArrowDown
                  onClick={handleToggleOrder}
                  className="hover:cursor-pointer h-5 w-5"
                />
              ) : (
                <ArrowDownUp
                  onClick={handleToggleOrder}
                  className="hover:cursor-pointer h-5 w-5"
                />
              )}
            </TableHead>
            <TableHead className="relative px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <FilterDropdown
                filterOpen={filterOpen}
                label="Trạng Thái Phòng"
                onChange={setSelectedStatus}
                selected={selectedStatus}
                setFilterOpen={setFilterOpen}
                options={statusOptions}
              />
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thanh Toán
            </TableHead>
            <TableHead className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Phương thức
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hành động
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white divide-y divide-gray-200">
          {booking && booking.length > 0 ? (
            booking?.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 *:flex items-center gap-2">
                  #{booking.id.replace(/-/g, "").slice(0, 8).toUpperCase()}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap ">
                  <p>
                    {booking.customer.user.firstName}
                    {booking.customer.user.lastName}
                  </p>
                  <p className="flex gap-0.5 items-center">
                    <Phone size={15} className="text-green-500" />
                    {booking.customer.user.phone}
                  </p>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {booking.bookingItems.map((item, index) => (
                    <p key={index}>
                      {item.room.roomType.name}{" "}
                      <span>-P{item.room.roomNumber}</span>
                    </p>
                  ))}
                </TableCell>

                <TableCell className="px-6 py-7 whitespace-nowrap text-sm text-gray-900 flex items-center gap-20  justify-center">
                  <p className="text-right ">
                    {" "}
                    {formatDate(booking.checkInDate)}
                  </p>
                  <p className="text-left">
                    {formatDate(booking.checkOutDate)}
                  </p>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatPrice(Number(booking.totalAmount))}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      booking.status === "CHECKED_OUT"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "CHECKED_IN"
                          ? "bg-blue-100 text-blue-800"
                          : booking.status === "CANCELLED"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {translateStatus(booking.status)}
                  </span>
                </TableCell>

                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      booking.payments[0]?.status === "COMPLETED"
                        ? "bg-green-100 text-green-800"
                        : booking.payments[0]?.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {translatePaymentStatus(booking.payments[0]?.status) ||
                      "N/A"}
                  </span>
                </td>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span
                    className={` py-1 text-xs px-2 flex justify-center rounded-3xl text-white font-bold ${
                      booking.payments[0]?.paymentMethod === "CASH"
                        ? "bg-blue-400  "
                        : "bg-green-500 "
                    }`}
                  >
                    {booking?.payments[0]?.paymentMethod
                      ? translatepaymentMethodDisplayNames[
                          booking?.payments[0]?.paymentMethod
                        ]
                      : "N/A"}
                  </span>
                </TableCell>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <UpdateStatus booking={booking} />
                </td>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                className="text-center text-gray-600 py-20"
                colSpan={9}
              >
                Không có đặt phòng nào khớp với bộ lọc
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableListBooking;
