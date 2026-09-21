// app/admin/seasonal-rates/components/UpdateSeasonal.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Edit2,
  Loader2,
  AlertTriangle,
  Info,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { SeasonalRate } from "./types";
import toast from "react-hot-toast";
import { SEASON_OPTIONS } from "./seasons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatPrice } from "@/lib/formatPrice";
import axiosInstance from "@/lib/axios";
import Mutate from "@/hook/Mutate";
import { URL_API } from "@/lib/fetcher";

interface UpdateSeasonalProps {
  rate: SeasonalRate;
}
interface SeasonalRateForm {
  startDate: Date | null;
  endDate: Date | null;
  seasonName: string;
  multiplier: number;
  isActive?: boolean;
}

export default function UpdateSeasonal({ rate }: UpdateSeasonalProps) {
  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState<SeasonalRateForm>({
    startDate: null,
    endDate: null,
    seasonName: "",
    multiplier: 0,
    isActive: false,
  });

  // Check status
  const now = new Date();
  const startDate = new Date(String(rate.startDate));
  const endDate = new Date(String(rate.endDate));

  const isExpired = endDate < now;
  const isUpcoming = startDate > now;
  const canUpdate = !rate.isActive && !isExpired;

  // Populate form khi mở dialog
  useEffect(() => {
    if (open) {
      setFormData({
        startDate: new Date(rate.startDate) || null,
        endDate: new Date(rate.endDate) || null,
        seasonName: rate.seasonName,
        multiplier: rate.multiplier,
        isActive: rate.isActive,
      });
    }
  }, [open, rate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleBooleanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      isActive: e.target.value === "true",
    }));
  };

  const handleSeasonChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      seasonName: value,
    }));
  };

  const handleUpdate = async () => {
    // Validation
    if (startDate >= endDate) {
      toast.error("Ngày kết thúc phải sau ngày bắt đầu");
      return;
    }

    const multiplierNum = parseFloat(Number(formData.multiplier).toString());
    if (isNaN(multiplierNum) || multiplierNum < 0.5 || multiplierNum > 5) {
      toast.error("Hệ số giá phải từ 0.5 đến 5.0");
      return;
    }

    setIsUpdating(true);
    const loadingToast = toast.loading("Đang cập nhật seasonal rate...");

    try {
      const response = await axiosInstance.put(`/api/seasonal/${rate.id}`, {
        startDate: formData.startDate,
        endDate: formData.endDate,
        seasonName: formData.seasonName,
        multiplier: multiplierNum,
        isActive: formData.isActive,
      });
      toast.dismiss(loadingToast);
      const data = response.status;

      if (data === 200) {
        Mutate(`${URL_API}/api/seasonal`);
        toast.success(
          `Đã cập nhật seasonal rate ${formData.seasonName} cho Phong${rate.room.roomNumber}`,
        );

        setOpen(false);
      }
    } catch (error: string | any) {
      toast.dismiss(loadingToast);
      console.log(
        "llai error update seasonal rate:",
        error.response.data.message,
      );

      toast.error(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  console.log("formdata", formData);

  const calculateNewPrice = () => {
    const original = rate.room.originalPrice;
    const multiplier = parseFloat(Number(formData.multiplier).toString());
    return isNaN(multiplier) ? 0 : original * multiplier;
  };

  const calculateOldPrice = () => {
    return rate.room.originalPrice * rate.multiplier;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-blue-500 hover:bg-blue-700 hover:border-blue-300 transition-all duration-200 "
        >
          <Edit2 className="w-4 h-4 text-white" />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Edit2 className="w-6 h-6 text-blue-600" />
            Cập Nhật Seasonal Rate
          </DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin giá theo mùa cho{" "}
            <span className="font-semibold">Phong{rate.room.roomNumber}</span>
          </DialogDescription>
        </DialogHeader>
        {rate.isActive && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Cảnh báo quan trọng!</AlertTitle>
            <AlertDescription>
              Seasonal rate này đang hiệu lực. Mọi thay đổi sẽ ảnh hưởng đến giá
              phòng ngay lập tức!
            </AlertDescription>
          </Alert>
        )}
        {/* Info box - Current data */}
        <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-blue-900">Thông tin hiện tại</h4>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white/60 rounded p-2">
              <span className="text-gray-600">Giá gốc:</span>
              <p className="font-bold text-gray-900">
                {formatPrice(rate.room.originalPrice)}
              </p>
            </div>
            <div className="bg-white/60 rounded p-2">
              <span className="text-gray-600">Hệ số hiện tại:</span>
              <p className="font-bold text-blue-600">{rate.multiplier}x</p>
            </div>
            <div className="bg-white/60 rounded p-2">
              <span className="text-gray-600">Giá mùa hiện tại:</span>
              <p className="font-bold text-green-600">
                {calculateOldPrice().toLocaleString("vi-VN")}đ
              </p>
            </div>
            <div className="bg-white/60 rounded p-2">
              <span className="text-gray-600">Trạng thái:</span>
              <p className="font-bold text-purple-600">
                {rate.isActive
                  ? "🟢 Hoạt Động"
                  : isUpcoming
                    ? "🟡 Sắp diễn ra"
                    : "🔴 Hết hạn"}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {/* Season Name */}
          <div className="space-y-2 w-full">
            <Label htmlFor="seasonName" className="text-base font-semibold">
              Tên Mùa <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.seasonName}
              onValueChange={handleSeasonChange}
            >
              <SelectTrigger className="h-11 w-full">
                <SelectValue placeholder="Chọn mùa" />
              </SelectTrigger>
              <SelectContent>
                {SEASON_OPTIONS.map((season) => (
                  <SelectItem key={season.value} value={season.value}>
                    {season.icon} {season.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="startDate"
                className="text-base font-semibold flex items-center gap-1"
              >
                <Calendar className="w-4 h-4" />
                Ngày Bắt Đầu <span className="text-red-500">*</span>
              </Label>
              <div className="border border-gray-300 rounded-lg  focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-colors bg-white">
                {" "}
                <DatePicker
                  selected={formData.startDate}
                  onChange={(date) =>
                    setFormData((prev) => ({ ...prev, startDate: date }))
                  }
                  minDate={new Date()}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Chọn ngày bắt đầu"
                  className="w-full px-4 py-3 border border-gray-300  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="endDate"
                className="text-base font-semibold flex items-center gap-1"
              >
                <Calendar className="w-4 h-4" />
                Ngày Kết Thúc <span className="text-red-500">*</span>
              </Label>
              <div className="border border-gray-300 rounded-lg  focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-colors bg-white">
                <DatePicker
                  selected={formData.endDate}
                  onChange={(date) =>
                    setFormData((prev) => ({ ...prev, endDate: date }))
                  }
                  minDate={new Date()}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Chọn ngày kết thúc"
                  className="w-full px-4 py-3 border border-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                />
              </div>
            </div>
          </div>

          {/* Multiplier */}
          <div className="space-y-2">
            <Label
              htmlFor="multiplier"
              className="text-base font-semibold flex items-center gap-1"
            >
              <TrendingUp className="w-4 h-4" />
              Hệ Số Giá <span className="text-red-500">*</span>
            </Label>
            <Input
              id="multiplier"
              name="multiplier"
              type="number"
              step="0.1"
              min="0.5"
              max="5.0"
              value={formData.multiplier}
              onChange={handleInputChange}
              className="h-11"
            />
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                Ví dụ: 1.5 = tăng 50%, 2.0 = tăng 100%
              </span>
              {(formData.multiplier as number) &&
                (Number(formData.multiplier) as number) > 0 && (
                  <span className="font-semibold text-green-600">
                    Giá mới: {calculateNewPrice().toLocaleString("vi-VN")}đ
                  </span>
                )}
            </div>
          </div>
          <div>
            <select
              onChange={handleBooleanChange}
              name="isActive"
              value={formData.isActive ? "true" : "false"}
              className="w-full text-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm shadow-sm
               focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="true">Đang hoạt động</option>
              <option value="false"> tắt hoạt động</option>
            </select>
          </div>

          {/* Price comparison */}
          {formData.multiplier !== rate.multiplier && (
            <Alert className="bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-900">Thay đổi giá</AlertTitle>
              <AlertDescription className="text-amber-800">
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Giá cũ:</span>
                    <span className="font-semibold">
                      {formatPrice(calculateOldPrice())}
                    </span>
                  </div>
                  <div className="flex justify-between text-green-700 font-bold">
                    <span>Giá mới:</span>
                    <span>{formatPrice(calculateNewPrice())}</span>
                  </div>
                  <div className="flex justify-between border-t border-amber-300 pt-1 mt-1">
                    <span>Chênh lệch:</span>
                    <span
                      className={
                        calculateNewPrice() > calculateOldPrice()
                          ? "text-green-700"
                          : "text-red-700"
                      }
                    >
                      {(
                        calculateNewPrice() - calculateOldPrice()
                      ).toLocaleString("vi-VN")}
                      đ (
                      {Math.abs(
                        ((calculateNewPrice() - calculateOldPrice()) /
                          calculateOldPrice()) *
                        100,
                      ).toFixed(1)}
                      %)
                    </span>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isUpdating}
          >
            Hủy
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang cập nhật...
              </>
            ) : (
              <>
                <Edit2 className="mr-2 h-4 w-4" />
                Cập nhật
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
