// types/employee.ts
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type UserType = "EMPLOYEE" | "CUSTOMER" | "ADMIN";
export type Department = "MANAGEMENT" | "FRONT_DESK" | "MAINTENANCE";
export type Position = "MANAGEMENT" | "FRONT_DESK" | "MAINTENANCE";

export interface Employee {
  id: string;
  userId: string;
  position: Position;
  department: Department;
  hireDate: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  userType: UserType;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  employee?: Employee | null;
}
