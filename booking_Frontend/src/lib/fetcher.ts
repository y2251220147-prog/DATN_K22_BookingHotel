import axios from "./axios";
export const fetcher = async (url: string) => {
  const res = await axios.get(url, {
    withCredentials: true,
  });
  return res.data;
};

export const URL_API = process.env.NEXT_PUBLIC_URL_API;
