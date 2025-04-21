export function formatTo12hTime(timeString: string | Date): string {
  if (timeString instanceof Date) {
    return timeString.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }

  const [hours, minutes] = timeString.split(":").map(Number);

  let period = "AM";
  let formattedHours = hours;

  if (hours >= 12) {
    period = "PM";
    if (hours > 12) {
      formattedHours = hours - 12;
    }
  }

  if (hours === 0) {
    formattedHours = 12;
  }

  const formattedMinutes = minutes.toString().padStart(2, "0");
  return `${formattedHours}:${formattedMinutes} ${period}`;
}

export function formatDate(dateValue: Date | string): string {
  dateValue = toValue(dateValue);
  if (typeof dateValue === "string") {
    return dateValue;
  }
  const year = dateValue.getFullYear();
  const month = String(dateValue.getMonth() + 1).padStart(2, "0");
  const day = String(dateValue.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
export function maskNRIC(nric: string) {
  // Adjusted regex to correctly handle the typical Singapore NRIC format
  return nric.replace(/^([A-Za-z])(\d+)([A-Za-z])$/, (match, p1, p2, p3) => {
    // Replace characters in the first and last groups with asterisks
    const maskedChars = p1 + p2.replace(/\d/g, "*") + p3;
    return maskedChars;
  });
}

export function formatToHHMM(dateValue: Date | string): string {
  if (typeof dateValue === "string") {
    dateValue = new Date(dateValue);
  }

  if (dateValue instanceof Date) {
    const hours = dateValue.getHours().toString().padStart(2, "0");
    const minutes = dateValue.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  throw new Error("Invalid date format");
}

export function dataURItoBlob(dataURI: string) {
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeString });
}

export function dateToISODateTime(date: Date) {
  return date.toISOString().replace("Z", "").replace("T", " ").split(".")[0];
}

export function formatToDMY(dateValue: Date | string): string {
  if (typeof dateValue === "string") {
    dateValue = new Date(dateValue);
  }

  if (dateValue instanceof Date) {
    const day = dateValue.getDate().toString().padStart(2, "0");
    const monthName = dateValue.toLocaleString("default", { month: "long" });
    const year = dateValue.getFullYear();
    return `${day} ${monthName} ${year}`;
  }

  throw new Error("Invalid date format");
}

export function formatToDMYDay(dateValue: Date | string): string {
  const date = new Date(dateValue);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  const weekday = date.toLocaleString("default", { weekday: "long" });

  return `${day} ${month} ${year} - ${weekday}`;
}
