import { Routes, Route } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";
import { useMaterialTailwindController, setOpenConfigurator, setOpenSidenav } from "@/context";
import Welcome from "@/pages/dashboard/Welcome";

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;

  const getDashboardRoutes = (routes) => {
    const result = [];

    routes.forEach(({ layout, pages }) => {
      if (layout !== "dashboard") return;

      pages.forEach((page) => {
        // Página normal (sin subPages)
        if (!page.subPages) {
          result.push({
            path: page.path,
            element: page.element,
          });
        }

        // SubPages
        if (page.subPages) {
          page.subPages.forEach((sub) => {
            result.push({
              path: sub.path,
              element: sub.element,
            });
          });
        }
      });
    });

    return result;
  };

  return (
    <div className="min-h-screen bg-blue-gray-50/50" >
      <Sidenav
        routes={routes}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />
      <div
        className="p-4 xl:ml-80"
      >
        <DashboardNavbar />
        <Configurator />
        <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton>

        <Routes>
          {/* Ruta por defecto */}
          <Route index element={<Welcome />} />

          {getDashboardRoutes(routes).map(({ path, element }) => (
            <Route key={path} path={path} element={
              <div
                className="size-full"
                onClick={() => setOpenSidenav(dispatch, false)}
              >
                {element}
              </div>
            } />
          ))}
        </Routes>

        <div className="text-blue-gray-600">
          <Footer />
        </div>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
