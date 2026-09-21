"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import useAuth from "@/lib/authUser";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

interface CustomerInfo {
  address: string;
  city: string;
  country: string;
  idNumber: string;
}

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  status: string;
  createdAt: string;
  customer: CustomerInfo | null;
}

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-muted-foreground">{label}</label>
    {children}
  </div>
);

const ProfileUser = () => {
  const { user } = useAuth() as { user: UserProfile | null };
  const [form, setForm] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm(user);
    }
  }, [user]);

  if (!form) return <>Vui lòng chờ...</>;

  const updateField = (key: keyof UserProfile, value: any) => {
    setForm({ ...form, [key]: value });
  };

  const updateCustomerField = (key: keyof CustomerInfo, value: string) => {
    setForm({
      ...form,
      customer: {
        ...(form.customer as CustomerInfo),
        [key]: value,
      },
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axiosInstance.put(`/api/auth/customer/${form.id}`, {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        address: form.customer?.address,
        city: form.customer?.city,
        country: form.customer?.country,
      });
      toast.success("dữ liệu của bạn đã được cập nhật");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="p-4 sm:p-8 shadow-lg ">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center mb-4 border">
            <User className="h-14 w-14 text-secondary-foreground" />
          </div>
        </div>

        {/* User info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Họ">
            <Input
              value={form.firstName ?? ""}
              onChange={(e) => updateField("firstName", e.target.value)}
            />
          </Field>

          <Field label="Tên">
            <Input
              value={form.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
            />
          </Field>

          <Field label="Email">
            <Input value={form.email ?? ""} disabled />
          </Field>

          <Field label="Số điện thoại">
            <Input
              value={form.phone ?? ""}
              onChange={(e) => updateField("phone", e.target.value)}
            />
          </Field>
        </div>

        {/* Customer info */}
        {form.customer && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Địa chỉ">
              <Input
                value={form.customer.address ?? ""}
                onChange={(e) => updateCustomerField("address", e.target.value)}
              />
            </Field>

            <Field label="Thành phố">
              <Input
                value={form.customer.city ?? ""}
                onChange={(e) => updateCustomerField("city", e.target.value)}
              />
            </Field>

            <Field label="Quốc gia">
              <Input
                value={form.customer.country ?? ""}
                onChange={(e) => updateCustomerField("country", e.target.value)}
              />
            </Field>

            <Field label="CMND / CCCD">
              <Input value={form.customer.idNumber ?? ""} disabled />
            </Field>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProfileUser;
