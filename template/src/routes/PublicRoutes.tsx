import React, { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ForgotPassword, Login, ResetPassword, SignUp } from "@/features";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/api/store";
import { NotFound } from "@/components";
import { logout } from "@/api/AuthSlice";

const PublicRoutes: React.FC = () => {
  const dispatch = useDispatch();
  const accessToken = useSelector((state: RootState) => state.auth.userData["tms-accessToken"]);
  const location = useLocation();

  // Clear auth data when register route is accessed
  useEffect(() => {
    if (location.pathname === "/register") {
      dispatch(logout());
    }
  }, [location.pathname, dispatch]);

  // Don't redirect to dashboard if we're on register route (after logout)
  if (accessToken && location.pathname !== "/register") {
    return <Navigate to="/portal/dashboard" state={{ from: location }} replace />;
  }

  return (
    <Routes>
      <Route index element={<Login />} />
      <Route path="/sign-in" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/resetpassword" element={<ResetPassword />} />
      <Route path="/register" element={<SignUp />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default PublicRoutes;
