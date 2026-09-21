// app/admin/seasonal-rates/types.ts

export interface SeasonalRate {
  id: string;
  startDate: string;
  endDate: string;
  multiplier: number;
  seasonName: string;
  priority?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  roomId: string;
  room: Room;
}

export interface Room {
  id: string;
  roomNumber: string;
  floor: number;
  notes?: string | null;
  currentPrice: number;
  originalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}
