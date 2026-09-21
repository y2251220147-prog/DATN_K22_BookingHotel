import { PaymentMethod } from "../../rooms/components/booking";

interface Amenity {
  amenity: {
    id: string;
    name: string;
  };
}

interface RoomType {
  id: string;
  name: string;
  amenities: Amenity[];
}

interface Room {
  roomNumber: string;
  floor: number;
  roomType: RoomType;
  images: {
    id: string;
    imageUrl: string;
  }[];
}

interface BookingItem {
  id: string;
  room: Room;
  pricePerNight: string;
}

interface Payment {
  id: string;
  paymentMethod: PaymentMethod;
  status: string;
  amount: string;
  paymentDate: string;
}

export interface Booking {
  id: string;
  bookingDate: string;
  checkInDate: string;
  checkOutDate: string;
  totalGuests: number;
  status: string;
  bookingSource: string;
  totalAmount: string;
  bookingItems: BookingItem[];
  payments: Payment[];
  discount: null | {
    code: string;
    percentage: number;
  };
  customer?: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
}
