"use client";
import type React from "react";
import { useSidebar } from "../context/contextAdmin";
import AdminSidebar from "../components/navbar/AdminSidebar";
import AdminHeader from "../components/navbar/AdminHeader";
import useAuth from "@/lib/authUser";
import { Skeleton } from "@/components/ui/skeleton";
import { pusherClient } from "@/lib/pusher";
import toast from "react-hot-toast";
import { useEffect } from "react";

// This component will dynamically adjust based on sidebar state
function MainContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();
  useEffect(() => {
    const channel = pusherClient.subscribe("admin-channel");

    channel.bind("new-booking", (data: any) => {
      toast.success(`📩 Khách ${data.customer} đã đặt phòng ${data.room}`);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);
  const { loadingLog } = useAuth(["EMPLOYEE", "ADMIN"]);

  if (loadingLog) {
    return (
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  return (
    <main
      className={`transition-all duration-300 p-4 md:p-8 pt-16 md:pt-8 ${isCollapsed ? "md:ml-16" : "md:ml-64"
        }`}
    >
      {children}
    </main>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />
      <MainContent>
        <AdminHeader />
        {children}
      </MainContent>
    </div>
  );
}
