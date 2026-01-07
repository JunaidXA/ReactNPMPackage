import { FieldConfig } from "@/components/types";
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
export type TagConfig = ApiTags[] | Record<HttpMethod | "default", ApiTags[]>;

export const tagMapping: Record<string, TagConfig> = {
  Auth: ["AUTH"],
};

export type ApiTags = "AUTH" | "GET-OTP";

export const acceptMap: Record<string, string[]> = {
  image: ["image/*"],
  video: ["video/*"],
  audio: ["audio/*"],
  text: ["text/*"],
  application: ["application/*"],
  pdf: ["application/pdf"],
  word: ["application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  excel: ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
  powerpoint: ["application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"],
  zip: ["application/zip", "application/x-rar-compressed"],
  json: ["application/json"],
  xml: ["application/xml", "text/xml"],
};

export const userPermissionsFields: FieldConfig[] = [
  {
    name: "moduleGroup",
    isGroup: true,
    groupClassName: "grid grid-cols-1 gap-4",
    components: [
      {
        name: "holidays",
        label: "Holidays",
        // type: "checkbox",
        entity: "checkbox",
      },
      {
        name: "leaves",
        label: "Leaves",
        // type: "checkbox",
        entity: "checkbox",
      },
      {
        name: "clients",
        label: "Clients",
        // type: "checkbox",
        entity: "checkbox",
      },
      {
        name: "projects",
        label: "Projects",
        // type: "checkbox",
        entity: "checkbox",
      },
      {
        name: "tasks",
        label: "Tasks",
        // type: "checkbox",
        entity: "checkbox",
      },
      {
        name: "chats",
        label: "Chats",
        // type: "checkbox",
        entity: "checkbox",
      },
      {
        name: "assets",
        label: "Assets",
        // type: "checkbox",
        entity: "checkbox",
      },
      {
        name: "timingSheets",
        label: "Timing Sheets",
        // type: "checkbox",
        entity: "checkbox",
      },
    ],
  },
  {
    name: "permissionsGroup",
    isGroup: true,
    groupClassName: "grid grid-cols-12 gap-4",
    components: [
      { name: "read", label: "Read", entity: "checkbox" },
      { name: "write", label: "Write", entity: "checkbox" },
      { name: "create", label: "Create", entity: "checkbox" },
      { name: "delete", label: "Delete", entity: "checkbox" },
      { name: "import", label: "Import", entity: "checkbox" },
      { name: "export", label: "Export", entity: "checkbox" },
    ],
  },
];

export const menuItems = (
  accounts: {
    icon: string;
    label: string;
    navigate: string;
    subItems?: { icon: string; label: string; navigate: string }[];
  }[]
) => {
  return [
    {
      title: "Main",
      items: [
        {
          icon: "ti ti-layout-grid mb-0.5",
          label: "Dashboard",
          navigate: "dashboard",
          allowedRole: ["Admin", "Agent"],
        },
        ...(accounts && accounts?.length > 0
          ? [
              {
                icon: "ti ti-users mb-0.5",
                label: "Accounts",
                subItems: accounts,
                allowedRole: ["Admin", "Agent"],
              },
            ]
          : []),

        {
          icon: "ti ti-database-cog mb-0.5",
          label: "Settings",
          allowedRole: ["Admin"],
          subItems: [
            {
              icon: "ti ti-users-group mb-0.5",
              label: "Users",
              navigate: "users",
            },

            {
              icon: "ti ti-library mb-0.5",
              label: "Accounts",
              navigate: "accounts",
            },

            {
              icon: "ti ti-list-tree mb-0.5",
              label: "Types",
              navigate: "types",
            },

            {
              icon: "ti ti-category-2 mb-0.5",
              label: "Categories",
              navigate: "categories",
            },

            {
              icon: "ti ti-tags mb-0.5",
              label: "Tags",
              navigate: "tags",
            },

            {
              icon: "ti ti-device-ipad-check mb-0.5",
              label: "Sources",
              navigate: "sources",
            },

            {
              icon: "ti ti-progress mb-0.5",
              label: "Statuses",
              navigate: "statuses",
            },

            {
              icon: "ti ti-cube-unfolded mb-0.5",
              label: "Departments",
              navigate: "departments",
            },

            {
              icon: "ti ti-mail mb-0.5",
              label: "Email Templates",
              navigate: "email-templates",
            },
          ],
        },
      ],
    },
  ];
};
