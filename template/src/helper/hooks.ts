import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ActionConfig, ActionState } from "@/components/types";
import { useDeleteDynamicDataMutation, usePatchDynamicDataWithoutFormDataMutation } from "@/features/services";

export const useParamNavigation = () => {
  const navigate = useNavigate();

  return (value: string) => {
    navigate(`/portal/${value}`);
  };
};
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handleChange = () => setMatches(mediaQuery.matches);

    handleChange(); // Check if the current size matches
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [query, matches]);

  return matches;
};

export const debounce = <T extends (...args: any[]) => void>(func: T, wait: number): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
      timeout = null;
    }, wait);
  };
};

export function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
}

export const useEntityActions = (config: ActionConfig) => {
  const [actionState, setActionState] = useState<ActionState>({
    type: "",
    id: "",
    open: false,
  });
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });
  const [updateStatus, { isLoading: isStatusUpdating }] = usePatchDynamicDataWithoutFormDataMutation();
  const [deleteData, { isLoading: isDeleteLoading }] = useDeleteDynamicDataMutation();

  const handleAction = async (type: string, id: string | number) => {
    const actionConfig = config.apiActionMap[type];
    if (!actionConfig) {
      setApiError(`Unsupported action: ${type}`);
      return;
    }

    try {
      if (type === "Active") {
        updateStatus({
          type: `${config.entityType}/${id}`,
          body: actionConfig.body,
        }).then((res: any) => {
          if (res?.data?.Completed) {
            setActionState({ id: "", open: false, type: "" });
            setSuccess({
              open: true,
              message: config.successMessages.Active,
            });
          } else {
            setActionState({ id: "", open: false, type: "" });
            setApiError(res?.error?.Message);
          }
        });
      } else if (type === "InActive") {
        updateStatus({
          type: `${config.entityType}/${id}`,
          body: actionConfig.body,
        }).then((res: any) => {
          if (res?.data?.Completed) {
            setActionState({ id: "", open: false, type: "" });
            setSuccess({
              open: true,
              message: config.successMessages.InActive,
            });
          } else {
            setActionState({ id: "", open: false, type: "" });
            setApiError(res?.error?.Message);
          }
        });
      } else if (type === "Delete") {
        deleteData({
          id: id,
          type: config.entityType,
          action: type,
        }).then((res: any) => {
          if (res?.data?.Completed) {
            setActionState({ id: "", open: false, type: "" });
            setSuccess({
              open: true,
              message: config.successMessages.Delete,
            });
          } else {
            setActionState({ id: "", open: false, type: "" });
            setApiError(res?.error?.data?.message);
          }
        });
      } else if (type === "Trending") {
        updateStatus({
          type: `${config.entityType}/${id}`,
          body: actionConfig.body,
        }).then((res: any) => {
          if (res?.data?.Completed) {
            setActionState({ id: "", open: false, type: "" });
            setSuccess({
              open: true,
              message: config.successMessages.Trending,
            });
          } else {
            setActionState({ id: "", open: false, type: "" });
            setApiError(res?.error?.Message);
          }
        });
      } else if (type === "UnmarkTrending") {
        updateStatus({
          type: `${config.entityType}/${id}`,
          body: actionConfig.body,
        }).then((res: any) => {
          if (res?.data?.Completed) {
            setActionState({ id: "", open: false, type: "" });
            setSuccess({
              open: true,
              message: config.successMessages.UnmarkTrending,
            });
          } else {
            setActionState({ id: "", open: false, type: "" });
            setApiError(res?.error?.Message);
          }
        });
      } else if (type === "Refund") {
        updateStatus({
          type: `${config.entityType}/${id}`,
          body: actionConfig.body,
        }).then((res: any) => {
          if (res?.data?.Completed) {
            setActionState({ id: "", open: false, type: "" });
            setSuccess({
              open: true,
              message: config.successMessages.UnmarkTrending,
            });
          } else {
            setActionState({ id: "", open: false, type: "" });
            setApiError(res?.error?.Message);
          }
        });
      } else if (type === "FullBooked") {
        updateStatus({
          type: `pvt/venue/fullBooked/${id}`,
          body: { fullBooked: false },
        }).then((res: any) => {
          if (res?.data?.Completed) {
            setActionState({ id: "", open: false, type: "" });
            setSuccess({
              open: true,
              message: "Venue marked as available successfully.",
            });
          } else {
            setActionState({ id: "", open: false, type: "" });
            setApiError(res?.error?.Message);
          }
        });
      } else if (type === "Available") {
        updateStatus({
          type: `pvt/venue/fullBooked/${id}`,
          body: { fullBooked: true },
        }).then((res: any) => {
          if (res?.data?.Completed) {
            setActionState({ id: "", open: false, type: "" });
            setSuccess({
              open: true,
              message: "Venue marked as fully booked successfully.",
            });
          } else {
            setActionState({ id: "", open: false, type: "" });
            setApiError(res?.error?.Message);
          }
        });
      }
    } catch (error: any) {
      setApiError(error?.data?.Message || "An error occurred.");
      setActionState({ id: "", open: false, type: "" });
    }
  };

  return {
    actionState,
    setActionState,
    apiError,
    setApiError,
    success,
    setSuccess,
    handleAction,
    isLoading: isStatusUpdating || isDeleteLoading,
  };
};
