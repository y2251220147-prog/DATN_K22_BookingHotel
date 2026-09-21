/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, ArrowDown, ArrowUp } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/formatPrice";
import UpdateRoomType from "./UpdateRoomType";
import DeleteRoomtype from "./DeleteRoomtype";

interface Amenity {
  amenity: { id: string; name: string };
}
interface RoomType {
  id: string;
  name: string;
  description: string;
  maxOccupancy: number;
  amenities: Amenity[];
  photoUrls?: string;
}
interface MockRoomType {
  roomTypes: RoomType[];
}

export default function RoomTypesAdminPage({ roomTypes }: MockRoomType) {
  if (!roomTypes || roomTypes.length === 0) {
    return <div className="text-center py-8">Không có loại phòng nào</div>;
  }
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="container mx-auto py-8 bg-white">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead className="w-[80px]">STT</TableHead>
              <TableHead className="w-[100px]">Hình ảnh</TableHead>
              <TableHead>Tên</TableHead>
              <TableHead>Sức chứa tối đa</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roomTypes.map((roomType, index) => (
              <React.Fragment key={roomType.id}>
                <TableRow className="mx-5">
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleRow(roomType.id)}
                    >
                      {expandedRows[roomType.id] ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div className="relative h-12 w-16 overflow-hidden rounded-md">
                      <Image
                        height={100}
                        width={100}
                        priority
                        src={roomType.photoUrls || "/placeholder.svg"}
                        alt={roomType.name}
                        className="object-cover h-full w-full"
                      />
                    </div>
                  </TableCell>
                  <TableCell>{roomType.name}</TableCell>

                  <TableCell className="ml-5">
                    {roomType.maxOccupancy} Người
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-4 ">
                      <UpdateRoomType roomTypes={roomType} />
                      <DeleteRoomtype roomTypeId={roomType.id} />
                    </div>
                  </TableCell>
                </TableRow>
                {expandedRows[roomType.id] && (
                  <TableRow key={`${roomType.id}-details`}>
                    <TableCell colSpan={7} className="bg-muted/50">
                      <div className="p-4">
                        <h3 className="font-medium mb-2">Mô Tả:</h3>
                        <p className="text-muted-foreground mb-4">
                          {roomType.description}
                        </p>

                        <h3 className="font-medium mb-2">Những Tiện Nghi:</h3>
                        <div className="flex flex-wrap gap-2">
                          {roomType.amenities.map((amenity) => (
                            <Badge key={amenity.amenity.id} variant="outline">
                              {amenity.amenity.name}
                            </Badge>
                          ))}
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
    </div>
  );
}
