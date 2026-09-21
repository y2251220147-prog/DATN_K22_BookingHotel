"use client";
import Modal from "react-modal";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { URL_API } from "@/lib/fetcher";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import axios from "axios";
import Mutate from "@/hook/Mutate";
interface IPermissonEmployee {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  idEmployee: string;
}
const PermissionEmployee = ({
  isOpen,
  setIsOpen,
  idEmployee,
}: IPermissonEmployee) => {
  useEffect(() => {
    Modal.setAppElement("#root");
  }, []);
  const { data } = useSWR(`${URL_API}/api/role`);
  const [idRole, setIdRole] = useState("");

  const handleSumit = async () => {
    try {
      await axios.post(
        `${URL_API}/api/role/roleEmployee`,
        {
          idEmployee,
          idRole,
        },
        {
          withCredentials: true,
        },
      );
      Mutate(`${URL_API}/api/auth/employee`);
      toast.success("Cập nhật quyền thành công");
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error.response.data.message || "Có lỗi xảy ra");
    }
  };
  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-6xl mx-auto mt-40 outline-none"
        overlayClassName="fixed inset-0 bg-black/20 bg-opacity-50 flex justify-center items-start z-50"
        contentLabel="Phân quyền nhân viên"
      >
        <div className="space-y-4"></div>
        <h2 className="text-xl font-semibold">Phân quyền nhân viên</h2>
        <div className="flex flex-col gap-2 my-4">
          <label htmlFor="role" className="font-medium">
            Chọn quyền:
          </label>
          <select
            id="role"
            className="w-full p-2 border rounded-md"
            value={idRole}
            onChange={(e) => setIdRole(e.target.value)}
          >
            <option value="" disabled>
              Chọn quyền
            </option>
            {data?.map((role: { id: string; name: string }) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-2 mt-7">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Hủy
          </Button>
          <Button onClick={handleSumit}>Lưu</Button>
        </div>
      </Modal>
    </>
  );
};

export default PermissionEmployee;
