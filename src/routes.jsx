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
  FolderIcon,
  NewspaperIcon
} from "@heroicons/react/24/solid";
import {
  Requirements, Profile, ListRequirements,
  Notifications, NewProject, NewProjectCode, AssingResponible, AssignManager,
  AssignQuoteResponsibles, Quotes, TechnicalInspection
} from "@/pages/dashboard";//AssingResponible
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
        permission: [PERMISSIONS.ENCARGADO, "ADMINSUPER"],
        element: <Requirements />,
        subPages: [
          {
            icon: <FolderPlusIcon  {...icon} />,
            name: "Proyectos",
            path: "/Projects",
            permission: ["ADMINSUPER", "GERENTE PROYECTO", "GERENTE GENERAL", "DIRECTOR PROYECTO"],
            element: <NewProject />,
          },
          {
            icon: <DocumentPlusIcon  {...icon} />,
            name: "Codigo Proyecto",
            path: "/Project_Code",
            permission: ["ADMINSUPER", "GERENTE PROYECTO", "GERENTE GENERAL", "DIRECTOR PROYECTO"],
            element: <NewProjectCode />,
          },
          {
            icon: <DocumentPlusIcon  {...icon} />,
            name: "Responsable",
            path: "/Responsables",
            permission: ["ADMINSUPER", "DIRECTOR PROYECTO", "GERENTE PROYECTO", "GERENTE GENERAL", "DIRECTOR COMPRAS", "TÉCNICO RESPONSABLE"],
            element: <AssingResponible />,
          }
        ]
      },
      {
        icon: <ArchiveBoxIcon  {...icon} />,
        name: "Requerimientos",
        path: "/Requerimiento",
        element: <Requirements />,
        subPages: [
          {
            icon: <DocumentPlusIcon  {...icon} />,
            name: "Requerimiento",
            path: "/Requerimiento",
            permission: ["ADMINSUPER", "DIRECTOR COMPRAS", "TÉCNICO RESPONSABLE", "COLABORADOR"],
            element: <Requirements />,
          },
          {
            icon: <TableCellsIcon  {...icon} />,
            name: "Listado de requerimiento",
            path: "/Lista_Requerimientos",
            permission: ["ADMINSUPER", "DIRECTOR COMPRAS", "TÉCNICO RESPONSABLE"],
            element: <ListRequirements />,
          }
        ]
      },
      {
        icon: <NewspaperIcon  {...icon} />,
        name: "Cotizaciones",
        path: "/Cotizacion",
        element: <Requirements />,
        subPages: [
          {
            icon: <FolderPlusIcon {...icon} />,
            name: "Asignar Gestor de Facturación",
            hide: true,
            path: "/Gestor_Cotizacion/:requirementId",
            element: <AssignManager />,
          },
          {
            icon: <FolderPlusIcon {...icon} />,
            name: "Asignar Responsables Facturación",
            hide: true,
            path: "/Responsables_Cotizacion/:requirementId",
            element: <AssignQuoteResponsibles />,
          },
          {
            icon: <TableCellsIcon  {...icon} />,
            name: "Cotización",
            path: "/Cotizacion/:requirementId",
            hide: true,
            permission: ["ADMINSUPER", "DIRECTOR COMPRAS", "TÉCNICO RESPONSABLE"],
            element: <Quotes />,
          },
          {
            icon: <DocumentPlusIcon  {...icon} />,
            name: "Cotización",
            path: "/Cotizacion",
            permission: ["ADMINSUPER", "DIRECTOR COMPRAS", "TÉCNICO RESPONSABLE"],
            element: <Quotes />,
          },
          {
            icon: <DocumentPlusIcon  {...icon} />,
            name: "Inspección Técnica",
            path: "/Inspeccion_Tecnica/:requirementId",
            hide: true,
            permission: ["ADMINSUPER", "DIRECTOR COMPRAS", "TÉCNICO RESPONSABLE"],
            element: <TechnicalInspection />,
          },
          {
            icon: <DocumentPlusIcon  {...icon} />,
            name: "Inspección Técnica",
            path: "/Inspeccion_Tecnica",
            permission: ["ADMINSUPER", "DIRECTOR COMPRAS", "TÉCNICO RESPONSABLE"],
            element: <TechnicalInspection />,
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
