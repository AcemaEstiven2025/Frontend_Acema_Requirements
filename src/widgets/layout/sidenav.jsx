import PropTypes from "prop-types";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { hasPermission } from "@/utils/permissions";

export function Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav, profile } = controller;

  const role = profile?.nameRol?.trim().toUpperCase(); 
  const [openMenus, setOpenMenus] = useState({});
  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };

  const normalizeColor = (color) => (color === "dark" ? "blue-gray" : color);

  const toggleMenu = (menuName) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  return (
    <aside
      className={`${sidenavTypes[sidenavType]} ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl border border-blue-gray-100 transition-transform duration-300 xl:translate-x-0 flex flex-col`}
    >
      {/* HEADER */}
      <div className="relative">
        <Typography
          variant="h6"
          color={sidenavType === "dark" ? "white" : "blue-gray"}
          className="px-8 py-6 text-center"
        >
          {brandName}
        </Typography>

        <IconButton
          variant="text"
          color="white"
          size="sm"
          className="absolute right-0 top-0 xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon className="h-5 w-5" />
        </IconButton>
      </div>

      {/* MENU */}
      <div className="m-4 overflow-auto">
        {routes.map(({ layout, title, pages }, key) => (
          <ul key={key} className="mb-4 flex flex-col gap-1">
            {title && (
              <li className="mx-3.5 mb-2 mt-4">
                <Typography
                  variant="small"
                  color={sidenavType === "dark" ? "white" : "blue-gray"}
                  className="font-black uppercase opacity-75"
                >
                  {title}
                </Typography>
              </li>
            )}

            {pages
              .filter((page) => hasPermission(role, page.permission) && !page.hide)
              .map((page) => (
                <li key={page.name}>
                  {page.subPages ? (
                    <>
                      {/* MENU PADRE */}
                      <Button
                        variant="text"
                        color={sidenavType === "dark" ? "white" : "blue-gray"}
                        className="flex w-full items-center justify-between px-4 capitalize"
                        onClick={() => toggleMenu(page.name)}
                      >
                        <div className="flex items-center gap-4">
                          {page.icon}
                          <Typography className="font-medium capitalize">
                            {page.name}
                          </Typography>
                        </div>
                        <ChevronUpIcon
                          className={`h-4 w-4 transition-transform ${
                            openMenus[page.name] ? "rotate-180" : ""
                          }`}
                        />
                      </Button>

                      {/* SUBMENÚ */}
                      {openMenus[page.name] && (
                        <ul className="ml-6 mt-2 flex flex-col gap-1">
                          {page.subPages
                            .filter((sub) =>
                              hasPermission(role, sub.permission) && !sub.hide
                            )
                            .map((sub) => (
                              <li key={sub.name}>
                                <NavLink to={`/${layout}${sub.path}`}>
                                  {({ isActive }) => (
                                    <Button
                                      variant={isActive ? "gradient" : "text"}
                                      color={
                                        isActive
                                          ? normalizeColor(sidenavColor)
                                          : sidenavType === "dark"
                                          ? "white"
                                          : "blue-gray"
                                      }
                                      className="flex items-center gap-4 px-4 capitalize"
                                      fullWidth
                                    >
                                      {sub.icon}
                                      <Typography className="font-medium capitalize">
                                        {sub.name}
                                      </Typography>
                                    </Button>
                                  )}
                                </NavLink>
                              </li>
                            ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    /* MENU SIMPLE */
                    <NavLink to={`/${layout}${page.path}`}>
                      {({ isActive }) => (
                        <Button
                          variant={isActive ? "gradient" : "text"}
                          color={
                            isActive
                              ? normalizeColor(sidenavColor)
                              : sidenavType === "dark"
                              ? "white"
                              : "blue-gray"
                          }
                          className="flex items-center gap-4 px-4 capitalize"
                          fullWidth
                        >
                          {page.icon}
                          <Typography className="font-medium capitalize">
                            {page.name}
                          </Typography>
                        </Button>
                      )}
                    </NavLink>
                  )}
                </li>
              ))}
          </ul>
        ))}
      </div>
    </aside>
  );
}

Sidenav.defaultProps = {
  brandImg: "/img/logo-ct.png",
  brandName: "ACEMA INGENIERIA",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
