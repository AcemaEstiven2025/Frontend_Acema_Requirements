// import PropTypes from "prop-types";
// import React, { useState } from "react";
// import { Link, NavLink } from "react-router-dom";
// import { XMarkIcon } from "@heroicons/react/24/outline";
// import {
//   Avatar,
//   Button,
//   IconButton,
//   Typography,
// } from "@material-tailwind/react";
// import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
// import { useMaterialTailwindController, setOpenSidenav } from "@/context";
// import { hasPermission } from "@/utils/permissions";




// export function Sidenav({ brandImg, brandName, routes }) {
//   const [controller, dispatch] = useMaterialTailwindController();
//   const { sidenavColor, sidenavType, openSidenav } = controller;
//   const { profile } = controller; //you already have it
// const role = profile?.role; // 👈 viene del backend
//   const sidenavTypes = {
//     dark: "bg-gradient-to-br from-gray-800 to-gray-900",
//     white: "bg-white shadow-sm",
//     transparent: "bg-transparent",
//   };
//   const normalizeColor = (color) => (color === "dark" ? "blue-gray" : color);
//   const [openMenus, setOpenMenus] = useState({});
//   const toggleMenu = (menuName) => {
//     setOpenMenus((prev) => ({
//       ...prev,
//       [menuName]: !prev[menuName], // alterna abierto/cerrado
//     }));
//   };

//   return (
//     <aside
//       className={`${sidenavTypes[sidenavType]} ${
//         openSidenav ? "translate-x-0" : "-translate-x-80"
//       } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl border border-blue-gray-100 transition-transform duration-300 xl:translate-x-0`}
//     >
//       <div className={`relative`}>
//         {/* <Link to="/" className="py-6 px-8 text-center"> */}
//         <Typography
//           variant="h6"
//           color={sidenavType === "dark" ? "white" : "blue-gray"}
//           className="px-8 py-6 text-center"
//         >
//           {brandName}
//         </Typography>
//         {/* </Link> */}
//         <IconButton
//           variant="text"
//           color="white"
//           size="sm"
//           ripple={false}
//           className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
//           onClick={() => setOpenSidenav(dispatch, false)}
//         >
//           <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
//         </IconButton>
//       </div>
//       <div className="m-4">
//         {routes.map(({ layout, title, pages }, key) => (
//           <ul key={key} className="mb-4 flex flex-col gap-1">
//             {title && (
//               <li className="mx-3.5 mb-2 mt-4">
//                 <Typography
//                   variant="small"
//                   color={sidenavType === "dark" ? "white" : "blue-gray"}
//                   className="font-black uppercase opacity-75"
//                 >
//                   {title}
//                 </Typography>
//               </li>
//             )}
//             {/* {pages.map(({ icon, name, path }) => (
//               <li key={name}>
//                 <NavLink to={`/${layout}${path}`}>
//                   {({ isActive }) => (
//                     <Button
//                       variant={isActive ? "gradient" : "text"}
//                       color={
//                         isActive
//                           ? normalizeColor(sidenavColor)
//                           : sidenavType === "dark"
//                             ? "white"
//                             : "blue-gray"
//                       }
//                       className="flex items-center gap-4 px-4 capitalize"
//                       fullWidth
//                     >
//                       {icon}
//                       <Typography
//                         color="inherit"
//                         className="font-medium capitalize"
//                       >
//                         {name}
//                       </Typography>
//                     </Button>
//                   )}
//                 </NavLink>
//               </li>
//             ))} */}

//            {pages
//   .filter((page) => hasPermission(role, page.permission))
//   .map((page) => (
//               <li key={page.name}>
//                 {page.subPages ? (
//                   <>
//                     {/* Botón del menú principal con subpáginas */}
//                     <Button
//                       variant="text"
//                       color={sidenavType === "dark" ? "white" : "blue-gray"}
//                       className="flex w-full items-center justify-between px-4 capitalize"
//                       fullWidth
//                       onClick={() => toggleMenu(page.name)}
//                     >
//                       <div className="flex items-center gap-4">
//                         {page.icon}
//                         <Typography
//                           color="inherit"
//                           className="font-medium capitalize"
//                         >
//                           {page.name}
//                         </Typography>
//                       </div>
//                       <span className="ml-auto">
//                         <ChevronUpIcon
//                           className={`h-4 w-4 transition-transform duration-300 ${
//                             openMenus[page.name] ? "rotate-180" : ""
//                           }`}
//                         />
//                       </span>
//                     </Button>

//                     {/* Submenú */}
//                     {openMenus[page.name] && (
//                       <ul className="ml-6 mt-2 flex flex-col gap-1">
//                         {page.subPages.map((sub) => (
//                           <li key={sub.name}>
//                             <NavLink to={`/${layout}${sub.path}`}>
                            
//                               {/* <Button
//                                 variant="text"
//                                 fullWidth
//                                 className="justify-start px-4"
//                               >
//                                 {sub.name}
//                               </Button> */}

//                                                   {({ isActive }) => (
//                       <Button
//                         variant={isActive ? "gradient" : "text"}
//                         color={
//                           isActive
//                             ? normalizeColor(sidenavColor)
//                             : sidenavType === "dark"
//                               ? "white"
//                               : "blue-gray"
//                         }
//                         className="flex items-center gap-4 px-4 capitalize"
//                         fullWidth
//                       >
//                         {sub.icon}
//                         <Typography
//                           color="inherit"
//                           className="font-medium capitalize"
//                         >
//                           {sub.name}
//                         </Typography>
//                       </Button>
//                     )}

                              
//                             </NavLink>
//                           </li>
//                         ))}
//                       </ul>
//                     )}
//                   </>
//                 ) : (
//                   // Si no hay subPages, ir directamente usando layout + path
//                   <NavLink to={`/${layout}${page.path}`}>
//                     {({ isActive }) => (
//                       <Button
//                         variant={isActive ? "gradient" : "text"}
//                         color={
//                           isActive
//                             ? normalizeColor(sidenavColor)
//                             : sidenavType === "dark"
//                               ? "white"
//                               : "blue-gray"
//                         }
//                         className="flex items-center gap-4 px-4 capitalize"
//                         fullWidth
//                       >
//                         {page.icon}
//                         <Typography
//                           color="inherit"
//                           className="font-medium capitalize"
//                         >
//                           {page.name}
//                         </Typography>
//                       </Button>
//                     )}
//                   </NavLink>
//                 )}
//               </li>
//             ))}
//           </ul>
//         ))}
//       </div>
//     </aside>
//   );
// }

// Sidenav.defaultProps = {
//   brandImg: "/img/logo-ct.png",
//   brandName: "ACEMA INGENIERIA",
// };

// Sidenav.propTypes = {
//   brandImg: PropTypes.string,
//   brandName: PropTypes.string,
//   routes: PropTypes.arrayOf(PropTypes.object).isRequired,
// };

// Sidenav.displayName = "/src/widgets/layout/sidnave.jsx";

// export default Sidenav;


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
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl border border-blue-gray-100 transition-transform duration-300 xl:translate-x-0`}
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
      <div className="m-4">
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
              .filter((page) => hasPermission(role, page.permission))
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
                              hasPermission(role, sub.permission)
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
