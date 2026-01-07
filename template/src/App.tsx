import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import PublicRoutes from "./routes/PublicRoutes";
import PrivateRoutes from "./routes/PrivateRoutes";

const App: React.FC = () => {
  useEffect(() => {
    const isMobile = window.innerWidth <= 768; // or use userAgent check
    const meta = document.querySelector("meta[name=viewport]");

    if (isMobile) {
      meta?.setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no");
    } else {
      meta?.setAttribute("content", "width=device-width, initial-scale=1.0");
    }
  }, []);
  return (
    <Routes>
      <Route path="/*" element={<PublicRoutes />} />
      <Route path="/portal/*" element={<PrivateRoutes />} />
    </Routes>
  );
};

export default App;
