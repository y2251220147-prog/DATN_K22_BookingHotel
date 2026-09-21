import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import React from "react";

interface EmployeeRoleActionProps {
  employee: any;
  RemoveEmployeeRole: (id: string) => Promise<void>;
  OpenModalGetId: (value: any) => void;
}
const EmployeeRoleAction = ({
  employee,
  RemoveEmployeeRole,
  OpenModalGetId,
}: EmployeeRoleActionProps) => {
  const hasRole = employee.employee?.roles?.length > 0;
  function handleRoleAction() {
    if (hasRole) {
      RemoveEmployeeRole(employee.employee.roles[0].id);
    } else {
      OpenModalGetId(employee.employee ?? "");
    }
  }
  return (
    <DropdownMenuItem onClick={handleRoleAction} className="cursor-pointer">
      {hasRole ? "Hủy quyền" : "Cấp quyền"}
    </DropdownMenuItem>
  );
};

export default EmployeeRoleAction;
