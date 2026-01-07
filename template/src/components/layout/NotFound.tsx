// src/pages/NotFound.tsx
import { RootState } from "@/api/store";
import { cn } from "@/lib/utils";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  const isNavbarVisible = useSelector(
    (state: RootState) => state.common.isNavbarVisible
  );
  const user = useSelector((state: RootState) => state.auth.userData);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center px-4",
        isNavbarVisible ? "h-[calc(100vh-125px)]" : "h-[calc(100vh)]"
      )}
    >
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">Oops! Page not found.</p>
      <Link
        to="/"
        className="text-white bg-primary px-4 py-2 rounded hover:bg-primary/90 transition"
      >
        Go To {user["tms-accessToken"] ? "Dashboard" : "Login"}
      </Link>
    </div>
  );
};

export default NotFound;
