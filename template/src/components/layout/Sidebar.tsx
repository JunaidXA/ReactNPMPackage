import React, { useState, useEffect } from "react";
import Logo from "../../assets/logoWhite.svg";
import SingleLogo from "../../assets/smallLogoWhite.svg";
import { ChevronLeft } from "../svg";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { menuItems, useMediaQuery, useParamNavigation } from "@/helper";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/api/store";
import { toggleSidebar } from "@/api/CommonSlice";
import SidebarBg from "../../assets/sideBarImg.jpg";
import { LayoutDashboard } from "lucide-react";

const Sidebar: React.FC = () => {
  const navigate = useParamNavigation();
  const location = useLocation();
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state: RootState) => state.common.isOpen);
  const accounts = useSelector((state: RootState) => state.auth.userData.accounts);

  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [activeRoute, setActiveRoute] = useState<string>("");
  const isMobileDevice = useMediaQuery("(max-width: 992px)");
  const [hasMounted, setHasMounted] = useState(false);

  const createAccountItem = (account: { AccountId: string | number; Name: string }) => ({
    icon: "ti ti-point-filled mb-0.5 ",
    label: account.Name,
    navigate: `chats/${account.AccountId}`,
  });

  useEffect(() => {
    const currentPath = location.pathname;
    let activeMenuItem = "";

    menuItems(accounts?.map(createAccountItem)).forEach((section) => {
      section.items.forEach((item) => {
        if (item.navigate && currentPath.includes(`/${item.navigate}`)) {
          activeMenuItem = item.navigate;
        }
        if (item.subItems) {
          item.subItems.forEach((subItem) => {
            if (subItem.navigate && currentPath.includes(`/${subItem.navigate}`)) {
              activeMenuItem = subItem.navigate;
            }
          });
        }
      });
    });

    setActiveRoute(activeMenuItem);
  }, [location]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && isMobileDevice) {
      dispatch(toggleSidebar(false));
    }
  }, [hasMounted, isMobileDevice]);

  if (!hasMounted) return null;

  const handleSidebarToggle = () => {
    dispatch(toggleSidebar(!sidebarOpen));
  };

  const handleMouseEnter = () => {
    if (!sidebarOpen) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!sidebarOpen) {
      setIsHovered(false);
      dispatch(toggleSidebar(false));
    }
  };

  const isSidebarExpanded = sidebarOpen || isHovered;

  const isActiveItem = (item: any) => item.navigate === activeRoute;
  const isParentActive = (item: any) => item.subItems?.some((subItem: any) => subItem.navigate === activeRoute);

  return (
    <div
      className={cn(
        "sidebar-bg transition-all duration-500 z-50 fixed h-screen",
        isSidebarExpanded ? "md:w-[252px] sm:w-full lg:w-[252px] xl:w-[252px]" : "w-20",
        isMobileDevice && cn("w-full shadow-lg", sidebarOpen ? "translate-x-0" : "-translate-x-full"),
        !isMobileDevice && isHovered && !sidebarOpen && "z-[9999]"
      )}
      id="sidebar"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        zIndex: isHovered && !sidebarOpen && !isMobileDevice ? 9999 : undefined,
      }}
    >
      {/* Background */}
      <div
        className={cn(
          "transition-all duration-500 absolute inset-0 pointer-events-none",
          isSidebarExpanded ? "w-[252px]" : "w-20",
          isMobileDevice && cn("w-full", sidebarOpen ? "translate-x-0" : "-translate-x-full")
        )}
        style={{
          backgroundImage: `url(${SidebarBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.4,
        }}
      />

      {/* Content */}
      <div className="relative z-100 h-full">
        {/* Top logo */}
        {!isMobileDevice && (
          <div className="relative flex items-center justify-start p-4 h-[65px] border-b border-border-gray/20 z-50">
            <img onClick={() => navigate("dashboard")} src={isSidebarExpanded ? Logo : SingleLogo} alt="Logo" className={cn("h-8", isSidebarExpanded ? "ml-2" : "ml-3")} />
            {isSidebarExpanded && (
              <Button className="h-[25px] text-white w-[25px] !p-0 rounded-full absolute -right-3" onClick={handleSidebarToggle}>
                {sidebarOpen ? (
                  <div className="rotate-180">
                    <ChevronLeft />
                  </div>
                ) : (
                  <ChevronLeft />
                )}
              </Button>
            )}
          </div>
        )}

        {/* Menu */}
        <div className="p-6 font-nunito text-white h-full overflow-y-auto">
          {menuItems(accounts?.map(createAccountItem)).map((section, sectionIndex) => (
            <div key={sectionIndex} className={cn("pb-3 mb-4", menuItems.length - 1 !== sectionIndex && "border-b border-border-gray/20")}>
              <ul>
                {section.items.map((item: any, index: number) => (
                  <li key={index} className={cn("mb-4 pb-3 transition-colors duration-200 cursor-pointer border-b border-border-gray/20", !isSidebarExpanded && "border-b")}>
                    {/* Parent item */}
                    <div
                      className={cn(
                        "flex items-center justify-between leading-5 mb-2 rounded-md transition-colors duration-200",
                        !isSidebarExpanded && "justify-center mb-0",
                        isActiveItem(item) || isParentActive(item) || location.pathname.split("/")[2] === item.navigate ? "text-primary" : ""
                      )}
                      onClick={() => {
                        if (!item.subItems) {
                          navigate(item.navigate ?? "");
                        }
                      }}
                    >
                      {isSidebarExpanded && <span className="font-black text-xs">{item.label}</span>}

                      {/* Collapsed default icon for no-submenu items */}
                      {!isSidebarExpanded && !item.subItems && <LayoutDashboard size={20} className={cn(isActiveItem(item) && "text-primary")} />}
                    </div>

                    {/* Sub Items */}
                    {item.subItems && (
                      <ul className={cn(isSidebarExpanded ? "" : "flex flex-col gap-4 items-center")}>
                        {item.subItems.map((subItem: any, subIndex: number) => (
                          <li
                            key={subIndex}
                            onClick={() => navigate(subItem.navigate ?? "")}
                            className={cn("cursor-pointer transition-colors duration-200", subItem.navigate === activeRoute && "text-primary")}
                          >
                            {isSidebarExpanded ? (
                              <div className="flex items-center gap-2 text-sm py-2 px-2 rounded-md hover:bg-white/10">
                                <i className={cn(`${subItem.icon} text-sm`, isActiveItem(subItem) && "text-primary")}></i>
                                {subItem.label}
                              </div>
                            ) : (
                              <i className={cn(`${subItem.icon} text-lg`, isActiveItem(subItem) && "text-primary")}></i>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
