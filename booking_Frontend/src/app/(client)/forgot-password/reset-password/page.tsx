import React, { Suspense } from "react";
import ResetPasswordForm from "../Components/ResetPasswordForm";

const page = () => {
  return (
    <Suspense>
      <div className=" flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <ResetPasswordForm />
      </div>
    </Suspense>
  );
};

export default page;
