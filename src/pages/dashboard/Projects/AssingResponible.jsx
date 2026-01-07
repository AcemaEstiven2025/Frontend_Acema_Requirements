import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Select,
  Option,
  Input,
  Button,
  Typography,
  Progress,
} from "@material-tailwind/react";
import axios from "axios";
import Swal from "sweetalert2";

export function AssingResponible() {
  /* -------------------- STATES -------------------- */
  const [projects, setProjects] = useState([]);
  const [codePurchasing, setCodePurchasing] = useState([]);
  const [users, setUsers] = useState([]);
  const [infocomplete, setInfocomplete] = useState([]);

  const [selectedProject, setSelectedProject] = useState("");
  const [assignedCodes, setAssignedCodes] = useState([
    { ID_CodeProjPurch: "" },
  ]);
  const [assignedUsers, setAssignedUsers] = useState([{ ID_User: "" }]);

  const [searchCode, setSearchCode] = useState("");
  const [searchUser, setSearchUser] = useState("");

  const [errors, setErrors] = useState({
    project: "",
    codes: [],
    users: [],
  });

  /* -------------------- LOAD DATA -------------------- */
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await axios.get("/form/responsibleassignment", {
          withCredentials: true,
        });
        const res2 = await axios.get("/form/info", {
          withCredentials: true,
        });
        setInfocomplete(res.data.data || []);

        const projectList = (res.data.data || [])
          .map((item) => item.project)
          .filter(Boolean);

        setProjects(projectList);
        setUsers(res2.data.users || []);
      } catch (error) {
        console.error("Error loading data", error);
      }
    };

    loadData();
  }, []);

  /* -------------------- LOAD CODES BY PROJECT -------------------- */
  useEffect(() => {
    if (!selectedProject) {
      setCodePurchasing([]);
      return;
    }

    const projectSelected = infocomplete.find(
      (item) =>
        item.project &&
        item.project.ID &&
        item.project.ID.toString() === selectedProject,
    );

    if (projectSelected) {
      setCodePurchasing(projectSelected.codes || []);
    } else {
      setCodePurchasing([]);
    }
  }, [selectedProject, infocomplete]);

  /* -------------------- HANDLERS -------------------- */
  const handleChange = (list, setList, index, field, value) => {
    const newList = [...list];
    newList[index][field] = value;
    setList(newList);

    // Reset errors
    if (field === "ID_CodeProjPurch") {
      setErrors((prev) => {
        const copy = [...prev.codes];
        copy[index] = "";
        return { ...prev, codes: copy };
      });
    }

    if (field === "ID_User") {
      setErrors((prev) => {
        const copy = [...prev.users];
        copy[index] = "";
        return { ...prev, users: copy };
      });
    }
  };

  const addRow = (list, setList, defaultItem, errorField) => {
    setList([...list, defaultItem]);
    if (errorField)
      setErrors((prev) => ({
        ...prev,
        [errorField]: [...prev[errorField], ""],
      }));
  };

  const removeRow = (list, setList, index, errorField) => {
    setList(list.filter((_, i) => i !== index));
    if (errorField)
      setErrors((prev) => {
        const copy = [...prev[errorField]];
        copy.splice(index, 1);
        return { ...prev, [errorField]: copy };
      });
  };

  /* -------------------- FILTERS -------------------- */
  const filteredCodes = codePurchasing.filter((c) =>
    c.Code_Purchasing?.toLowerCase().includes(searchCode.toLowerCase()),
  );

  const filteredUsers = users.filter((u) =>
    u.Name?.toLowerCase().includes(searchUser.toLowerCase()),
  );

  /* -------------------- PROGRESS -------------------- */
  const totalFields = assignedCodes.length + assignedUsers.length + 1;
  const completedFields =
    (selectedProject ? 1 : 0) +
    assignedCodes.filter((c) => c.ID_CodeProjPurch).length +
    assignedUsers.filter((u) => u.ID_User).length;

  const progress = Math.round((completedFields / totalFields) * 100);

  // -------------------- VALIDACIÓN --------------------
  const validateAssignment = () => {
    let hasError = false;

    const newErrors = { project: "", codes: [], users: [] };

    // Validar proyecto
    if (!selectedProject) {
      newErrors.project = "Debes seleccionar un proyecto";
      hasError = true;
    }

    // Validar códigos
    const codeIds = assignedCodes.map((c) => c.ID_CodeProjPurch);
    assignedCodes.forEach((c, i) => {
      if (!c.ID_CodeProjPurch) {
        newErrors.codes[i] = "Selecciona un código";
        hasError = true;
      } else if (codeIds.indexOf(c.ID_CodeProjPurch) !== i) {
        newErrors.codes[i] = "Código duplicado";
        hasError = true;
      } else {
        newErrors.codes[i] = "";
      }
    });

    // Validar usuarios
    const userIds = assignedUsers.map((u) => u.ID_User);
    assignedUsers.forEach((u, i) => {
      if (!u.ID_User) {
        newErrors.users[i] = "Selecciona un usuario";
        hasError = true;
      } else if (userIds.indexOf(u.ID_User) !== i) {
        newErrors.users[i] = "Usuario duplicado";
        hasError = true;
      } else {
        newErrors.users[i] = "";
      }
    });

    return { hasError, newErrors };
  };

  // -------------------- HANDLE SUBMIT --------------------
  const handleSubmit = async () => {
    const { hasError, newErrors } = validateAssignment(); // <--- no parámetros, usa estados locales
    setErrors(newErrors);

    if (hasError) return;

    // SweetAlert2 Confirm
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

    const result = await swalWithTailwind.fire({
      title: "¿Estás seguro?",
      text: "Se asignarán los códigos y usuarios seleccionados",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "SI, asignar!",
      cancelButtonText: "No, cancelar!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      const payload = {
        ID_User: assignedUsers.map((u) => u.ID_User).filter(Boolean),
        ID_CodeProjPurch: assignedCodes
          .map((c) => c.ID_CodeProjPurch)
          .filter(Boolean),
      };

      try {
        const response = await axios.post("/form/requirementauth", payload, {
          withCredentials: true,
        });
        console.log(response);
        if (response.status === 200 || response.status === 201 ) {
          swalWithTailwind.fire({
            title: "Asignación exitosa",
            text: "Usuarios asignados correctamente 👌",
            icon: "success",
            confirmButtonText: "OK",
          });
          // Resetear
          setAssignedCodes([{ ID_CodeProjPurch: "" }]);
          setAssignedUsers([{ ID_User: "" }]);
          setSelectedProject("");
          setCodePurchasing([]);
          setErrors({ project: "", codes: [], users: [] });
        }
      } catch (err) {
        swalWithTailwind.fire({
          title: "Error",
          text: "Ocurrió un error en el envío",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <Card className="mx-auto mt-10 w-full max-w-5xl">
      <CardHeader floated={false} shadow={false} className="p-6">
        <Typography variant="h4">
          Asignar Responsables a Códigos de Compra
        </Typography>
        <div className="mt-2 text-sm text-blue-gray-600">
          Solo el encargado puede asignar personas a los códigos de compra
        </div>
        <div className="mt-4">
          <Progress value={progress} color="green" label={`${progress}%`} />
        </div>
      </CardHeader>

      <CardBody className="flex flex-col gap-6">
        {/* ------------------ PROJECT ------------------ */}
        <div>
          <Typography className="mb-2 font-semibold">Project</Typography>

          <Select
            label={errors.project ? errors.project : "Seleccionar Proyecto"}
            value={selectedProject}
            onChange={(val) => {
              setSelectedProject(val);
              setErrors((prev) => ({ ...prev, project: "" }));
            }}
            selected={() =>
              projects.find((p) => p.ID.toString() === selectedProject)
                ?.Name_Project
            }
            menuProps={{
              className: "p-2 max-h-48 overflow-auto",
              style: { zIndex: 9999 },
            }}
            className={`w-full ${
              errors.project
                ? "border-red-500 text-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-blue-400"
            }`}
          >
            {projects.map((p) => (
              <Option key={p.ID} value={p.ID.toString()}>
                {p.Name_Project}
              </Option>
            ))}
          </Select>
        </div>

        {/* ------------------ CÓDIGOS ------------------ */}
        <div>
          <Typography className="mb-2 font-semibold">
            Códigos de Compra
          </Typography>
          {assignedCodes.map((row, i) => {
            const selectedCode = codePurchasing.find(
              (c) => c.Id.toString() === row.ID_CodeProjPurch?.toString(),
            );
            return (
              <div
                key={i}
                className="mb-2 flex flex-col gap-3 md:flex-row md:items-end"
              >
                <Select
                  label={errors.codes[i] || "Código de Compra"}
                  value={
                    row.ID_CodeProjPurch ? row.ID_CodeProjPurch.toString() : ""
                  }
                  onChange={(val) =>
                    handleChange(
                      assignedCodes,
                      setAssignedCodes,
                      i,
                      "ID_CodeProjPurch",
                      val,
                    )
                  }
                  selected={() => selectedCode?.Code_Purchasing}
                  menuProps={{
                    className: "p-2 max-h-48 overflow-auto",
                    style: { zIndex: 9999 },
                  }}
                  className={`w-full ${
                    errors.codes[i]
                      ? "border-red-500 text-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-blue-400"
                  }`}
                >
                  <div className="sticky top-0 z-20 border-b border-gray-200 bg-white px-2 pb-2">
                    <Input
                      label="Buscar..."
                      value={searchCode}
                      onChange={(e) => setSearchCode(e.target.value)}
                      className="!text-sm"
                    />
                  </div>

                  {filteredCodes.length > 0 ? (
                    filteredCodes.map((c) => (
                      <Option key={c.Id} value={c.Id.toString()}>
                        {c.Code_Purchasing}
                      </Option>
                    ))
                  ) : (
                    <Option disabled>No hay resultados</Option>
                  )}
                </Select>

                {/*  Nombre del Pedido */}
                <Input
                  label="Nombre del Pedido"
                  value={selectedCode?.Name_Order || ""}
                  readOnly
                  className="w-full cursor-not-allowed bg-gray-300 text-gray-800"
                  style={{ backgroundColor: "#D1D5DB" }}
                />
                <div className="mt-2 flex gap-2 md:mt-0">
                  <Button
                    size="sm"
                    color="green"
                    onClick={() =>
                      addRow(
                        assignedCodes,
                        setAssignedCodes,
                        { ID_CodeProjPurch: "" },
                        "codes",
                      )
                    }
                  >
                    +
                  </Button>
                  {assignedCodes.length > 1 && (
                    <Button
                      size="sm"
                      color="red"
                      onClick={() =>
                        removeRow(assignedCodes, setAssignedCodes, i, "codes")
                      }
                    >
                      -
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ------------------ USUARIOS ------------------ */}
        <div>
          <Typography className="mb-2 font-semibold">Usuarios</Typography>
          {assignedUsers.map((row, i) => (
            <div key={i} className="mb-2 flex items-end gap-3">
              <Select
                label={errors.users[i] || "Usuario"}
                value={row.ID_User}
                onChange={(val) =>
                  handleChange(
                    assignedUsers,
                    setAssignedUsers,
                    i,
                    "ID_User",
                    val,
                  )
                }
                selected={() =>
                  users.find((u) => u.ID.toString() === row.ID_User)?.Name
                }
                menuProps={{
                  className: "p-2 max-h-48 overflow-auto",
                  style: { zIndex: 9999 },
                }}
                className={`w-full ${
                  errors.users[i]
                    ? "border-red-500 text-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-400"
                }`}
              >
                <div className="sticky top-0 z-20 border-b border-gray-200 bg-white px-2 pb-2">
                  <Input
                    label="Buscar..."
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    className="!text-sm"
                  />
                </div>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <Option key={u.ID} value={u.ID.toString()}>
                      {u.Name}
                    </Option>
                  ))
                ) : (
                  <Option disabled>No hay resultados</Option>
                )}
              </Select>

              <div className="flex flex-col gap-1">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    color="green"
                    onClick={() =>
                      addRow(
                        assignedUsers,
                        setAssignedUsers,
                        { ID_User: "" },
                        "users",
                      )
                    }
                  >
                    +
                  </Button>
                  {assignedUsers.length > 1 && (
                    <Button
                      size="sm"
                      color="red"
                      onClick={() =>
                        removeRow(assignedUsers, setAssignedUsers, i, "users")
                      }
                    >
                      -
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardBody>

      <CardFooter>
        <Button color="blue" fullWidth onClick={handleSubmit}>
          Asignar Responsables
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AssingResponible;
