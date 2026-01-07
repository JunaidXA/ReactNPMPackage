import React from "react";
import { cn } from "@/lib/utils";
import { MainLayoutProps } from "../types";
import { useSelector } from "react-redux";
import { RootState } from "@/api/store";
import { useMediaQuery } from "@/helper";
// import { useSelector } from "react-redux";
// import { RootState } from "@/api/store";

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const isNavbarVisible = useSelector((state: RootState) => state.common.isNavbarVisible);
  const sidebarOpen = useSelector((state: RootState) => state.common.isOpen);
  const isMobileDevice = useMediaQuery("(max-width: 992px)");
  return (
    <main className={cn("transition-all duration-300", !isMobileDevice && (sidebarOpen ? "ml-[252px]" : "ml-20"))}>
      <div
        className={cn("w-full  overflow-y-auto transition-all duration-500 ease-in-out px-6 py-6 relative bg-[#F7F7F7]", isNavbarVisible ? "h-[calc(100vh-65px)]" : "h-[calc(100vh)]", "flex flex-col")}
      >
        <div>{children}</div>
      </div>
    </main>
  );
};

export default MainLayout;
