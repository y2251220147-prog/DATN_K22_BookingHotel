"use client";
import React, { useEffect, useState } from "react";
import BookingForm from "./components/BookingForm";
import SearchForm from "@/app/(dashboard)/components/searchPage/SearchForm";
import { Label } from "@/components/ui/label";
import useSWR from "swr";
import { URL_API } from "@/lib/fetcher";

export interface UserResult {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  userType: string;
  status: string;
  customer: {
    id: string;
    idNumber: string | null;
    address: string | null;
    city: string | null;
    country: string | null;
  };
}
export interface CustomerForm {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idNumber: string;
  address: string;
  city: string;
}

export interface UserResponse {
  customer: {
    result: UserResult[];
  };
}

const Page = () => {
  const [searchIdNumber, setSearchIdNumber] = useState("");
  const [formCustomer, setFormCustomer] = useState<CustomerForm>({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    idNumber: "",
    address: "",
    city: "",
  });
  const { data: customerData } = useSWR<UserResponse>(
    `${URL_API}/api/auth/customer?search=${searchIdNumber}&limit=9999&page=1`
  );

  useEffect(() => {
    const user = customerData?.customer?.result?.[0];
    if (user && searchIdNumber) {
      setFormCustomer({
        id: user?.customer?.id ?? "",
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        idNumber: user.customer?.idNumber ?? "",
        address: user.customer?.address ?? "",
        city: user.customer?.city ?? "",
      });
    } else {
      setFormCustomer({
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        idNumber: "",
        address: "",
        city: "",
      });
    }
  }, [customerData, searchIdNumber]);

  return (
    <div className="bg-white px-4 lg:px-10 py-4 rounded-2xl">
      <div className="flex justify-end my-5 mx-9">
        <Label>
          <SearchForm
            placeholder="Nhập CCCD"
            search={searchIdNumber}
            setPage={() => {}}
            setSearch={setSearchIdNumber}
            resetPage
          />
        </Label>
      </div>
      <BookingForm
        formCustomer={formCustomer}
        setFormCustomer={setFormCustomer}
      />
    </div>
  );
};

export default Page;
