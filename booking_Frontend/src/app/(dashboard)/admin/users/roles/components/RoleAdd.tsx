import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axios";
import { PlusCircle, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Modal from "react-modal";
import useSWR from "swr";
import { PERMISSION_GROUPS, ROLE_OPTIONS } from "./role";
const RoleAdd = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [roleName, setRoleName] = useState("");
  const { data: roles = [], mutate } = useSWR(`/api/role`);
  useEffect(() => {
    Modal.setAppElement("#root");
  });
  const handleChange = (permission: string) => {
    setPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission],
    );
  };

  const handleSelectAll = (groupPermissions: { key: string }[]) => {
    const keys = groupPermissions.map((p) => p.key);
    const allSelected = keys.every((k) => permissions.includes(k));
    if (allSelected) {
      setPermissions((prev) => prev.filter((p) => !keys.includes(p)));
    } else {
      setPermissions((prev) => [...new Set([...prev, ...keys])]);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newRole = {
      id: Date.now(),
      name: roleName,
      permissions,
    };
    const optimisticRoles = [...roles, newRole];
    mutate(optimisticRoles, false);
    try {
      await axiosInstance.post("/api/role", {
        name: roleName,
        permissions,
      });
      await mutate();
      setIsOpen(false);
      setPermissions([]);
      toast.success("thêm quyền truy cập thành công");
    } catch (error: any) {
      console.error("Submit error", error);
      toast.error(error?.response.data.message);
      mutate(roles, false); // rollback nếu lỗi
    }
  };

  return (
    <>
      <Button
        className="flex items-center gap-2 cursor-pointer text-end"
        onClick={() => setIsOpen(!isOpen)}
      >
        <PlusCircle className="h-4 w-4" />
        Thêm Quyền Truy Cập
      </Button>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-7xl mx-auto mt-5 outline-none max-h-screen overflow-y-auto  "
        overlayClassName="fixed inset-0 bg-black/20 bg-opacity-50 flex justify-center items-start z-50"
        contentLabel="Thêm Quyền Truy Cập Mới"
      >
        <div className="space-y-4 mb-6 ">
          <div className="flex justify-between items-center mt-3">
            {" "}
            <h2 className="text-2xl font-bold ">Thêm Quyền Truy Cập Mới</h2>
            <X
              className="h-4 w-4 cursor-pointer text-red-500 hover:text-red-700"
              onClick={() => setIsOpen(false)}
            />
          </div>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <div className="space-y-2">
                <label htmlFor="roleName" className="text-sm font-medium">
                  Tên vai trò
                </label>
                <select
                  id="roleName"
                  className="w-full border rounded px-3 py-4 "
                  onChange={(e) => setRoleName(e.target.value)}
                  value={roleName}
                >
                  <option value="" disabled>
                    Chọn tên quyền / Select role
                  </option>
                  {ROLE_OPTIONS.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phân Quyền</label>
              <div className="space-y-4">
                {PERMISSION_GROUPS.map((group) => {
                  const allSelected = group.permissions.every((p) =>
                    permissions.includes(p.key),
                  );
                  return (
                    <div key={group.label} className="border rounded p-3">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-semibold">
                          {group.label}
                        </label>
                        <button
                          type="button"
                          className="text-xs text-blue-500 hover:underline"
                          onClick={() => handleSelectAll(group.permissions)}
                        >
                          {allSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {group.permissions.map((perm) => (
                          <label
                            key={perm.key}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              value={perm.key}
                              className="rounded"
                              checked={permissions.includes(perm.key)}
                              onChange={() => handleChange(perm.key)}
                            />
                            <span className="text-sm">{perm.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                Hủy
              </Button>
              <Button>Lưu</Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default RoleAdd;
