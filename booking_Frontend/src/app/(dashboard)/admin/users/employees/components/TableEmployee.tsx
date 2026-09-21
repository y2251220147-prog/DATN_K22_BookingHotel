"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { formatDate } from "@/lib/formatDate";
import AddEmployee from "./AddEmployee";
import DisabledUser from "./DisabledUser";
import PermissionEmployee from "./PermissionEmployee";
import toast from "react-hot-toast";
import axios from "axios";
import { URL_API } from "@/lib/fetcher";
import EmployeeRoleAction from "./EmployeeRoleAction";
import SearchForm from "@/app/(dashboard)/components/searchPage/SearchForm";
import Mutate from "@/hook/Mutate";
import { translateDepartment, translateUserStatus } from "@/lib/translate";
import { Department, Position } from "../../../profile/components/employee";
import UpdateEmployee from "./UpdateEmployee";

interface EmployeeDetails {
  id: string;
  department: Department;
  hireDate: string;
  position: Position;
  roles: { id: string; role: { name: string } }[];
}

export interface Employee {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  userType: string;
  status: string;
  employee: EmployeeDetails | null;
}

interface IEmployees {
  employee: Employee[];
  search: string;
  setSearchTerm: (value: string) => void;
  setCurrentPage: (value: number) => void;
}

const TableEmployee = ({
  employee,
  search,
  setSearchTerm,
  setCurrentPage,
}: IEmployees) => {
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );

  async function RemoveEmployeeRole(id: string) {
    try {
      await axios.delete(`${URL_API}/api/role/removeRole/${id}`, {
        withCredentials: true,
      });
      toast.success("Hủy quyền thành công!");
      Mutate(`${URL_API}/api/auth/employee`);
      setIsPermissionModalOpen(false);
    } catch (error: any) {
      toast.error(
        error.response.data.message || "Đã xảy ra lỗi khi hủy quyền nhân viên.",
      );
    }
  }

  function OpenModalGetId(Employee: Employee) {
    setIsPermissionModalOpen(true);
    setSelectedEmployee(Employee);
  }
  // ✅ Thêm hàm riêng cho update
  function openUpdateModal(emp: Employee) {
    setSelectedEmployee(emp);
    setIsOpenUpdateModal(true);
  }

  return (
    <div className="space-y-4 bg-white ">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <SearchForm
          placeholder="Tìm Theo Tên Nhân Viên .... "
          search={search}
          resetPage={false}
          setSearch={setSearchTerm}
          setPage={setCurrentPage}
        />
        <AddEmployee />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="">
            <TableRow>
              <TableHead>Mã nhân viên</TableHead>
              <TableHead className="w-[250px]">Họ và tên</TableHead>
              <TableHead className="hidden md:table-cell">
                Số điện thoại
              </TableHead>

              <TableHead className="hidden md:table-cell">Phòng ban</TableHead>

              <TableHead className="hidden md:table-cell">
                Ngày vào làm
              </TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Vai Trò</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employee.length > 0 ? (
              employee.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    #{employee.id.slice(0, 8).toUpperCase()}
                  </TableCell>
                  <TableCell className="font-medium ">
                    <div className="text-base">
                      {" "}
                      {employee.lastName} {employee.firstName}
                    </div>
                    <p className="text-sm text-gray-500">{employee.email}</p>
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    {employee.phone}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {employee.employee?.department
                      ? translateDepartment(employee.employee.department)
                      : "Chưa phân công"}
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    {employee.employee?.hireDate
                      ? formatDate(
                        new Date(employee.employee.hireDate).toString(),
                      )
                      : "Chưa cập nhật"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        employee.status === "ACTIVE" ? "default" : "destructive"
                      }
                      className={`${employee.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                    >
                      {translateUserStatus(employee.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <p className={`${employee.employee?.roles[0]?.role ? "bg-green-500 text-white " : "bg-red-400 text-white "} text-xs rounded-full w-fit p-1`}>{employee.employee?.roles[0]?.role?.name ||
                      "vui lòng phân quyền"}</p>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 cursor-pointer"
                        >
                          <span className="sr-only">Mở menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {/* phân quyền && hủy quyền */}
                        <EmployeeRoleAction
                          OpenModalGetId={OpenModalGetId}
                          RemoveEmployeeRole={RemoveEmployeeRole}
                          employee={employee}
                        />

                        <DropdownMenuItem
                          onClick={() => openUpdateModal(employee)}
                          className="cursor-pointer"
                        >
                          chỉnh sửa
                        </DropdownMenuItem>

                        {/* vô hiệu hóa  */}
                        <DisabledUser employee={employee} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Không tìm thấy nhân viên nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <PermissionEmployee
        idEmployee={selectedEmployee?.id ?? ""}
        isOpen={isPermissionModalOpen}
        setIsOpen={setIsPermissionModalOpen}
      />
      <UpdateEmployee
        employee={selectedEmployee}
        isOpen={isOpenUpdateModal}
        setIsOpen={setIsOpenUpdateModal}
      />
    </div>
  );
};

export default TableEmployee;
