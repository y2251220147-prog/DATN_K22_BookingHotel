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
import axiosInstance from "@/lib/axios";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";
import useSWR from "swr";

interface RoleDeleteButtonProps {
  roleId: string;
  roleName?: string;
}

const RoleDeleteButton = ({ roleId, roleName }: RoleDeleteButtonProps) => {
  const { data: roles = [], mutate } = useSWR(`/api/role`);

  const handleDelete = async () => {
    const optimisticRoles = roles.filter((r: any) => r.id !== roleId);
    mutate(optimisticRoles, false);

    try {
      await axiosInstance.delete(`/api/role/${roleId}`);
      await mutate();
      toast.success("Xóa vai trò thành công");
    } catch (error: any) {
      mutate(roles, false);
      toast.error(error?.response?.data?.message || "Xóa vai trò thất bại");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          aria-haspopup="dialog"
          className="bg-red-500 hover:bg-red-700 hover:border-red-300 transition-all duration-200 "
        >
          <Trash className="w-5 h-5 text-white" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa vai trò</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc muốn xóa vai trò{" "}
            <span className="font-semibold text-red-500">{roleName}</span>{" "}
            không? Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600"
            onClick={handleDelete}
          >
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RoleDeleteButton;
