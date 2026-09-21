import { PaymentMethod } from "@/app/(client)/rooms/components/booking";

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "CHECKED_IN"
  | "CHECKED_OUT";

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface IBookingItem {
  room: {
    roomNumber: number;
    roomType: {
      name: string;
      photoUrls: string;
    };
  };
}

export interface ICustomer {
  id: string;
  idNumber: number;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

export interface IPayment {
  id: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  amount: number;
}

export interface IBookingRecord {
  id: string;
  checkInDate: string;
  checkOutDate: string;
  status: BookingStatus;
  totalAmount: string;
  totalGuests: number;
  createdAt: string;
  bookingItems: IBookingItem[];
  customer: ICustomer;
  payments: IPayment[];
}

export interface IBooking {
  bookings: IBookingRecord[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
