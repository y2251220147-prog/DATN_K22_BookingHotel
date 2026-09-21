import { BookingFormData } from "@/app/(dashboard)/admin/bookings/add-booking/components/BookingForm";
import { CustomerForm } from "@/app/(dashboard)/admin/bookings/add-booking/page";
import { URL_API } from "@/lib/fetcher";
import axios from "axios";
import toast from "react-hot-toast";

export async function CustomerFromEmployee(formCustomer: CustomerForm) {
  const { id, ...customerData } = formCustomer;
  const res = await axios.post(
    `${URL_API}/api/auth/createCustomer`,
    customerData,
    {
      withCredentials: true,
    }
  );
  if (res.data && res.data.customer && res.data.customer.id) {
    return res.data.customer.id; // return new customer ID
  }
  toast.error("Không tạo được khách hàng");

  return null;
}

export async function BookingToEmployee(formBooking: BookingFormData) {
  const res = await axios.post(`${URL_API}/api/booking/employee`, formBooking, {
    withCredentials: true,
  });
  if (res.data && res.data.data && res.data.data.id) {
    return res.data.data.id;
  }
}

export async function PaymentForBooking(
  bookingId: string,
  amount: number,
  paymentMethod: string
) {
  const res = await axios.post(`${URL_API}/api/payment/employee`, {
    amount,
    paymentMethod,
    bookingId,
    status: "COMPLETED",
  });

  if (res.data) {
    toast.success("Đặt Phòng Thành Công");
    return true;
  }

  toast.error("Thanh toán thất bại, vui lòng thử lại!");
  return false;
}
