import { FilterConfig } from "@/components/types";

export const emailRegex = /^(?!.*\.\.)(?!.*\.$)(?!^\.)(?!^@)(?!.*\.@)(?!^[a-zA-Z0-9-]*-$)(?!^[a-zA-Z0-9.-]+@-[a-zA-Z0-9.-]+)([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,3}$/;

export const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@$!%*?&#])[A-Za-z0-9@$!%*?&#]+$/;

export const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/;

export const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, setFieldValue: any, name: string) => {
  let value = e.target.value.replace(/\D/g, ""); // remove non-digits

  // Auto add `:`
  if (value.length > 2) value = value.slice(0, 2) + ":" + value.slice(2);
  if (value.length > 5) value = value.slice(0, 5);

  let [hh, mm] = value.split(":");

  // validate hours (00-23)
  if (hh && Number(hh) > 23) hh = "23";

  // validate minutes (00-59)
  if (mm && Number(mm) > 59) mm = "59";

  // validate seconds (00-59)

  // Rebuild safe value
  let safeValue = hh ?? "";
  if (mm !== undefined) safeValue += ":" + mm;

  setFieldValue(name, safeValue);
};

export const ENTITY_FILTERS: Record<string, FilterConfig[]> = {
  tags: [
    {
      key: "Name",
      label: "Tag Name",
      type: "text",
      placeholder: "Search tag",
    },
    {
      key: "Status",
      label: "Status",
      type: "select",
      items: [
        { key: "Active", label: "Active", value: "Active" },
        { key: "Inactive", label: "Inactive", value: "Inactive" },
      ],
    },
  ],

  types: [
    {
      key: "Name",
      label: "Type Name",
      type: "text",
      placeholder: "Search type",
    },
    {
      key: "Status",
      label: "Status",
      type: "select",
      items: [
        { key: "Active", label: "Active", value: "Active" },
        { key: "Inactive", label: "Inactive", value: "Inactive" },
      ],
    },
  ],
  departments: [
    {
      key: "Name",
      label: "Department Name",
      type: "text",
      placeholder: "Search type",
    },
    {
      key: "Status",
      label: "Status",
      type: "select",
      items: [
        { key: "Active", label: "Active", value: "Active" },
        { key: "Inactive", label: "Inactive", value: "Inactive" },
      ],
    },
  ],
};
