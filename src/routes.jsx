import {
  HomeIcon,
  UserCircleIcon,
  UsersIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  PresentationChartBarIcon,
  ArchiveBoxIcon,
  DocumentPlusIcon,
  FolderPlusIcon,
  FolderIcon
} from "@heroicons/react/24/solid";
import { Requirements, Profile, ListRequirements,
   Notifications, NewProject,NewProjectCode ,AssingResponible} from "@/pages/dashboard";//AssingResponible
import { SignIn, SignUp } from "@/pages/auth";
import { PERMISSIONS } from "@/config/Roles";
const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
        {
        icon: <FolderIcon  {...icon} />,
        name: "Proyectos",
        path: "/Proyectos",
        permission: [PERMISSIONS.ENCARGADO,"ADMINSUPER"],
        element:<Requirements />,
        subPages:[
          {
            icon: <FolderPlusIcon  {...icon} />,
            name: "Proyectos",
            path: "/Projects",
            permission: ["ADMINSUPER", "GERENTE GENERAL","DIRECTOR PROYECTO"],
            element: <NewProject />,
          },
           {
            icon: <DocumentPlusIcon  {...icon} />,
            name: "Codigo Proyecto",
            path: "/Project_Code",
            permission: ["ADMINSUPER", "GERENTE GENERAL","DIRECTOR PROYECTO"],
            element: <NewProjectCode />,
          },
           {
            icon: <DocumentPlusIcon  {...icon} />,
            name: "Responsable",
            path: "/Responsables",
            permission: ["ADMINSUPER","DIRECTOR PROYECTO", "GERENTE GENERAL","DIRECTOR COMPRAS","TÉCNICO RESPONSABLE"],
            element: <AssingResponible />,
          }
        ]
      },
      {
        icon: <ArchiveBoxIcon  {...icon} />,
        name: "Requerimientos",
        path: "/Requerimiento",
        element:<Requirements />,
        subPages:[
          {
            icon: <DocumentPlusIcon  {...icon} />,
            name: "Requerimiento",
            path: "/Requerimiento",
            element: <Requirements />,
          },
           {
            icon: <TableCellsIcon  {...icon} />,
            name: "Listado de requerimiento",
            path: "/Lista_Requerimientos",
            element: <ListRequirements />,
          }
        ]
      },
      {
        icon: <PresentationChartBarIcon {...icon} />,
        name: "Historico",
        path: "/historico",
        element: <Profile />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Notifications />,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <UserCircleIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <UsersIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
