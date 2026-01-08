import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Button,
  Chip,
  Tooltip,
  CardFooter,
  Select,
  Input,
  Option
} from "@material-tailwind/react";
import {
  BuildingStorefrontIcon,
  UserCircleIcon,
  UserGroupIcon,
  DocumentIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useMaterialTailwindController } from "@/context";
import { apiClient } from "@/utils/apiClient";
import Swal from "sweetalert2";

export function ListRequirements() {
  const ITEMS_PER_PAGE = 5;
  const [controller, dispatch, { doHistoryStatus }] = useMaterialTailwindController();
  const { historyStatus, loading, requirements } = controller;
  const [requirementGroup, setRequirementGroup] = useState(null);
  const [requirementsData, setRequirementData] = useState([]);
  const [searchRequirement, setSearchRequirement] = useState("");
  const [generalInfo, setGeneralInfo] = useState({});
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentRows = data.slice(indexOfFirstItem, indexOfLastItem);

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
            icon: <BuildingStorefrontIcon className="h-6 w-6 " />,
          },
          "ID User": {
            value: first.ID_User,
            name: first.applicant?.Name,
            icon: <UserCircleIcon className="h-6 w-6 " />,
          },
          "Technical Resp.": {
            value: first.Technical_Resp,
            name: first.Resp_Technical?.Name,
            icon: <UserGroupIcon className="h-6 w-6" />,
          },
          "Technical Leader": {
            value: first.Technical_Leader,
            name: first.Leader_Technical?.Name,
            icon: <UserGroupIcon className="h-6 w-6 " />,
          },
          "Dir Project": {
            value: first.Dir_Project,
            name: first.Project_Director?.Name,
            icon: <UserGroupIcon className="h-6 w-6 " />,
          },
          "Formato ID": {
            value: first.ID_Formatos,
            name: first.Name_format?.Code_Format,
            icon: <DocumentIcon className="h-6 w-6 " />,
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
    if (!requirementGroup) {
      setData([]);
    };

    fetchData();
  }, [requirementGroup]);

  useEffect(() => {
    const loadRequirementsAll = async () => {
      const response = await apiClient("/form/info");
      if (!response?.requirements) return;
      const requirements = response?.requirements?.map(requirement => {
        const projectFound = response?.projects?.find(project => project.ID == requirement.ID_Project);
        const codePurchasing = projectFound?.CodesProjectsPurchasing?.find(code => code.ID == requirement.ID_CodePurchasing);
        return {
          value: requirement.Requirement_Group,
          label: `${projectFound?.Name_Project} - ${codePurchasing?.Code_Purchasing} - Req No.${requirement.Requirement_Group}`,
        }
      });
      setRequirementData(requirements);
    };
    loadRequirementsAll();
  }, []);

  const swalWithTailwind = Swal.mixin({
    customClass: {
      popup: "rounded-xl p-4",
      title: "text-lg font-semibold text-gray-800",
      htmlContainer: "text-sm text-gray-600",
      confirmButton:
        "ml-10 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400",
      cancelButton:
        "mr-10 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400",
    },
    buttonsStyling: false,
  });

  const normalizeArray = (arr) =>
    Array.isArray(arr)
      ? arr.map((v) => (v === "" || v === undefined ? null : v))
      : [];

  const buildFormData = (form) => {
    const formData = new FormData();
    // 🔹 campos simples
    formData.append("Requirement_Group", form.Requirement_Group);
    formData.append("ID_Project", form.ID_Project);
    formData.append("ID_User", form.ID_User);
    formData.append("Technical_Resp", form.Technical_Resp);
    formData.append("Technical_Leader", form.Technical_Leader);
    formData.append("Dir_Project", form.Dir_Project);
    formData.append("ID_Formatos", form.ID_Formatos);
    formData.append("Date_Requirement", form.Date_Requirement);
    formData.append("ID_Status", form.ID_Status);
    formData.append("ID_CodePurchasing", form.ID_CodePurchasing);

    // 🔹 arrays NORMALIZADOS
    const Supply = normalizeArray(form.Supply);
    const Annex = normalizeArray(form.Annex);
    const ID_Unit = normalizeArray(form.ID_Unit);
    const Quantity = normalizeArray(form.Quantity);
    const ID_Expenses = normalizeArray(form.ID_Expenses);
    const ID_Suppliers = normalizeArray(form.ID_Suppliers);

    Supply.forEach((v, i) => {
      formData.append(`Supply[${i}]`, v ?? "");
    });

    ID_Unit.forEach((v, i) => {
      formData.append(`ID_Unit[${i}]`, v ?? "");
    });

    Quantity.forEach((v, i) => {
      formData.append(`Quantity[${i}]`, v ?? "");
    });

    ID_Expenses.forEach((v, i) => {
      formData.append(`ID_Expenses[${i}]`, v ?? "");
    });

    ID_Suppliers.forEach((v, i) => {
      formData.append(`ID_Suppliers[${i}]`, v ?? "");
    });

    // 🔹 Annex (archivo o texto)
    Annex.forEach((v, i) => {
      if (v instanceof File) {
        formData.append(`Annex[${i}]`, v);
      } else {
        formData.append(`AnnexText[${i}]`, v ?? "");
      }
    });
    return formData;
  };

  const handleEdit = (id) => {
    try {
      const item = data.find(item => item.ID == id);
      swalWithTailwind
        .fire({
          title: "Estas seguro de Editar este requerimiento",
          text: `Id del requerimiento: ${id}`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "SI, Editar!",
          cancelButtonText: "No, cancelar!",
          reverseButtons: true,
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            const formData = buildFormData(item);
            const { message, ok } = await apiClient.put(`/form/updaterequirement/${id}}`, formData);
            if (ok && message == "Requerimiento editado correctamente") {
              swalWithTailwind.fire({
                title: "EDITADO",
                text: "Requerimiento de compra editado exitosamente. 👌",
                icon: "success",
                confirmButtonText: "OK",
              });
            } else {
              swalWithTailwind.fire({
                title: "NO SE PUDO EDITAR",
                text: `No se pudo editar el requerimiento. ${message}`,
                icon: "info",
                confirmButtonText: "OK",
              });
            }
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithTailwind.fire({
              title: "CANCELADO",
              text: "EDICION CANCELADA 😢",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = (id) => {
    try {
      swalWithTailwind
        .fire({
          title: "Estas seguro de Eliminar este requerimiento",
          text: `Id del requerimiento: ${id}`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "SI, Eliminar!",
          cancelButtonText: "No, cancelar!",
          reverseButtons: true,
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            const { message, ok } = await apiClient.delete(`/form/deleterequirement/${id}`);
            if (ok && message == "Requerimiento eliminado correctamente") {
              setData((prev) => prev.filter((item) => item.ID !== id));
              swalWithTailwind.fire({
                title: "Eliminado",
                text: "Requerimiento eliminado exitosamente. 👌",
                icon: "success",
                confirmButtonText: "OK",
              });
            } else {
              swalWithTailwind.fire({
                title: "NO SE PUDO ELIMINAR",
                text: `No se pudo eliminar el requerimiento. ${message}`,
                icon: "info",
                confirmButtonText: "OK",
              });
            }
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithTailwind.fire({
              title: "CANCELADO",
              text: "ELIMINACIÓN CANCELADA 😢",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAll = () => {
    try {
      swalWithTailwind
        .fire({
          title: "Estas seguro de Eliminar el Requerimiento completo",
          text: `Se eliminaran todos los items`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "SI, Eliminar!",
          cancelButtonText: "No, cancelar!",
          reverseButtons: true,
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            const { message, ok } = await apiClient.delete(`/form/deleterequirement/group/${requirementGroup}`);
            if (ok && message == "Requerimiento eliminado correctamente") {
              setRequirementGroup(null)
              swalWithTailwind.fire({
                title: "Eliminado",
                text: "Requerimiento de compra eliminado exitosamente. 👌",
                icon: "success",
                confirmButtonText: "OK",
              });
            } else {
              swalWithTailwind.fire({
                title: "NO SE PUDO ELIMINAR",
                text: `No se pudo eliminar el requerimiento. ${message}`,
                icon: "info",
                confirmButtonText: "OK",
              });
            }
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithTailwind.fire({
              title: "CANCELADO",
              text: "ELIMINACIÓN CANCELADA 😢",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        });
    } catch (err) {
      console.error(err);
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
    <Card className="mx-auto mt-10 w-full max-w-5xl">
      <CardHeader floated={false} shadow={false} className="pt-6 px-6 pb-0">
        <Typography variant="h4">
          Lista de Requerimientos
        </Typography>
      </CardHeader>
      <CardBody className="mt-12 mb-8 flex flex-col gap-12 lg:px-12 pt-0">
        {/* INPUT PARA CAMBIAR REQUIREMENT_GROUP */}
        <div className="">
          <Select
            label="Número de Requerimiento"
            value={requirementGroup}
            onChange={(val) => setRequirementGroup(val)}
            selected={() =>
              requirementsData.find((r) => r.value.toString() === requirementGroup)?.label
            }
            menuProps={{
              className: "p-2 max-h-48 overflow-auto",
              style: { zIndex: 9999 },
            }}
            className={`w-full border-gray-300 focus:ring-blue-400`}
          >
            <div className="sticky top-0 z-20 border-b border-gray-200 bg-white px-2 pb-2">
              <Input
                label="Buscar..."
                value={searchRequirement}
                onChange={(e) => setSearchRequirement(e.target.value)}
                className="!text-sm"
              />
            </div>
            {requirementsData.length > 0 ? (
              requirementsData.map((r) => (
                <Option key={r.value} value={r.value.toString()}>
                  {r.label}
                </Option>
              ))
            ) : (
              <Option disabled>No hay resultados</Option>
            )}
          </Select>
        </div>
        <div>
          <Button color={requirementGroup ? "red" : "gray"} variant="outlined" disabled={!requirementGroup} onClick={() => handleDeleteAll()}>Eliminar requerimiento completo</Button>
        </div>
        {(
          <>
            {/* PANEL SUPERIOR - Información general */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Object.entries(generalInfo).map(([label, { value, name, icon }]) => (
                <Card
                  key={label}
                  className="grid grid-cols-[2rem_1fr] items-center gap-4 px-2 py-3 shadow-lg border-gray-200 border rounded-xl transition-transform hover:scale-105"
                >
                  <div className="p-3 rounded-full bg-white/20">{icon}</div>
                  <div className="flex flex-col">
                    <Typography variant="h6" className="font-bold">
                      {label}
                    </Typography>
                    <Typography variant="small" className="text-gray-500 font-semibold mt-1">
                      {name || value}
                    </Typography>
                  </div>
                </Card>
              ))}
            </div>

            {/* TABLA INFERIOR - Editable */}
            <Card className="">
              <CardBody className="overflow-x-scroll rounded-xl p-0">
                <table className="w-full min-w-max table-auto text-left rounded-sm">
                  <thead >
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
                          className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 text-center"
                        >
                          <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                            {el}
                          </Typography>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="overflow-scroll">
                    {currentRows.map(
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
                        Suggested_Suppliers
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
                              className="border rounded-lg px-2 py-1 w-full text-center"
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
                              className="border rounded-lg px-2 py-1 w-full text-center"
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
                              className="border rounded-lg px-2 py-1 w-full text-center"
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
                              className="border rounded-lg px-2 py-1 w-full text-center"
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
                              className="border rounded-lg px-2 py-1 w-full text-center"
                            />
                          </td>

                          <td className="py-3 px-6">
                            <input
                              value={Suggested_Suppliers || ""}
                              onChange={(e) =>
                                setData((prev) =>
                                  prev.map((item) =>
                                    item.ID === ID
                                      ? {
                                        ...item,
                                        Suggested_Suppliers: e.target.value,
                                      }
                                      : item
                                  )
                                )
                              }
                              className="border rounded-lg px-2 py-1 w-full text-center"
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
              </CardBody>
              <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                <Typography variant="small" color="blue-gray" className="font-normal">
                  Página {currentPage} de {totalPages || 1}
                </Typography>
                <div className="flex gap-2">
                  <Button
                    variant={currentPage === 1 ? "outlined" : "gradient"}
                    size="sm"
                    color="blue"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant={currentPage === totalPages || totalPages === 0 ? "outlined" : "gradient"}
                    size="sm"
                    color="blue"
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    Siguiente
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </>
        )}
      </CardBody>
    </Card>

  );

}

export default ListRequirements;
