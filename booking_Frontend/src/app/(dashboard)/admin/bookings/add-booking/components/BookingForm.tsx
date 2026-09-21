/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import React, { useEffect, useMemo, useState } from "react";
import { CustomerForm } from "../page";
import useSWR from "swr";
import FormPaymentBooking from "./FormPaymentBooking";
import toast from "react-hot-toast";
import { getExcludeDates, getHighlightedDates } from "@/lib/formatDate";
import { ShowCurrentPrice } from "@/lib/showCurrentPrice";

interface IProvide {
  code: number;
  name: string;
}

export interface BookingFormData {
  customerId: string;
  checkInDate: Date | null;
  checkOutDate: Date | null;
  totalGuests: number;
  bookingSource: "DIRECT";
  specialRequests: string;
  discountCode: string;
  pricePerNight: number;
  roomId: string;
  totalAmount: number;
}

interface Room {
  id: string;
  roomNumber: string;
  floor: number;
  status: string;
  originalPrice: number;
  roomType: { name: string; maxOccupancy: number };
}

const fetcher = (url: string) =>
  fetch(url, { credentials: "omit" }).then((res) => res.json());

interface IBookingForm {
  formCustomer: CustomerForm;
  setFormCustomer: React.Dispatch<React.SetStateAction<CustomerForm>>;
}
export default function BookingForm({
  formCustomer,
  setFormCustomer,
}: IBookingForm) {
  const [isOpen, setIsOpen] = useState(false);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [highlightedDates, setHighlightedDates] = useState<
    { [className: string]: Date[] }[]
  >([]);

  const [booking, setBooking] = useState<BookingFormData>({
    customerId: "",
    checkInDate: null,
    checkOutDate: null,
    totalGuests: 1,
    bookingSource: "DIRECT",
    specialRequests: "",
    discountCode: "",
    pricePerNight: 0,
    roomId: "",
    totalAmount: 0,
  });

  const [seasonPrice, setSeasonPrice] = useState({
    total: 0,
    currentPrice: 0,
    originalPrice: 0,
    displayPrice: 0,
  });
  // hafm tinhs gia
  useEffect(() => {
    async function fetchPrice() {
      const price = await ShowCurrentPrice({
        bookingStart: booking.checkInDate,
        bookingEnd: booking.checkOutDate,
        roomId: booking.roomId,
      });
      setSeasonPrice(price);
      setBooking((prev) => ({
        ...prev,
        pricePerNight: Number(price.displayPrice || 0),
        totalAmount: Number(price.total || 0),
      }));
    }
    if (booking.roomId) {
      fetchPrice();
    }
  }, [booking.checkInDate, booking.checkOutDate, booking.roomId]);
  const handleComplete = () => {
    if (
      !booking.checkInDate ||
      !booking.checkOutDate ||
      !booking.pricePerNight ||
      !formCustomer.lastName
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin trước khi thanh toán!");
      return;
    }
    setIsOpen(true);
  };
  const { data: dataProvide } = useSWR<IProvide[]>(
    `https://provinces.open-api.vn/api/v1/p`,
    fetcher,
  );
  const { data: dataDate } = useSWR(
    `/api/room/${booking.roomId ? booking.roomId : null}/booked-dates`,
  );

  const { data: dataSelectRoom } = useSWR(`/api/room?limit=9999`);

  useEffect(() => {
    if (dataDate) {
      setHighlightedDates(getHighlightedDates(dataDate));
      setBookedDates(getExcludeDates(dataDate));
    }
  }, [dataDate]);

  const rooms = useMemo(() => {
    return (dataSelectRoom?.room?.data as Room[]) || [];
  }, [dataSelectRoom]); //handlechang

  const handlechange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setBooking((prev) => ({
      ...prev,
      [name]:
        name === "totalGuests" ||
        name === "totalAmount" ||
        name === "pricePerNight"
          ? Number(value)
          : value,
    }));
  };

  const handleDateChange = (
    name: "checkInDate" | "checkOutDate",
    date: Date | null,
  ) => {
    setBooking((prev) => ({
      ...prev,
      [name]: date ? date.toISOString() : "",
    }));
  };

  useEffect(() => {
    if (formCustomer.id) {
      setBooking((prev) => ({
        ...prev,
        customerId: formCustomer.id,
      }));
    }
  }, [formCustomer.id]);

  return (
    <>
      <div className=" w-full">
        <form className="space-y-6">
          {/* First Row - Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="firstName"
                className="text-sm font-medium text-gray-700"
              >
                Họ*
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder=""
                className="text-sm font-medium text-gray-700 py-7"
                required
                value={formCustomer.firstName || ""}
                onChange={(e) =>
                  setFormCustomer((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="lastName"
                className="text-sm font-medium text-gray-700"
              >
                Tên*
              </Label>
              <Input
                id="lastName"
                type="text"
                className="text-sm font-medium text-gray-700 py-7"
                value={formCustomer.lastName || ""}
                onChange={(e) =>
                  setFormCustomer((prev) => ({
                    ...prev,
                    lastName: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          {/* Second Row - Email and Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email*
              </Label>
              <Input
                id="email"
                type="email"
                className="text-sm font-medium text-gray-700 py-7"
                required
                value={formCustomer?.email || ""}
                onChange={(e) =>
                  setFormCustomer((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="mobile"
                className="text-sm font-medium text-gray-700"
              >
                Điện Thoại*
              </Label>
              <Input
                id="mobile"
                type="text"
                className="text-sm font-medium text-gray-700 py-7"
                required
                value={formCustomer.phone || ""}
                onChange={(e) =>
                  setFormCustomer((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          {/* Third Row - Mobile and City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="totalPerson"
                className="text-sm font-medium text-gray-700"
              >
                CCCD*
              </Label>
              <Input
                id="totalPerson"
                type="number"
                min="1"
                className="text-sm font-medium text-gray-700 py-7"
                required
                value={formCustomer?.idNumber || ""}
                onChange={(e) =>
                  setFormCustomer((prev) => ({
                    ...prev,
                    idNumber: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2 w-full">
              <Label
                htmlFor="roomType"
                className="text-sm font-medium text-gray-700"
              >
                Vui Lòng Chọn Thành Phố*
              </Label>
              <Select
                value={formCustomer.city}
                onValueChange={(val) =>
                  setFormCustomer((prev) => ({ ...prev, city: val }))
                }
              >
                <SelectTrigger className="w-full text-sm font-medium text-gray-700 py-7">
                  <SelectValue placeholder="chọn Thành Phố" />
                </SelectTrigger>
                <SelectContent>
                  {dataProvide?.map((item) => (
                    <SelectItem key={item.code} value={item.name.toString()}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Address Field */}
          <div className="space-y-2">
            <Label
              htmlFor="address"
              className="text-sm font-medium text-gray-700"
            >
              Địa Chỉ*
            </Label>
            <Textarea
              id="address"
              rows={3}
              className="border-gray-300 resize-none "
              placeholder="nhập địa chỉ"
              value={formCustomer?.address}
              onChange={(e) =>
                setFormCustomer((prev) => ({
                  ...prev,
                  address: e.target.value,
                }))
              }
            />
          </div>
          {/* Fifth Row - Total Person and Room Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 w-full">
              <Label
                htmlFor="roomType"
                className="text-sm font-medium text-gray-700"
              >
                Vui Lòng Chọn Phòng*
              </Label>
              <Select
                name="roomId"
                value={booking.roomId}
                onValueChange={(value) =>
                  setBooking((prev) => ({
                    ...prev,
                    roomId: value,
                  }))
                }
              >
                <SelectTrigger className="w-full text-sm font-medium text-gray-700 py-7">
                  <SelectValue placeholder="lựa chọn Loại Phòng" />
                </SelectTrigger>

                <SelectContent>
                  {rooms.map((room, index: number) => (
                    <SelectItem key={`${room.id}-${index}`} value={room.id}>
                      P{room.roomNumber} - {room.roomType.name} (Tối Đa:{" "}
                      {room.roomType.maxOccupancy})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="totalPerson"
                className="text-sm font-medium text-gray-700"
              >
                Tổng số Người*
              </Label>
              <Input
                id="totalPerson"
                name="totalGuests"
                value={booking.totalGuests}
                onChange={handlechange}
                type="number"
                min="1"
                className="text-sm font-medium text-gray-700 py-7"
                required
              />
            </div>
          </div>
          {/* Fourth Row - Date and Package */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="space-y-2">
              <Label
                htmlFor="checkInOut"
                className="text-sm font-medium text-gray-700"
              >
                Ngaỳ Nhận Phòng*
              </Label>
              <div className="relative border border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                <DatePicker
                  selected={
                    booking.checkInDate ? new Date(booking.checkInDate) : null
                  }
                  onChange={(date) => handleDateChange("checkInDate", date)}
                  excludeDates={bookedDates}
                  highlightDates={highlightedDates}
                  placeholderText="dd/MM/yyyy"
                  dateFormat="dd/MM/yyyy"
                  className="w-full py-4 pl-4"
                  required
                  minDate={new Date()}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="checkInOut"
                className="text-sm font-medium text-gray-700"
              >
                Ngaỳ Trả Phòng*
              </Label>
              <div className="relative w-full border border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                <DatePicker
                  selected={
                    booking.checkOutDate ? new Date(booking.checkOutDate) : null
                  }
                  onChange={(date) => handleDateChange("checkOutDate", date)}
                  excludeDates={bookedDates}
                  highlightDates={highlightedDates}
                  placeholderText="dd/MM/yyyy"
                  dateFormat="dd/MM/yyyy"
                  className="w-full py-4 pl-4"
                  required
                  minDate={
                    booking.checkInDate
                      ? new Date(
                          new Date(booking.checkInDate).getTime() +
                            24 * 60 * 60 * 1000,
                        )
                      : new Date()
                  }
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Note Field */}
          <div className="space-y-2">
            <Label htmlFor="note" className="text-sm font-medium text-gray-700">
              Lưu ý*
            </Label>
            <Textarea
              id="note"
              name="specialRequests"
              rows={4}
              value={booking.specialRequests}
              onChange={handlechange}
              className="border-gray-300 resize-none"
              placeholder="Enter any additional notes"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 justify-end">
            <Button type="button" variant="destructive" className="px-8">
              Hủy
            </Button>
            <Button
              type="button"
              onClick={handleComplete}
              className="bg-gray-400 hover:bg-gray-500 text-white px-8"
            >
              Hoàn Tất
            </Button>
          </div>
        </form>
      </div>
      <FormPaymentBooking
        formCustomer={formCustomer}
        formBooking={booking}
        isOpen={isOpen}
        setFormBooking={setBooking}
        setIsOpen={setIsOpen}
        seasonPrice={seasonPrice}
      />
    </>
  );
}
