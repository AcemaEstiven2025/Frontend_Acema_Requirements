import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Button,
  Chip,
  Tooltip,
} from "@material-tailwind/react";
import {
  BuildingStorefrontIcon,
  UserCircleIcon,
  UserGroupIcon,
  DocumentIcon,
  TruckIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useMaterialTailwindController } from "@/context";
export function ListRequirements() {
   const [controller, dispatch, { doHistoryStatus }] =
      useMaterialTailwindController();
    const { historyStatus,loading,requirements } = controller;
  const [requirementGroup, setRequirementGroup] = useState(1); // default value
  const [generalInfo, setGeneralInfo] = useState({});
  const [data, setData] = useState([]);
 
  // Función para traer los datos
  const fetchData = async () => {
    try {
      const res = await doHistoryStatus(requirementGroup)
      const responseData = res.data;
      
      if (responseData[0]) {
        setData(responseData[0].Requirements);

        // Configurar info general según el primer requerimiento
        const first = responseData[0].Requirements[0];
        setGeneralInfo({
          "ID Project": {
            value: first.ID_Project,
            name: first.Name_Project?.Name_Project,
            icon: <BuildingStorefrontIcon className="h-6 w-6 text-white" />,
          },
          "ID User": {
            value: first.ID_User,
            name: first.applicant?.Name,
            icon: <UserCircleIcon className="h-6 w-6 text-white" />,
          },
          "Technical Resp.": {
            value: first.Technical_Resp,
            name: first.Resp_Technical?.Name,
            icon: <UserGroupIcon className="h-6 w-6 text-white" />,
          },
          "Technical Leader": {
            value: first.Technical_Leader,
            name: first.Leader_Technical?.Name,
            icon: <UserGroupIcon className="h-6 w-6 text-white" />,
          },
          "Dir Project": {
            value: first.Dir_Project,
            name: first.Project_Director?.Name,
            icon: <UserGroupIcon className="h-6 w-6 text-white" />,
          },
          "Formato ID": {
            value: first.ID_Formatos,
            name: first.Name_format?.Code_Format,
            icon: <DocumentIcon className="h-6 w-6 text-white" />,
          },
        });
      }
      
     
    } catch (error) {
      console.error(error);
      setData([]);
      setGeneralInfo({});
    }
  };

  useEffect(() => {
     if (!requirementGroup){
      setData([]);
      
     };
     
    fetchData();
  }, [requirementGroup]);

  const handleEdit = (id) => {
    alert(`Editar fila con ID: ${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Deseas eliminar este requerimiento?")) {
      setData((prev) => prev.filter((item) => item.ID !== id));
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case 1:
        return "blue";
      case 2:
        return "green";
      default:
        return "gray";
    }
  };

  const statusLabel = (status) => {
    switch (status) {
      case 1:
        return "Inicial";
      case 2:
        return "Asignación";
      case 3:
        return "Aprobado";
      default:
        return "Pendiente";
    }
  };

  const Loader = () => (
  <div className="flex items-center justify-center py-20">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
  </div>
);
   return (
  <div className="mt-12 mb-8 flex flex-col gap-12 px-4 lg:px-12">
    {/* INPUT PARA CAMBIAR REQUIREMENT_GROUP */}
    <div className="flex items-center gap-4 mb-6">
      <Typography className="font-semibold">Requirement Group:</Typography>
      <input
        type="number"
        value={requirementGroup}
        onChange={(e) => setRequirementGroup(e.target.value)}
        className="border border-gray-300 rounded-lg px-2 py-1"
      />
    </div>
    {!requirementGroup ? <><div>hola esta vacio</div></> : (
      <>
        {/* PANEL SUPERIOR - Información general */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(generalInfo).map(([label, { value, name, icon }]) => (
            <Card
              key={label}
              className="flex items-center gap-4 p-4 shadow-lg rounded-xl transition-transform hover:scale-105"
              style={{ backgroundColor: "#215BA0", color: "white" }}
            >
              <div className="p-3 rounded-full bg-white/20">{icon}</div>
              <div className="flex flex-col">
                <Typography variant="small" className="text-white font-semibold">
                  {label}
                </Typography>
                <Typography variant="h6" className="text-white font-bold mt-1">
                  {name || value}
                </Typography>
              </div>
            </Card>
          ))}
        </div>

        {/* TABLA INFERIOR - Editable */}
        <Card className="shadow-2xl rounded-xl border border-gray-200">
          <CardHeader
            variant="gradient"
            className="mb-4 p-6 rounded-t-xl"
            style={{ backgroundColor: "#40A335" }}
          >
            <Typography variant="h6" color="white" className="font-bold">
              Requerimientos Editables
            </Typography>
          </CardHeader>

          <CardBody className="px-4 pt-0 pb-4 w-full overflow-x-auto">
            <div className="min-w-[1000px]">
              <table className="w-full table-auto border-collapse text-left">
                <thead className="bg-[#215BA0] text-white">
                  <tr>
                    {[
                      "ID",
                      "Fecha",
                      "Suministro",
                      "Anexo",
                      "Unidad",
                      "Cantidad",
                      "Tipo de Gasto",
                      "Proveedor",
                      "Estado",
                      "Acciones",
                    ].map((el) => (
                      <th
                        key={el}
                        className="py-3 px-6 text-sm font-semibold uppercase tracking-wider whitespace-nowrap"
                      >
                        {el}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {data.map(
                    ({
                      ID,
                      Date_Requirement,
                      Supply,
                      Annex,
                      ID_Unit,
                      Quantity,
                      TypeExpense,
                      Supplier,
                      ID_Status,
                    }) => (
                      <tr
                        key={ID}
                        className="bg-white hover:bg-gray-50 transition-colors duration-200 border-b border-gray-200"
                      >
                        <td className="py-3 px-6 font-medium">{ID}</td>
                        <td className="py-3 px-6">{Date_Requirement}</td>

                        <td className="py-3 px-6">
                          <input
                            value={Supply}
                            onChange={(e) =>
                              setData((prev) =>
                                prev.map((item) =>
                                  item.ID === ID
                                    ? { ...item, Supply: e.target.value }
                                    : item
                                )
                              )
                            }
                            className="border rounded-lg px-2 py-1 w-full"
                          />
                        </td>

                        <td className="py-3 px-6">
                          <input
                            value={Annex}
                            onChange={(e) =>
                              setData((prev) =>
                                prev.map((item) =>
                                  item.ID === ID
                                    ? { ...item, Annex: e.target.value }
                                    : item
                                )
                              )
                            }
                            className="border rounded-lg px-2 py-1 w-full"
                          />
                        </td>

                        <td className="py-3 px-6">
                          <input
                            value={ID_Unit}
                            onChange={(e) =>
                              setData((prev) =>
                                prev.map((item) =>
                                  item.ID === ID
                                    ? { ...item, ID_Unit: e.target.value }
                                    : item
                                )
                              )
                            }
                            className="border rounded-lg px-2 py-1 w-full"
                          />
                        </td>

                        <td className="py-3 px-6">
                          <input
                            type="number"
                            value={Quantity}
                            onChange={(e) =>
                              setData((prev) =>
                                prev.map((item) =>
                                  item.ID === ID
                                    ? { ...item, Quantity: e.target.value }
                                    : item
                                )
                              )
                            }
                            className="border rounded-lg px-2 py-1 w-full"
                          />
                        </td>

                        <td className="py-3 px-6">
                          <input
                            value={TypeExpense?.Description || ""}
                            onChange={(e) =>
                              setData((prev) =>
                                prev.map((item) =>
                                  item.ID === ID
                                    ? {
                                        ...item,
                                        TypeExpense: {
                                          ...item.TypeExpense,
                                          Description: e.target.value,
                                        },
                                      }
                                    : item
                                )
                              )
                            }
                            className="border rounded-lg px-2 py-1 w-full"
                          />
                        </td>

                        <td className="py-3 px-6">
                          <input
                            value={Supplier?.Name_Supplier || ""}
                            onChange={(e) =>
                              setData((prev) =>
                                prev.map((item) =>
                                  item.ID === ID
                                    ? {
                                        ...item,
                                        Supplier: {
                                          ...item.Supplier,
                                          Name_Supplier: e.target.value,
                                        },
                                      }
                                    : item
                                )
                              )
                            }
                            className="border rounded-lg px-2 py-1 w-full"
                          />
                        </td>

                        <td className="py-3 px-6">
                          <Chip
                            variant="gradient"
                            color={statusColor(ID_Status)}
                            value={statusLabel(ID_Status)}
                          />
                        </td>

                        <td className="py-3 px-6 flex gap-2">
                          <Tooltip content="Editar">
                            <Button
                              size="sm"
                              color="blue"
                              onClick={() => handleEdit(ID)}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                          </Tooltip>
                          <Tooltip content="Eliminar">
                            <Button
                              size="sm"
                              color="red"
                              onClick={() => handleDelete(ID)}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </Tooltip>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </>
    )}
  </div>
);

}

export default ListRequirements;
