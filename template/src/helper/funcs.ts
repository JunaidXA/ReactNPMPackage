import { type ApiTags, type HttpMethod, tagMapping } from "./text";
import CryptoJS from "crypto-js";

export const convertUTCToLocalTime = (utcTimeString: string): string => {
  const utcDate = new Date(utcTimeString);
  return utcDate.toString();
};
export const formatDateData = (utcTimeString: string) => {
  const myDate = convertUTCToLocalTime(utcTimeString);
  const dateObj = new Date(myDate);

  // Extract components
  const day = dateObj.getDate().toString().padStart(2, "0");
  const month = dateObj.toLocaleString("default", { month: "short" });
  const year = dateObj.getFullYear();

  let hours = dateObj.getHours();
  const originalHours = hours;
  hours = hours % 12 || 12;
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");
  const amOrPm = originalHours >= 12 ? "PM" : "AM";

  // Convert to 12-hour format
  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes} ${amOrPm}`;

  return {
    day,
    month,
    year,
    formattedTime,
  };
};

export const getRowOptions = (rows: number): string[] => {
  let results: string[];

  if (rows > 100) {
    results = ["5", "10", "25", "50", "100", "All"];
  } else if (rows > 50) {
    results = ["5", "10", "25", "50", "All"];
  } else if (rows > 25) {
    results = ["5", "10", "25", "All"];
  } else if (rows > 10) {
    results = ["5", "10", "All"];
  } else if (rows > 5) {
    results = ["5", "All"];
  } else {
    results = ["All"];
  }

  return results;
};

export const RemoveFilterFromArray = (filterValue: string, filters: string[]) => {
  let result: string[] = [];

  if (Array.isArray(filters)) {
    result = filters.filter((filter) => {
      return filter !== null && filter !== undefined && filterValue !== filter;
    });
  }

  return result;
};

export const getRowRangeText = (rows: number, rowsPerPage: number, position: number): string => {
  let result = "0 of 0";
  const tablePosition = position + 1;

  if (rows > 0) {
    if (tablePosition > 0 && tablePosition <= rows) {
      if (rowsPerPage > 0) {
        if (position + rowsPerPage <= rows) {
          result = tablePosition + " - " + (position + rowsPerPage) + " of " + rows;
        } else {
          result = tablePosition + " - " + rows + " of " + rows;
        }
      } else {
        result = tablePosition + " - ? of " + rows;
      }
    } else {
      result = "? of " + rows;
    }
  }

  return result;
};

export const arrayBufferToBase64 = (buffer: any) => {
  let binary = "";
  let bytes = new Uint8Array(buffer);
  let len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

export const getTagsFromMapping = (path: string, method: HttpMethod = "GET"): ApiTags[] => {
  const config = tagMapping[path];

  // If config doesn't exist, return empty array
  if (!config) return [];

  // If config is an array, return it directly
  if (Array.isArray(config)) return config;

  // If config is an object with method-specific mappings
  return config[method] || config.default || [];
};

export const snakeToSentence = (snake: string): string => {
  if (!snake) return "";

  const sentence = snake
    .split("_")
    .map((word, index) => {
      if (index === 0) {
        // Capitalize first word
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    })
    .join(" ");

  return sentence;
};

export const camelToSentence = (camel: string): string => {
  if (!camel) return "";

  const sentence = camel
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/^./, (char) => char.toUpperCase()); // Capitalize first letter

  return sentence;
};

export const getProductivityColor = (productivity: number) => {
  if (productivity >= 80) return { bg: "bg-green-500", text: "text-green-600" };
  if (productivity >= 65) return { bg: "bg-purple-500", text: "text-purple-600" };
  if (productivity >= 30) return { bg: "bg-yellow-500", text: "text-yellow-600" };
  return { bg: "bg-red-500", text: "text-red-600" };
};

const designationColorMap: Record<string, string> = {};

export const getDesignationBadgeColor = (designation: string) => {
  const predefinedColors = {
    "Software Developer": "bg-pink-100 text-pink-800",
    Developer: "bg-purple-100 text-purple-800",
    Finance: "bg-blue-100 text-blue-800",
    Executive: "bg-green-100 text-green-800",
    Unknown: "bg-gray-100 text-gray-800",
  };

  const colorPool = [
    "bg-red-100 text-red-800",
    "bg-yellow-100 text-yellow-800",
    "bg-indigo-100 text-indigo-800",
    "bg-teal-100 text-teal-800",
    "bg-orange-100 text-orange-800",
    "bg-lime-100 text-lime-800",
    "bg-emerald-100 text-emerald-800",
    "bg-fuchsia-100 text-fuchsia-800",
  ];

  if (predefinedColors[designation as keyof typeof predefinedColors]) {
    return predefinedColors[designation as keyof typeof predefinedColors];
  }

  // Cache a random color per unique designation
  if (!designationColorMap[designation]) {
    const randomIndex = Math.floor(Math.random() * colorPool.length);
    designationColorMap[designation] = colorPool[randomIndex];
  }

  return designationColorMap[designation];
};

export const formatNullValue = (value: string | null) => (value === null || value?.trim() === "" ? "--" : value);

export const decryptData = (encryptedData: any) => {
  if (!import.meta.env.TMS_SECRET_KEY) throw new Error("TMS_SECRET_KEY not defined in environment");
  if (!encryptedData || typeof encryptedData !== "string") return null;

  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, import.meta.env.TMS_SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error("Decryption failed:", error);
    return null; // return null instead of throwing, so caller can handle gracefully
  }
};

export const formatNumber = (num: number) => {
  if (num >= 1_000_000_000) {
    return (
      (Math.floor((num / 1_000_000_000) * 10) / 10).toLocaleString(undefined, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }) + "B د.إ"
    );
  } else if (num >= 1_000_000) {
    return (
      (Math.floor((num / 1_000_000) * 10) / 10).toLocaleString(undefined, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }) + "M د.إ"
    );
  } else if (num >= 1_000) {
    return (
      (Math.floor((num / 1_000) * 10) / 10).toLocaleString(undefined, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }) + "K د.إ"
    );
  } else {
    return (
      num?.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + " د.إ"
    );
  }
};

export const buildQueryFromFilters = (filters: Record<string, string | number | undefined>) => {
  return Object.entries(filters)
    .filter(([_, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&");
};

export const formatDateAndTimeAMPM = (isoString: string) => {
  const dateObj = new Date(isoString);

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  const date = new Intl.DateTimeFormat("en-GB", options).format(dateObj);

  const time = dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return { date, time };
};

export const groupNotificationsByDateUTC = (notifications: any) => {
  return notifications.reduce((acc: any, notification: any) => {
    const { date } = formatDateAndTimeAMPM(notification.CreatedOn);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(notification);
    return acc;
  }, {});
};

export const parseTo24Hour = (time12h: string) => {
  if (!time12h) return "";
  const [timePart, modifier] = time12h.split(" ");
  let [hours, minutes] = timePart.split(":").map(Number);
  if (modifier === "PM" && hours < 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

export const to12HourFormat = (dateString: string) => {
  if (!dateString || isNaN(Date.parse(dateString))) return "";
  const date = new Date(dateString);
  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${ampm}`;
};

// 🔹 Utility: extract just YYYY-MM-DD from ISO date
export const toDateOnly = (dateString: string) => {
  if (!dateString || isNaN(Date.parse(dateString))) return "";
  return new Date(dateString).toISOString().split("T")[0];
};

export const formatFileSize = (bytes: number): string => {
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
};

export const truncateText = (text: string, limit = 20) => {
  if (!text) return "";
  return text.length > limit ? text.slice(0, limit) + "..." : text;
};
