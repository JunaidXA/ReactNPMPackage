import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "./store";
import { ChecktokenExpire, setErrorObject } from "./AuthSlice";

export const MAIN_API_REDUCER_KEY = "mainApi";
export const api = createApi({
  reducerPath: MAIN_API_REDUCER_KEY,
  baseQuery: async (args, api, extraOptions) => {
    const baseQuery = fetchBaseQuery({
      baseUrl: import.meta.env.TMS_BASE_URL,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      prepareHeaders(headers, { getState }) {
        const token = (getState() as RootState).auth.userData[
          "tms-accessToken"
        ];
        if (token) {
          headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
      },
    });
    interface FetchBaseQueryError {
      status: number | string;
      originalStatus?: number;
      data?: any;
      error?: string;
    }

    try {
      const result = await baseQuery(args, api, extraOptions);

      if (result.error) {
        const error = result.error as FetchBaseQueryError;
        let errorMessage: string;
        const effectiveStatus =
          typeof error.status === "number"
            ? error.status
            : error.originalStatus || 500;

        // Handle 403 Forbidden - Token expiration
        if (effectiveStatus === 403 || effectiveStatus === 401) {
          api.dispatch(ChecktokenExpire(true));
        }

        // Handle 400 Bad Request for GET requests
        if (
          effectiveStatus === 400 &&
          result?.meta?.request?.method === "GET"
        ) {
          errorMessage =
            error.data?.Message || "Bad Request - Invalid data provided.";
          api.dispatch(
            setErrorObject({
              status: effectiveStatus,
              message: errorMessage,
              returnKey: true,
            })
          );
        }
        // Handle all 5xx Server Errors with specific messages for 502 and 504
        else if (effectiveStatus >= 500 && effectiveStatus < 600) {
          // Specific messages for 502 and 504
          if (effectiveStatus === 502) {
            errorMessage = "Bad Gateway";
          } else if (effectiveStatus === 504) {
            errorMessage = "Something went wrong";
          } else {
            errorMessage =
              error.data?.Message ||
              (typeof error.data === "string" && !error.data.includes("<html>")
                ? error.data
                : "Server Error - Please try again.");
          }
          api.dispatch(
            setErrorObject({
              status: effectiveStatus,
              message: errorMessage,
              returnKey: false,
            })
          );
        }
        // Handle other errors (including parsing errors)
        else {
          errorMessage =
            error.error ||
            error.data?.Message ||
            (typeof error.data === "string" && !error.data.includes("<html>")
              ? error.data
              : "An error occurred.");
          api.dispatch(
            setErrorObject({
              status: effectiveStatus,
              message: errorMessage,
              returnKey: false,
            })
          );
        }

        return {
          error: {
            status: effectiveStatus,
            data: { message: errorMessage },
          },
        };
      }

      return result;
    } catch (error) {
      console.error("Request error:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Unexpected error occurred.";

      api.dispatch(
        setErrorObject({
          status: 500,
          message: errorMessage,
          returnKey: false,
        })
      );

      return {
        error: {
          status: 500,
          data: { message: errorMessage },
        },
      };
    }
  },
  endpoints: () => ({}),
  tagTypes: [
    "AUTH",
    "GET-OTP",
    "TAG",
    "ADDTAG",
    "DEPARTMENT",
    "ADD-DEPARTMENT",
    "NOTES",
    "TICKETS",
    "CONVERSATION",
    "TYPE",
    "ADDTYPE",
    "SOURCE",
    "ADD-SOURCE",
    "STATUS",
    "ADD-STATUS",
    "CATEGORY",
    "ADD-CATEGORY",
  ],
});

export default api;
