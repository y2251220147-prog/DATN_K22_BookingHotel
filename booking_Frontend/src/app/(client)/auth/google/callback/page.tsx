import { Suspense } from "react";
import GoogleCallbackClient from "./GoogleCallbackClient";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Đang đăng nhập bằng Google...
        </div>
      }
    >
      <GoogleCallbackClient />
    </Suspense>
  );
}
