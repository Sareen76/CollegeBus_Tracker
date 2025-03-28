import * as React from "react";
import { extendTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MapIcon from '@mui/icons-material/Map'; 
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { CircleMarker } from "leaflet";

const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: "class",
});

// Custom Hook for managing navigation
function useDemoRouter() {
  const location = useLocation();
  const navigate = useNavigate();

  return React.useMemo(
    () => ({
      pathname: location.pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => navigate(path),
    }),
    [location, navigate]
  );
}



export default function DashboardLayoutBasic({ window }) {
  const router = useDemoRouter();
  const NAVIGATION = [
    { kind: "header", title: "Main Items" },
    {
      segment: "dashboard", // ✅ Use static segment instead of router.pathname
      title: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
      active: router.pathname === "/dashboard" || router.pathname === "/",
    },
    {
      segment: "home",
      title: "Home",
      icon: <ShoppingCartIcon />,
      path: "/home",
      active: router.pathname === "/home",
    },
    {
      segment: "livelocation",
      title: "Live Location",
      icon: <MapIcon />,
      path: "/livelocation",
      active: router.pathname === "/livelocation",
    },
    {
      segment: "addnewroute",
      title: "Add New Route",
      icon: <MapIcon />,
      path: "/addnewroute",
      active: router.pathname === "/addnewroute",
    },
    { kind: "divider" },
    { kind: "header", title: "Analytics" },
    {
      segment: "reports",
      title: "Reports",
      icon: <BarChartIcon />,
      children: [
        {
          segment: "sales",
          title: "Sales",
          icon: <DescriptionIcon />,
          path: "/reports/sales",
          active: router.pathname === "/reports/sales",
        },
        {
          segment: "traffic",
          title: "Traffic",
          icon: <DescriptionIcon />,
          path: "/reports/traffic",
          active: router.pathname === "/reports/traffic",
        },
      ],
    },
    {
      segment: "integrations",
      title: "Integrations",
      icon: <LayersIcon />,
      path: "/integrations",
      active: router.pathname === "/integrations",
    },
  ];
  
  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={window}
    >
      <DashboardLayout>
        {/* PageContainer will automatically handle breadcrumbs */}
        <PageContainer>
          <Outlet />
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
