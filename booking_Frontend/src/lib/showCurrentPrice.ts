import axiosInstance from "./axios";

interface IShow {
  bookingStart?: Date | string | null;
  bookingEnd?: Date | string | null;
  roomId: string;
}

export async function ShowCurrentPrice({
  bookingStart,
  bookingEnd,
  roomId,
}: IShow) {
  if (!roomId) throw new Error("roomId là bắt buộc");

  const params = new URLSearchParams();

  if (bookingStart && bookingEnd)
    params.append("bookingStart", bookingStart.toString());
  if (bookingStart && bookingEnd)
    params.append("bookingEnd", bookingEnd.toString());
  if (roomId) params.append("roomId", roomId);
  const res = await axiosInstance.get(
    `/api/room/calculate-price?${params.toString()}`
  );

  return res.data.data;
}
