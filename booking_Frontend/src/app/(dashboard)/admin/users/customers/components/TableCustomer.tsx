"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import StatusCustomer from "./StatusCustomer";
import { UserRound } from "lucide-react";
import { translateUserStatus } from "@/lib/translate";

// Define types based on your Prisma schema
type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
type UserType = "CUSTOMER" | "EMPLOYEE" | "ADMIN";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  userType: UserType;
  status: UserStatus;
  customer: Customer;
}

interface Customer {
  id: string;
  address: string | null;
  city: string | null;
  country: string | null;
  idNumber: string | null;
}

interface ITableCustomer {
  customers: User[];
}

const TableCustomer = ({ customers }: ITableCustomer) => {
  // Filter customers based on search term

  return (
    <div className="space-y-4 bg-white  border rounded-xl">
      <div className="rounded-md  ">
        <Table>
          <TableHeader className="bg-blue-600  [&>tr>th]:!text-white p-2 ">
            <TableRow>
              <TableHead>Mã Khách hàng</TableHead>
              <TableHead>Họ và Tên</TableHead>
              <TableHead className="hidden md:table-cell">
                Số điện thoại
              </TableHead>
              <TableHead className="hidden md:table-cell">CMND/CCCD</TableHead>
              <TableHead className="hidden lg:table-cell">Địa điểm</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length > 0 ? (
              customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="hidden md:table-cell">
                    #{customer.id.slice(0, 8)}{" "}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <UserRound className="h-4 w-4" />
                      </div>
                      <div>
                        {" "}
                        <div>
                          {customer.firstName} {customer.lastName}
                        </div>
                        <p className="text-sm text-gray-500">
                          {customer.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    {customer.phone || "—"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {customer.customer.idNumber || "—"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {[customer.customer.city, customer.customer.country]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        customer.status === "ACTIVE"
                          ? "destructive"
                          : "secondary"
                      }
                      className={
                        customer.status === "ACTIVE"
                          ? "bg-green-50 text-green-600 hover:bg-green-100"
                          : "bg-red-50 text-red-600 hover:bg-red-100"
                      }
                    >
                      {translateUserStatus(customer.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <StatusCustomer
                      userId={customer.id}
                      status={customer.status}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  khách hàng không tìm thấy
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TableCustomer;
