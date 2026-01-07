import React, { useEffect } from "react";
// import { FormInput } from "../ui/input";
import Logo from "../../assets/logo.svg";
import SingleLogo from "../../assets/smallLogoGreen.svg";
import { Menu } from "../ui/dropdown-menu";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/api/store";
import { cn } from "@/lib/utils";
import { toggleSidebar } from "@/api/CommonSlice";
import { useMediaQuery, useParamNavigation } from "@/helper";
import { getuserData, logout } from "@/api/AuthSlice";
import { setProductActiveTabIndex } from "@/api/ProductSlice";

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useParamNavigation();
  const userData = useSelector(getuserData);
  const sidebarOpen = useSelector((state: RootState) => state.common.isOpen);
  const isNavbarVisible = useSelector(
    (state: RootState) => state.common.isNavbarVisible
  );
  const isMobileDevice = useMediaQuery("(max-width: 992px)");
  useEffect(() => {
    const isProductPage = location.pathname.includes("/product");
    if (!isProductPage) {
      dispatch(setProductActiveTabIndex(0));
    }
  }, [location.pathname, dispatch]);
  const handleMenuChange = (e: string) => {
    if (e === "profile") {
      navigate("profile");
    } else if (e === "logout") {
      dispatch(logout());
      window.location.reload();
    }
  };

  return (
    <div
      className={cn(
        "grid items-center bg-[#2c2c2c] px-4 sm:px-6 relative transition-all duration-500 ease-in-out",
        "grid-cols-5 lg:grid-cols-2",
        !isNavbarVisible ? "h-0 -translate-y-full" : "h-[65px] translate-y-0"
      )}
    >
      <div className="flex justify-start lg:hidden">
        <button
          className="p-1 rounded-md transition-colors relative w-8 h-8"
          onClick={() => dispatch(toggleSidebar(!sidebarOpen))}
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        >
          <i
            className={`
        ti ti-menu-2 text-xl text-primary absolute inset-0 flex items-center justify-center
        transition-all duration-300
        ${
          sidebarOpen
            ? "opacity-0 scale-75 pointer-events-none"
            : "opacity-100 scale-100"
        }
      `}
          />
          <i
            className={`
        ti ti-x text-xl text-primary absolute inset-0 flex items-center justify-center
        transition-all duration-300
        ${
          sidebarOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-75 pointer-events-none"
        }
      `}
          />
        </button>
      </div>

      <div className="flex col-span-3 justify-center lg:justify-start lg:col-span-1">
        {/* {!isMobileDevice && (
          <FormInput
            onChange={(e) => console.log(e)}
            innerClassName="h-[34px] bg-white rounded-lg w-full"
            placeholder="Search"
            inputClass="placeholder:text-sm font-medium font-nunito"
            pre={
              <i className="ti ti-search text-md text-neutral-400 flex items-center px-2"></i>
            }
          />
        )} */}
        {isMobileDevice && (
          <img
            onClick={() => navigate("dashboard")}
            src={Logo}
            alt="Img"
            className={"h-8"}
          />
        )}
      </div>

      <div className="flex justify-end">
        <Menu
          menuType="Profile"
          className="focus-visible:outline-none cursor-pointer"
          dropdownContentclass="py-2 !h-full !w-full shadow-lg"
          onChange={handleMenuChange}
          image={SingleLogo}
          icon={
            isMobileDevice ? (
              <i className="ti ti-dots-vertical text-xl text-primary" />
            ) : undefined
          }
          username={userData?.name || userData.email}
          role="Admin"
          menuItems={[
            {
              action: "logout",
              label: "Sign out",
              icon: <i className="ti ti-logout text-sm"></i>,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default Navbar;
