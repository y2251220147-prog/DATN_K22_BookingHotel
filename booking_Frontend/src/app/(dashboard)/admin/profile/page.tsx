"use client";
import useAuth from "@/lib/authUser";
import React from "react";
import EmployeeProfile from "./components/ProfileEmployee";

const Page = () => {
  const { user } = useAuth();

  return (
    <div>
      <EmployeeProfile profile={user || {}} />
    </div>
  );
};

export default Page;
