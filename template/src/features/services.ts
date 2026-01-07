import api from "@/api/api";
import { tagMapping } from "@/helper";

export const AdminServices = api.injectEndpoints({
  endpoints: (build) => ({
    getDynamicData: build.query<
      any,
      {
        type: string;
        offset?: number;
        limit?: number;
        search?: string;
        id?: string;
        url?: string;
        sortBy?: string;
        sortOrder?: string;
        idType?: string;
        filters?: any;
        query?: any;
      }
    >({
      query: (data) => {
        // Build URL parts separately for clarity
        const basePath = `${data?.url || data?.type}`;

        const idPart = data?.idType ? `?${data.idType}=${data?.id}` : data?.id ? `?id=${data?.id}` : "";

        const paginationPart = data?.offset !== undefined && data?.limit !== undefined ? `${idPart ? "&" : "?"}offset=${data?.offset}&fetch=${data?.limit}` : "";
        const searchPart = data?.search ? `${idPart || paginationPart ? "&" : "?"}search=${data?.search}` : "";
        const sortingPart = data?.sortBy && data?.sortOrder ? `&sortColumn=${data?.sortBy}&sortOrder=${data?.sortOrder}` : "";
        const filterPart = data?.filters
          ? Object.entries(data.filters)
              .filter(([_, value]) => value !== null && value !== undefined)
              .map(([key, value]) => {
                if (Array.isArray(value)) {
                  return `${key}=${value.join("|")}`; // use | to separate multiple IDs
                }
                return `${key}=${value}`;
              })
              .join(",")
          : "";
        const filterQuery = filterPart ? `${idPart || paginationPart || searchPart ? "&" : "?"}filters=${filterPart}` : "";

        const queryParams = data?.query ? `${idPart || paginationPart || searchPart ? "&" : "?"}${data?.query}` : "";
        // Construct URL ensuring correct query parameter placement
        return {
          url: `${basePath}${idPart}${paginationPart}${searchPart}${sortingPart}${filterQuery}${queryParams}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, arg) => {
        const config = tagMapping[arg?.type || ""];

        if (!config) return [];

        let tagsToInvalidate: string[] = [];

        if (Array.isArray(config)) {
          tagsToInvalidate = config;
        } else {
          tagsToInvalidate = config["GET"] || config.default || [];
        }

        // Convert string tags to the object format RTK Query expects
        return tagsToInvalidate.map((tag) => ({ type: tag as any }));
      },
    }),

    getDynamicDataByAction: build.query<
      any,
      {
        type: string;
        offset?: number;
        limit?: number;
        search?: string;
        id?: string;
        url?: string;
        sortBy?: string;
        sortOrder?: string;
        idType?: string;
      }
    >({
      query: (data) => {
        // Build URL parts separately for clarity
        const basePath = `${data?.url || data?.type}`;

        const idPart = data?.idType ? `?${data.idType}=${data?.id}` : data?.id ? `/${data?.id}` : "";

        const paginationPart = data?.offset !== undefined && data?.limit !== undefined ? `${idPart ? "&" : "?"}offset=${data?.search ? 0 : data?.offset}&fetch=${data?.limit}` : "";
        const searchPart = data?.search ? `${idPart || paginationPart ? "&" : "?"}search=${data?.search}` : "";
        const sortingPart = data?.sortBy && data?.sortOrder ? `&sortColumn=${data?.sortBy}&sortOrder=${data?.sortOrder}` : "";

        // Construct URL ensuring correct query parameter placement
        return {
          url: `${basePath}${idPart}${paginationPart}${searchPart}${sortingPart}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, arg) => {
        const config = tagMapping[arg?.type || ""];

        if (!config) return [];

        let tagsToInvalidate: string[] = [];

        if (Array.isArray(config)) {
          tagsToInvalidate = config;
        } else {
          tagsToInvalidate = config["GET"] || config.default || [];
        }

        // Convert string tags to the object format RTK Query expects
        return tagsToInvalidate.map((tag) => ({ type: tag as any }));
      },
    }),

    createDynamicData: build.mutation<any, { type: string; formData: FormData }>({
      query: ({ type, formData }) => ({
        url: type,
        method: "POST",
        body: formData,
        headers: {
          Accept: "*/*",
        },
      }),

      invalidatesTags: (_result, _error, arg) => {
        const config = tagMapping[arg?.type || ""];

        if (!config) return [];

        let tagsToInvalidate: string[] = [];

        if (Array.isArray(config)) {
          tagsToInvalidate = config;
        } else {
          tagsToInvalidate = config["POST"] || config.default || [];
        }

        // Convert string tags to the object format RTK Query expects
        return tagsToInvalidate.map((tag) => ({ type: tag as any }));
      },
    }),

    createDynamicDataWithoutFormData: build.mutation<any, { id?: string; type: any; body: any; action?: string }>({
      query: (data) => {
        const method = data?.action === "edit" ? "PUT" : "POST";
        return {
          url: `${data.type}`,
          method,
          body: data.body,
        };
      },
      invalidatesTags: (_result, _error, arg) => {
        const config = tagMapping[arg?.type || ""];

        if (!config) return [];

        let tagsToInvalidate: string[] = [];

        if (Array.isArray(config)) {
          tagsToInvalidate = config;
        } else {
          tagsToInvalidate = config["POST"] || config.default || [];
        }

        // Convert string tags to the object format RTK Query expects
        return tagsToInvalidate.map((tag) => ({ type: tag as any }));
      },
    }),

    updateDynamicData: build.mutation<any, { type: string; formData: FormData; id?: number | string }>({
      query: ({ type, formData, id }) => ({
        url: `${type}${id ? `?id=${id}` : ""}`,
        method: "PUT",
        body: formData,
        headers: {
          Accept: "*/*",
        },
      }),
      invalidatesTags: (_result, _error, arg) => {
        const config = tagMapping[arg?.type || ""];

        if (!config) return [];

        let tagsToInvalidate: string[] = [];

        if (Array.isArray(config)) {
          tagsToInvalidate = config;
        } else {
          tagsToInvalidate = config["PUT"] || config.default || [];
        }

        // Convert string tags to the object format RTK Query expects
        return tagsToInvalidate.map((tag) => ({ type: tag as any }));
      },
    }),

    updateDynamicDataWithoutFormData: build.mutation<any, { id?: string; type: any; body: any; action?: string }>({
      query: (data) => {
        return {
          url: `${data.type}${data.id ? `?id=${data.id}` : ""}`,
          method: "PUT",
          body: data.body,
        };
      },
      invalidatesTags: (_result, _error, arg) => {
        const config = tagMapping[arg?.type || ""];

        if (!config) return [];

        let tagsToInvalidate: string[] = [];

        if (Array.isArray(config)) {
          tagsToInvalidate = config;
        } else {
          tagsToInvalidate = config["PUT"] || config.default || [];
        }

        // Convert string tags to the object format RTK Query expects
        return tagsToInvalidate.map((tag) => ({ type: tag as any }));
      },
    }),
    patchDynamicDataWithoutFormData: build.mutation<any, { id?: string; type: any; body: any; action?: string }>({
      query: (data) => {
        return {
          url: `${data.type}${data.id ? `?id=${data.id}` : ""}`,
          method: "PATCH",
          body: data.body,
        };
      },
      invalidatesTags: (_result, _error, arg) => {
        // Extract the base type by removing the ID portion
        const baseType = arg?.type?.split("/").slice(0, 2).join("/"); // e.g., "pvt/product"
        const config = tagMapping[baseType || ""];

        if (!config) return [];

        let tagsToInvalidate: string[] = [];

        if (Array.isArray(config)) {
          tagsToInvalidate = config;
        } else {
          tagsToInvalidate = config["PATCH"] || config.default || [];
        }

        // Convert string tags to the object format RTK Query expects
        return tagsToInvalidate.map((tag) => ({ type: tag as any }));
      },
    }),

    deleteDynamicData: build.mutation<any, { id?: number | string; type: any; action?: string }>({
      query: (data) => {
        return {
          url: `${data.type}${data?.id ? `?id=${data?.id}` : ""}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (_result, _error, arg) => {
        const config = tagMapping[arg?.type || ""];

        if (!config) return [];

        let tagsToInvalidate: string[] = [];

        if (Array.isArray(config)) {
          tagsToInvalidate = config;
        } else {
          tagsToInvalidate = config["DELETE"] || config.default || [];
        }

        // Convert string tags to the object format RTK Query expects
        return tagsToInvalidate.map((tag) => ({ type: tag as any }));
      },
    }),
    getOTP: build.query<any, void>({
      query: () => ({
        url: `pvt/sendOTP`,
        method: "GET",
      }),
      providesTags: ["GET-OTP"],
    }),
  }),
});

export const {
  useGetDynamicDataQuery,
  useCreateDynamicDataMutation,
  useUpdateDynamicDataMutation,
  useDeleteDynamicDataMutation,
  useCreateDynamicDataWithoutFormDataMutation,
  useUpdateDynamicDataWithoutFormDataMutation,
  //   useGetProfileImageQuery,
  //   useLazyGetOTPQuery,
  //   useLazyGetDashboardDataQuery,
  useLazyGetDynamicDataByActionQuery,
  useLazyGetOTPQuery,
  usePatchDynamicDataWithoutFormDataMutation,
} = AdminServices;
