"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axiosInstance from "@/lib/axios";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import { PERM_LABELS } from "./role";
import RoleDeleteButton from "./RoleDeleteButton";

interface Role {
  id: string;
  name: string;
  permissions: string[];
}

interface RoleTableProps {
  roles: Role[];
}

const RoleTable = ({ roles }: RoleTableProps) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (roleId: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(roleId)) {
        newSet.delete(roleId);
      } else {
        newSet.add(roleId);
      }
      return newSet;
    });
  };

  const isExpanded = (roleId: string) => expandedRows.has(roleId);

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Tên Quyền</TableHead>
            <TableHead>Số Lượng Phân Quyền</TableHead>
            <TableHead>Hành Động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <React.Fragment key={role.id}>
              <TableRow
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleRow(role.id)}
              >
                <TableCell>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRow(role.id);
                    }}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    {isExpanded(role.id) ? (
                      <ChevronDownIcon className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                </TableCell>
                <TableCell className="font-semibold text-gray-900">
                  {role.name}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {role.permissions.length} quyền
                  </span>
                </TableCell>
                <TableCell className="space-x-2">
                  <RoleDeleteButton roleId={role.id} roleName={role.name} />
                </TableCell>
              </TableRow>

              {isExpanded(role.id) && (
                <TableRow>
                  <TableCell colSpan={4} className="bg-gray-50 p-0">
                    <div className="animate-in slide-in-from-top-2 duration-200">
                      <div className="p-4 pl-12">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">
                          Danh sách phân quyền:
                        </h4>
                        {role.permissions.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {role.permissions.map((permission, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                              >
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                                {/* fix: dùng PERM_LABELS thay vì JSON.stringify */}
                                <span className="text-sm text-gray-700 font-medium">
                                  {PERM_LABELS[permission] ?? permission}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 italic">
                            Chưa có phân quyền nào
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RoleTable;
