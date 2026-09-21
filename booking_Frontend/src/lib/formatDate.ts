interface BookedRange {
  start: string; // "YYYY-MM-DD"
  end: string; // "YYYY-MM-DD"
  status: string;
}

export const formatDate = (dateString: Date | null | string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // tháng bắt đầu từ 0
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const calculateNights = (
  checkInDate: Date | string | null,
  checkOutDate: Date | string | null
) => {
  if (checkInDate == null || checkOutDate == null) return null;

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  const diffTime = checkOut.getTime() - checkIn.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 0;
};

export function getHighlightedDates(
  bookedRanges: BookedRange[]
): { [className: string]: Date[] }[] {
  const highlightedMap: { [className: string]: Set<number> } = {};
  const highlightedResult: { [className: string]: Date[] }[] = [];

  bookedRanges.forEach((range) => {
    const startDate = new Date(`${range.start}T00:00:00`);
    const endDate = new Date(`${range.end}T00:00:00`);
    const dates: Date[] = [];
    for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
      const localDate = new Date(d);
      localDate.setHours(0, 0, 0, 0);
      dates.push(localDate);
    }

    let className = "";
    if (range.status === "CHECKED_IN") {
      className = "react-datepicker__day--checked-in";
    } else if (range.status === "PENDING") {
      className = "react-datepicker__day--pending";
    }

    if (className) {
      if (!highlightedMap[className]) {
        highlightedMap[className] = new Set();
      }
      dates.forEach((date) => {
        highlightedMap[className].add(date.getTime());
      });
    }
  });

  // Chuyển Set về mảng Date và tạo object theo đúng format
  for (const className in highlightedMap) {
    highlightedResult.push({
      [className]: Array.from(highlightedMap[className]).map(
        (ts) => new Date(ts)
      ),
    });
  }

  return highlightedResult;
}

export function getExcludeDates(bookedRanges: BookedRange[]): Date[] {
  const dates: Date[] = [];
  bookedRanges.forEach((range) => {
    const startDate = new Date(`${range.start}T00:00:00`);
    const endDate = new Date(`${range.end}T00:00:00`);

    for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
      const localDate = new Date(d);
      localDate.setHours(0, 0, 0, 0);
      dates.push(localDate);
    }
  });

  return dates;
}
