// store/useBookingForm.ts
import { create } from "zustand";

interface FormData {
  checkInDate: Date | null;
  checkOutDate: Date | null;
  totalGuests: number;
  specialRequests: string;
  bookingSource: string;
  totalAmount: number;
  discountId: string | null;
  guestId: string | null;
  pricePerNight: number;
  discountAmount: number;
  roomId: string;
}

interface BookingStore {
  formData: FormData;
  setFormData: (data: Partial<FormData>) => void;
  resetForm: () => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  formData: {
    checkInDate: null,
    checkOutDate: null,
    totalGuests: 1,
    specialRequests: "",
    bookingSource: "WEBSITE",
    totalAmount: 0,
    discountAmount: 0,
    discountId: null,
    guestId: null,
    pricePerNight: 0,
    roomId: "",
  },
  setFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),
  resetForm: () =>
    set({
      formData: {
        checkInDate: null,
        checkOutDate: null,
        totalGuests: 1,
        specialRequests: "",
        bookingSource: "WEBSITE",
        totalAmount: 0,
        discountAmount: 0,
        discountId: null,
        guestId: null,
        pricePerNight: 0,
        roomId: "",
      },
    }),
}));
