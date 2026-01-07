import { LogoutWarningDialog, MainLayout, Navbar, NotFound, NotificationModal, Sidebar } from "@/components";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/api/store";
import { toggleSidebar } from "@/api/CommonSlice";
import { useMediaQuery } from "@/helper";
import { AppDashboard } from "@/features";
import { CircleX, Gift, ShieldAlert } from "lucide-react";
import { logout, setErrorObject, setWelcomePopup } from "@/api/AuthSlice";
import { disconnectSocket, initializeSocket } from "@/lib/ws";

const PrivateRoutes: React.FC = () => {
  const location = useLocation();
  const routerNavigate = useNavigate();
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state: RootState) => state.common.isOpen);
  const isMobileDevice = useMediaQuery("(max-width: 992px)");
  const isWelcome = useSelector((state: RootState) => state.auth.welcomePopup);
  const accessToken = useSelector((state: RootState) => state?.auth?.userData?.["tms-accessToken"]);
  const [isSessionExpired, setIsSessionExpired] = useState<boolean>(false);
  const errObj = useSelector((state: RootState) => state.auth.error);
  const tokenExpiry = useSelector((state: RootState) => state.auth.tokenExpiry);
  const maxRetries = 5;
  const [retryCount, setRetryCount] = useState(() => {
    const retryData = JSON.parse(localStorage.getItem("retryData") || "{}");
    if (retryData.timestamp && Date.now() - retryData.timestamp > 60000) {
      return 0;
    }
    return Number(retryData.count || 0);
  });
  const [showLogoutWarning, setShowLogoutWarning] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [lastError, setLastError] = useState<string | null>(null);

  if (!accessToken) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  useEffect(() => {
    localStorage.setItem("retryData", JSON.stringify({ count: retryCount, timestamp: Date.now() }));
  }, [retryCount]);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 992px)").matches;
    if (isMobile) dispatch(toggleSidebar(false));
  }, [location]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("tms-accessToken");
    localStorage.removeItem("retryData");
    routerNavigate("/sign-in");
    window.location.reload();
  };

  useEffect(() => {
    if (accessToken) {
      console.log("Initializing socket with token");
      initializeSocket(accessToken);
    } else {
      console.warn("⚠️ No token found, socket not initialized");
    }

    // Cleanup on unmount
    return () => {
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    if (tokenExpiry || isSessionExpired) {
      handleLogout();
    }
  }, [tokenExpiry, isSessionExpired]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (showLogoutWarning) {
      setCountdown(10);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer!);
            handleLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [showLogoutWarning]);

  useEffect(() => {
    if (errObj && Number(errObj.status) >= 500 && Number(errObj.status) < 600 && errObj.message !== lastError && !showLogoutWarning) {
      setLastError(errObj.message);
      // setRetryCount((prev) => {
      //   const newCount = prev + 1;
      if (retryCount >= maxRetries) {
        setShowLogoutWarning(true);
        //   }
        //   return newCount;
        // });
      }
    }
  }, [errObj, lastError, showLogoutWarning]);

  const appRoutes = useMemo(
    () => [
      {
        path: "dashboard",
        component: <AppDashboard />,
      },
    ],
    []
  );

  const errorModal = useMemo(() => {
    if (!errObj || Number(errObj.status) < 500 || Number(errObj.status) >= 600 || showLogoutWarning) {
      return null;
    }
    return (
      <NotificationModal
        className="bg-white"
        dialogClassName="border-0"
        icon={<CircleX size={48} className="text-red-500" />}
        open={true}
        setOpen={() => dispatch(setErrorObject({ status: null, message: "" }))}
        title="Something Went Wrong"
        subtitle={errObj.message}
        confirmButtonText={errObj?.returnKey ? "Go Back" : retryCount < maxRetries ? "Retry" : "Dismiss"}
        onConfirmClick={() => {
          if (errObj.returnKey) {
            routerNavigate(-1);
          } else if (retryCount < maxRetries) {
            setRetryCount((prev) => prev + 1);
            window.location.reload();
          }
          dispatch(setErrorObject({ status: null, message: "", returnKey: "" }));
        }}
      />
    );
  }, [errObj, dispatch, routerNavigate, retryCount]);

  return (
    <div className="h-screen w-full overflow-hidden">
      {isMobileDevice && <Navbar />}
      <div className="flex h-full bg-opacity-50">
        <Sidebar />

        {isMobileDevice && sidebarOpen && <div className="top-[65px] fixed inset-0 bg-black/60 z-40" onClick={() => dispatch(toggleSidebar(false))} />}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!isMobileDevice && <Navbar />}

          <MainLayout>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                {appRoutes.map((item, index) => (
                  <Route key={index} path={`${item.path}`} element={item.component} />
                ))}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </MainLayout>
        </div>
      </div>
      {errorModal}
      <LogoutWarningDialog open={showLogoutWarning} countdown={countdown} onConfirm={handleLogout} />
      <NotificationModal
        icon={<Gift className="text-green-500" />}
        open={isWelcome}
        setOpen={() => dispatch(setWelcomePopup(false))}
        dialogClassName="border-green-500"
        title="Welcome to TMS"
        subtitle="Your profile is now active. Start listing venues and products to reach guests on our platform."
        // confirmButtonText="Ok"
      />
      <NotificationModal
        icon={<ShieldAlert />}
        open={isSessionExpired}
        setOpen={() => setIsSessionExpired(false)}
        title="Session Expired"
        subtitle="Your session has been expired."
        confirmButtonText="Ok"
      />
    </div>
  );
};

export default PrivateRoutes;
