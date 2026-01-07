import axios from "axios";
import React, { useRef, useEffect, useState } from "react";
import HomeScroll from "./RequirementsScroll";
import {
  ArrowDownTrayIcon
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select,
  Option,
  Textarea,
  Progress,
} from "@material-tailwind/react";
import { useMaterialTailwindController, setRequirements } from "@/context";
import Swal from "sweetalert2";
import { object } from "prop-types";
import { apiClient } from "@/utils/apiClient";

export function Requirements() {
  const [controller, dispatch, { doCreateRequirement, doChangeStatus }] = useMaterialTailwindController();
  const { profile, requirements } = controller;
  const navigate = useNavigate();
  const firstButtonRef = useRef(null);
  // --- Local states ---

  // -- Estado inicial del Formulario
  const initialForm = {
    Requirement_Group: "",
    ID_CodePurchasing: "",
    ID_Project: "",
    ID_User: profile.id.toString(),

    Supply: [""],
    ID_Unit: [""],
    Quantity: [""],
    ID_Expenses: [""],
    Suggested_Suppliers: [""],

    Annex: [""],
    Technical_Resp: "",
    Technical_Leader: "8",
    Dir_Project: "",
    Date_Requirement: new Date().toISOString().split("T")[0],
    ID_Formatos: "1",
    ID_Status: "1",
  };
  const [form, setForm] = useState(initialForm);

  // ---- manejo del modal -----
  const [openModal, setOpenModal] = useState(true); // For selection modal
  const [showForm, setShowForm] = useState(false); // To display the form
  const [requerimentExists, setRequerimentExists] = useState(false); // to check if requirement exists

  // ------- Filtered Search Statuses
  const [searchProject, setSearchProject] = useState(""); // status to search for projects
  const [searchCodePurchasing, setSearchCodePurchasing] = useState(""); // status to search of search projects
  const [searchUnits, setSearchUnits] = useState(""); // status to search for units
  const [searchTypeEspenses, setSearchTypeEspenses] = useState(""); // status to search for type expenses
  const [searchFormats, setSearchFormats] = useState(""); // status to search for formats
  const [searchSupplies, setSearchSupplies] = useState(""); // status to search for Supplies
  const [searchRequirements, setSearchRequirements] = useState(""); // status to search for Requirements
  // ---- SEARCH USERS
  const [searchUser, setSearchUser] = useState(""); //status to search for users
  const [searchGeneralManager, setSearchGeneralManager] = useState(""); // status to search for General Manager // no se utiliza aun
  const [searchGeneralProject, setSearchGeneralProject] = useState(""); // status to search for General Project // no se utiliza aun
  const [searchProjectManager, setSearchProjectManager] = useState(""); // status to search for Project Manager
  const [searchTechManager, setSearchTechManager] = useState(""); // status to search for Technical Manager
  const [searchTechLead, setSearchTechLead] = useState(""); // status to search for Technical leader

  // ------- Database information storage statuses
  const [projectInfo, setProjectInfo] = useState([]); // stores bd projects
  const [codePurchasingInfo, setCodePurchasingInfo] = useState([]); // se valida con el proyecto seleccionado
  const [unitsInfo, setUntsInfo] = useState([]); //store bd units
  const [typeEspensesInfo, settypeEspensesInfo] = useState([]); //store bd typeespenses
  const [formatsInfo, setFormatsInfo] = useState([]); // store bd formats
  const [suppliesInfo, setSuppliesInfo] = useState([]); // store bd Supplies
  const [requirementsInfo, setRequirementsInfo] = useState([]); // store bd Requirements
  // ----- USUARIOS INFO--------
  const [userInfo, setUserInfo] = useState([]); // stores bd users
  const [generalManagerInfo, setGeneralManagerInfo] = useState([]); //store bd General Manager // no se utiliza aun
  const [generalProjectInfo, setGeneralProjectInfo] = useState([]); //store bd General Project // no se utiliza aun
  const [projectManagerInfo, setProjectManagerInfo] = useState([]); //store bd Project Manager
  const [TechManagerInfo, setTechManagerInfo] = useState([]); //store bd Technical Manager
  const [TechLeadInfo, setTechLeadInfo] = useState([]); //store bd Technical Leader

  // --- Manejo de errores
  const [errors, setErrors] = useState({});
  // --- Manejo de  agregado de ITEMS
  const [annexType, setAnnexType] = useState({});

  // --- Manejo de paginacion
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (openModal) {
      setTimeout(() => {
        firstButtonRef.current?.focus();
      }, 0);
    }
  }, [openModal]);

  // Cantidad de ITEMS para mostrar
  const itemsPerPageOptions = [4, 8, 10, 50];

  const totalItems = form.Supply.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedSupply = form.Supply.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  // -- store the information in the states once the component is loaded
  useEffect(() => {
    const Searchinfo = async () => {
      const response = await axios.get("/form/info", { withCredentials: true });

      setRequirementsInfo(response.data.requirements);
      setRequirements(dispatch, response.data.requirements); // SE GUARDAN LOS REQUERIMIENTOS EN ESTADO GLOBAL

      setProjectInfo(response.data.projects);
      setUntsInfo(response.data.units);
      settypeEspensesInfo(response.data.typeEspenses);
      setFormatsInfo(response.data.formats);
      setSuppliesInfo(response.data.supplies);
      // --- USERS ROLES
      setUserInfo(response.data.users);
      // setGeneralManagerInfo(response.data.userGeneralManager); // not used yet
      // setGeneralProjectInfo(response.data.userGeneralProject); // not used yet
      setProjectManagerInfo(response.data.userProjeManager);
      setTechManagerInfo(response.data.userTechManager);
      setTechLeadInfo(response.data.userTechLead);
    };
    Searchinfo();
  }, [showForm]);

  //  --------- SEARCH FILTERS FOR DROPDOWNS
  const filteredRequirements = requirementsInfo?.filter((r) =>
    r.Requirement_Group?.toString()
      .toLowerCase()
      .includes(searchRequirements.toString().toLowerCase()),
  );

  const filteredProjects = projectInfo?.filter((p) =>
    p.Name_Project?.toLowerCase().includes(searchProject.toLowerCase()),
  );
  const filteredUnits = unitsInfo?.filter((un) =>
    un.Description?.toLowerCase().includes(searchUnits.toLowerCase()),
  );
  const filteredTypesEspenses = typeEspensesInfo?.filter((te) =>
    te.Description?.toLowerCase().includes(searchTypeEspenses.toLowerCase()),
  );
  const filteredFormats = formatsInfo?.filter((frm) =>
    frm.Code_Format?.toLowerCase().includes(searchFormats.toLowerCase()),
  );
  const filteredSuppliers = suppliesInfo?.filter((sup) =>
    sup.Name_Supplier?.toLowerCase().includes(searchSupplies.toLowerCase()),
  );

  //--- USER ROLES
  const filteredUsers = userInfo?.filter((u) =>
    u.Name?.toLowerCase().includes(searchUser.toLowerCase()),
  );
  const filteredGeGeneralManager = generalManagerInfo?.filter((gm) =>
    gm.Name?.toLowerCase().includes(searchGeneralManager.toLowerCase()),
  );
  const filteredGeneralProject = generalProjectInfo?.filter((gp) =>
    gp.Name?.toLowerCase().includes(searchGeneralProject.toLowerCase()),
  );
  const filteredProjeManager = projectManagerInfo?.filter((pm) =>
    pm.Name?.toLowerCase().includes(searchProjectManager.toLowerCase()),
  );
  const filteredTechManager = TechManagerInfo?.filter((tm) =>
    tm.Name?.toLowerCase().includes(searchTechManager.toLowerCase()),
  );
  const filteredTechLead = TechLeadInfo?.filter((tl) =>
    tl.Name?.toLowerCase().includes(searchTechLead.toLowerCase()),
  );

  // --- onchange para el formulario
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    if (requerimentExists && e.target.name === "Requirement_Group") {
      const r = requirementsInfo.find(
        (x) => x.Requirement_Group.toString() === e.target.value,
      );

      const p = projectInfo.find(
        (x) => x.ID.toString() == r.ID_Project.toString(),
      );
      let code = "";
      if (p) {
        setCodePurchasingInfo(p.CodesProjectsPurchasing);
        code = p.CodesProjectsPurchasing.find(
          (c) => c.ID.toString() == r.ID_CodePurchasing,
        );
      }
      if (r) {
        setForm((prev) => ({
          ...prev,
          Requirement_Group: e.target.value,
          ID_Project: r.ID_Project.toString(),
          ID_Formatos: r.ID_Formatos.toString(),
          Dir_Project: r.Dir_Project.toString(),
          Technical_Resp: r.Technical_Resp.toString(),
          Technical_Leader: r.Technical_Leader.toString(),
          ID_CodePurchasing: code.ID.toString(),
        }));
      }
    }
    if (!requerimentExists && e.target.name == "ID_Project") {
      const p = projectInfo.find((x) => x.ID.toString() == e.target.value);
      if (p) {
        setCodePurchasingInfo(p.CodesProjectsPurchasing);
      }
    }
  };
  const filteredCodePurchasing = codePurchasingInfo?.filter((cp) =>
    cp.Code_Purchasing?.toLowerCase().includes(
      searchCodePurchasing.toLowerCase(),
    ),
  );

  /* ---------- ARRAY HANDLERS (+ / -) ---------- */

  const handleArrayChange = (index, field, value) => {
    setForm((prev) => {
      const updated = [...prev[field]];
      updated[index] = value;

      return {
        ...prev,
        [field]: updated,
      };
    });

    //  limpiar solo ese índice
    setErrors((prev) => {
      if (!prev[field]) return prev;

      const copy = { ...prev };
      const fieldErrors = [...(copy[field] || [])];
      fieldErrors[index] = null;

      if (fieldErrors.every((e) => !e)) {
        delete copy[field];
      } else {
        copy[field] = fieldErrors;
      }

      return copy;
    });
  };

  // --- Agregar un ITEM
  const addRow = () => {
    setForm((prev) => ({
      ...prev,
      Supply: [...prev.Supply, ""],
      ID_Unit: [...prev.ID_Unit, ""],
      Quantity: [...prev.Quantity, ""],
      ID_Expenses: [...prev.ID_Expenses, ""],
      Suggested_Suppliers: [...prev.Suggested_Suppliers, ""],
      Annex: [...(prev.Annex || []), ""], // Aseguramos que exista Annex
    }));

    const newIndex = form.Supply.length; // índice absoluto del nuevo item
    setAnnexType((prev) => ({ ...prev, [newIndex]: "text" }));

    setPage((prev) => Math.ceil((form.Supply.length + 1) / itemsPerPage)); // ir a la última página
  };

  // --- Remover un ITEM
  const removeRow = (pageIndex) => {
    setForm((prev) => {
      if (prev.Supply.length === 1) return prev; // No eliminar si queda solo uno

      // Índice absoluto dentro del array global
      const absoluteIndex = (page - 1) * itemsPerPage + pageIndex;

      const newSupply = prev.Supply.filter((_, i) => i !== absoluteIndex);
      const newID_Unit = prev.ID_Unit.filter((_, i) => i !== absoluteIndex);
      const newQuantity = prev.Quantity.filter((_, i) => i !== absoluteIndex);
      const newID_Expenses = prev.ID_Expenses.filter(
        (_, i) => i !== absoluteIndex,
      );
      const newSuggested_Suppliers = prev.Suggested_Suppliers.filter(
        (_, i) => i !== absoluteIndex,
      );
      const newAnnex = Array.isArray(prev.Annex)
        ? prev.Annex.filter((_, i) => i !== absoluteIndex)
        : [];

      // Reindexar annexType
      setAnnexType((prevAnnexType) => {
        const newType = { ...prevAnnexType };
        delete newType[absoluteIndex];

        const reindexed = {};
        Object.keys(newType).forEach((key) => {
          const k = Number(key);
          reindexed[k > absoluteIndex ? k - 1 : k] = newType[key];
        });
        return reindexed;
      });

      // Ajustar la página si la página actual queda vacía
      const newTotalItems = newSupply.length;
      const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);
      if (page > newTotalPages) setPage(newTotalPages || 1); // Evita 0

      return {
        ...prev,
        Supply: newSupply,
        ID_Unit: newID_Unit,
        Quantity: newQuantity,
        ID_Expenses: newID_Expenses,
        Suggested_Suppliers: newSuggested_Suppliers,
        Annex: newAnnex,
      };
    });
  };

  // --- se agrega el form al FormData y valida si es array o no -----
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
    const Suggested_Suppliers = normalizeArray(form.Suggested_Suppliers);

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

    Suggested_Suppliers.forEach((v, i) => {
      formData.append(`Suggested_Suppliers[${i}]`, v ?? "");
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

  // --- Normalizacion de los array
  const normalizeArray = (arr) =>
    Array.isArray(arr)
      ? arr.map((v) => (v === "" || v === undefined ? null : v))
      : [];

  // ----- Envio de formulario -----
  const handleSubmit = async () => {
    try {
      if (!validateForm()) return;

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

      swalWithTailwind
        .fire({
          //  title: 'Dark theme',
          // theme: 'dark',
          title: "Estas seguro de Crear este requerimiento",
          text: "Si creas el requerimiento conserva el numero del requerimiento para proximos cambios",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "SI, Crear!",
          cancelButtonText: "No, cancelar!",
          reverseButtons: true,
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            const obj = {
              Requirement_Group: form.Requirement_Group,
              ID_Status: "1",
              Changed_By: profile.id.toString(),
              Change_Date: new Date().toISOString(),
              remarks: "PROCESO INICIADO",
            };
            const statushistory = await doChangeStatus(obj);
            if (statushistory.status == 200) {
              const formData = await buildFormData(form);
              const result = await doCreateRequirement(formData);
              if (result.data.message == "Requerimiento creado correctamente") {
                swalWithTailwind.fire({
                  title: "CREADO",
                  text: "Requerimiento de compra creado exitosamente. 👌",
                  icon: "success",
                  confirmButtonText: "OK",
                });
              } else {
                swalWithTailwind.fire({
                  title: "NO SE PUDO CREAR",
                  text: "No se pudo crear el requerimiento",
                  icon: "info",
                  confirmButtonText: "OK",
                });
              }
            }
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithTailwind.fire({
              title: "CANCELADO",
              text: "REQUERIMIENTO CANCELADO 😢",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  // --- Validación del formulario ---
  const validateForm = () => {
    const newErrors = {};
    const excludedFields = ["Annex", "Suggested_Suppliers"];

    Object.entries(form).forEach(([key, value]) => {
      if (excludedFields.includes(key)) return;

      // 🔹 CAMPOS ARRAY → validar por índice
      if (Array.isArray(value)) {
        const fieldErrors = [];

        value.forEach((v, index) => {
          if (v === "" || v === null) {
            fieldErrors[index] = "Este campo es obligatorio";
          }
        });

        if (fieldErrors.length > 0) {
          newErrors[key] = fieldErrors;
        }
        return;
      }

      // 🔹 CAMPOS NORMALES
      if (value === "" || value === null) {
        newErrors[key] = `El campo ${key.replace(/_/g, " ")} es obligatorio`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sanitizeFormForSubmit = (form) => {
    const cleanForm = { ...form };

    // 🔹 arrays que pueden tener valores vacíos
    const arraysToClean = [
      "Suggested_Suppliers",
      "ID_Expenses",
      "ID_Unit",
      "Quantity",
      "Supply",
    ];

    arraysToClean.forEach((field) => {
      if (Array.isArray(cleanForm[field])) {
        cleanForm[field] = cleanForm[field].filter(
          (v) => v !== "" && v !== null && v !== undefined,
        );
      }
    });

    return cleanForm;
  };

  // --- Opciones del modal ---
  const handleNuevo = async () => {
    const data = { newRequirements: true };

    const result = await doCreateRequirement(data);
    setForm((prev) => ({
      ...prev,
      Requirement_Group: result.data,
    }));
    setOpenModal(false);
    setShowForm(true);
  };

  const handleExistente = async () => {
    // const dashboard = routes.find((r) => r.layout === "dashboard");
    // const page = dashboard.pages.find((p) => p.name === "profile");
    // navigate(`/${dashboard.layout}${page.path}`);
    setRequerimentExists(true);

    setOpenModal(false);
    setShowForm(true);
  };

  const handleDownloadExcel = async () => {
    try {
      const response = await apiClient({
        url: '/templates/requirements',
        method: 'GET',
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response]));

      const link = document.createElement('a');
      link.href = url;

      link.setAttribute('download', 'Plantilla requerimientos.xlsx');

      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error al descargar el archivo:", error);
    }
  };

  //TODO COPIADO DE LINEAS DE EXCEL
  const handlePasteFromExcel = (e) => {
    e.preventDefault();

    const pastedText = e.clipboardData.getData("text");
    const rows = pastedText
      .split("\n")
      .map((r) => r.trim())
      .filter(Boolean);

    if (rows.length === 0) return;

    setForm((prev) => {
      const newForm = { ...prev };
      const itemsCount = newForm.Supply.length - 1
      if (
        itemsCount >= 0 &&
        !newForm.Supply[itemsCount] &&
        !newForm.Annex[itemsCount] &&
        !newForm.Quantity[itemsCount] &&
        !newForm.Suggested_Suppliers[itemsCount] &&
        !newForm.ID_Unit[itemsCount] &&
        !newForm.ID_Expenses[itemsCount]
      ) {
        newForm.Supply.splice(itemsCount, 1);
        newForm.Annex.splice(itemsCount, 1);
        newForm.Quantity.splice(itemsCount, 1);
        newForm.Suggested_Suppliers.splice(itemsCount, 1);
        newForm.ID_Unit.splice(itemsCount, 1);
        newForm.ID_Expenses.splice(itemsCount, 1);
      }
      rows.forEach((row) => {
        const cols = row.split("\t");

        // Ajusta el orden según tu Excel
        const [
          supply = "",
          annex = "",
          unit = "",
          expense = "",
          quantity = "",
          supplier = "",
        ] = cols;

        const unitFound = filteredUnits.find(u => u.Description.toLowerCase() == unit.toLowerCase());
        const expenseFound = filteredTypesEspenses.find(t => t.Description.toLowerCase() == expense.toLowerCase());

        newForm.Supply.push(supply);
        newForm.Annex.push(annex);
        if (unitFound) newForm.ID_Unit.push(unitFound.ID.toString());
        if (expenseFound) newForm.ID_Expenses.push(expenseFound.ID.toString());
        newForm.Quantity.push(quantity);
        newForm.Suggested_Suppliers.push(supplier);
      });

      return newForm;
    });

    // mover a la última página
    setPage(Math.ceil(form.Supply.length / itemsPerPage));
  };
  /* -------------------- PROGRESS -------------------- */
  const requiredFields = [
    "Requirement_Group",
    "ID_CodePurchasing",
    "ID_Project",
    "ID_User",
    "Technical_Resp",
    "Technical_Leader",
    "Dir_Project",
    "Date_Requirement",
    "ID_Formatos",
    "ID_Status",
  ];

  const initialForm2 = {
    Supply: [""],
    ID_Unit: [""],
    Quantity: [""],
    ID_Expenses: [""],
    Suggested_Suppliers: [""],

    Annex: [""],
    Technical_Resp: "",
    Technical_Leader: "8",
    Dir_Project: "",
    Date_Requirement: new Date().toISOString().split("T")[0],
    ID_Formatos: "",
    ID_Status: "1",
  };

  const completedFields = requiredFields.filter(
    (f) => form[f] && form[f] !== "",
  ).length;

  const icon = {
    className: "w-5 h-5 text-inherit",
  };

  const progress = Math.round((completedFields / requiredFields.length) * 100);
  return (
    <>
      {/* ---------------- DIALOG (fuera de cualquier div) ---------------- */}
      {/* --------- dialogue MUST GO HERE -------- */}
      <div>
        <Dialog
          size="sm"
          open={openModal}
          handler={setOpenModal} // ❗ Obligatorio
          dismiss={{ outsidePress: false, escapeKey: false }}
        >
          <DialogHeader>Create Requirement</DialogHeader>
          <DialogBody divider>
            ¿Desea crear un requerimiento nuevo o existente?
          </DialogBody>
          <DialogFooter className="flex justify-end gap-3">
            <Button variant="outlined" color="blue" onClick={handleExistente}>
              EXISTENTE
            </Button>
            <Button
              variant="gradient"
              ref={firstButtonRef}
              color="green"
              onClick={handleNuevo}
            >
              NUEVO
            </Button>
          </DialogFooter>
        </Dialog>
      </div>

      {/* ---------------- CONTENIDO PRINCIPAL ---------------- */}
      <div className="mb-5 mt-12 flex w-full justify-center">
        {showForm && (
          <Card className="w-full border border-blue-gray-100 shadow-sm">
            <CardHeader
              floated={false}
              shadow={false}
              color="transparent"
              className="m-0 p-6"
            >
              <Typography variant="h5" color="blue-gray">
                Crear Requerimiento
              </Typography>
              <Typography variant="small" className="text-blue-gray-600">
                Complete la información para generar un nuevo requerimiento.
              </Typography>

            </CardHeader>

            {/* PROGRESS BAR */}
            <CardBody className="pt-4">
              <div className="mb-1 flex items-center justify-between">
                <Typography variant="small" color="blue-gray">
                  Progreso
                </Typography>

                <Typography variant="small" color="blue-gray">
                  {progress}%
                </Typography>
              </div>

              <Progress value={progress} color="green" />
            </CardBody>

            <CardBody className="grid grid-cols-1 gap-6 pt-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {/** NÚMERO DE REQUERIMIENTO */}
              {requerimentExists ? (
                <Select
                  label={
                    errors.Requirement_Group
                      ? errors.Requirement_Group
                      : "Número de Requerimiento"
                  }
                  name="Requirement_Group"
                  value={form.Requirement_Group}
                  onChange={(value) =>
                    handleChange({
                      target: { name: "Requirement_Group", value },
                    })
                  }
                  selected={() =>
                    requirementsInfo.find(
                      (p) =>
                        p.Requirement_Group.toString() ===
                        form.Requirement_Group,
                    )?.Requirement_Group
                  }
                  menuProps={{
                    className: "p-2 max-h-48 overflow-auto",
                  }}
                  className={`w-full ${errors.Requirement_Group ? "border-red-500 text-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`}
                >
                  <div className="sticky top-0 z-20 border-b border-gray-200 bg-white px-2 pb-2">
                    <Input
                      label="Buscar..."
                      value={searchRequirements}
                      onChange={(e) => setSearchRequirements(e.target.value)}
                      className="!text-sm"
                    />
                  </div>
                  {filteredRequirements.length > 0 ? (
                    filteredRequirements.map((r) => (
                      <Option
                        key={r.Requirement_Group}
                        value={r.Requirement_Group.toString()}
                      >
                        {r.Requirement_Group.toString()}
                      </Option>
                    ))
                  ) : (
                    <Option disabled>No hay resultados</Option>
                  )}
                </Select>
              ) : (
                <Input
                  label={
                    errors.Requirement_Group
                      ? errors.Requirement_Group
                      : "Número de Requerimiento"
                  }
                  type="number"
                  name="Requirement_Group"
                  readOnly
                  value={form.Requirement_Group}
                  onChange={handleChange}
                  className={`w-full ${errors.Requirement_Group ? "!focus:ring-red-400 !border-red-500 !text-red-500" : "border-gray-300 !bg-blue-gray-50 focus:ring-blue-400"}`}
                />
              )}

              {/** FECHA DE REQUERIMIENTO */}
              <Input
                label={
                  errors.Date_Requirement
                    ? "El campo Fecha es obligatorio"
                    : "Fecha de Requerimiento"
                }
                type="date"
                name="Date_Requirement"
                readOnly
                value={form.Date_Requirement}
                onChange={handleChange}
                className={`w-full ${errors.Date_Requirement ? "!focus:ring-red-400 !border-red-500 !text-red-500" : "border-gray-300 !bg-blue-gray-50 focus:ring-blue-400"}`}
              />

              {/** FORMATO */}
              <Select
                label={
                  errors.ID_Formatos
                    ? "El campo Formato es obligatorio"
                    : "Formato"
                }
                name="ID_Formatos"
                disabled={requerimentExists}
                value={form.ID_Formatos}
                onChange={(value) =>
                  handleChange({ target: { name: "ID_Formatos", value } })
                }
                selected={() =>
                  formatsInfo.find((p) => p.ID.toString() === form.ID_Formatos)
                    ?.Code_Format
                }
                menuProps={{
                  className: "p-2 max-h-48 overflow-auto",
                  style: { zIndex: 9999 },
                }}
                className={`w-full ${errors.ID_Formatos ? "border-red-500 text-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`}
              >
                <div className="sticky top-0 z-20 border-b border-gray-200 bg-white px-2 pb-2">
                  <Input
                    label="Buscar..."
                    value={searchFormats}
                    onChange={(e) => setSearchFormats(e.target.value)}
                    className="!text-sm"
                  />
                </div>
                {filteredFormats.length > 0 ? (
                  filteredFormats.map((frm) => (
                    <Option key={frm.ID} value={frm.ID.toString()}>
                      {frm.Code_Format}
                    </Option>
                  ))
                ) : (
                  <Option disabled>No hay resultados</Option>
                )}
              </Select>

              {/** PROYECTOS */}
              <Select
                label={errors.ID_Project ? errors.ID_Project : "Proyecto"}
                name="ID_Project"
                disabled={requerimentExists}
                value={form.ID_Project}
                onChange={(value) =>
                  handleChange({ target: { name: "ID_Project", value } })
                }
                selected={() =>
                  projectInfo.find((p) => p.ID.toString() === form.ID_Project)
                    ?.Name_Project
                }
                menuProps={{
                  className: "p-2 max-h-48 overflow-auto",
                  style: { zIndex: 9999 },
                }}
                className={`w-full ${errors.ID_Project ? "border-red-500 text-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`}
              >
                <div className="sticky top-0 z-20 border-b border-gray-200 bg-white px-2 pb-2">
                  <Input
                    label="Buscar..."
                    value={searchProject}
                    onChange={(e) => setSearchProject(e.target.value)}
                    className="!text-sm"
                  />
                </div>
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((u) => (
                    <Option key={u.ID} value={u.ID.toString()}>
                      {u.Name_Project}
                    </Option>
                  ))
                ) : (
                  <Option disabled>No hay resultados</Option>
                )}
              </Select>

              {/** CODIGO DE COMPRA */}

              <Select
                label={
                  errors.ID_CodePurchasing
                    ? errors.ID_CodePurchasing
                    : "Codigo de compra"
                }
                name="ID_CodePurchasing"
                disabled={requerimentExists}
                value={form.ID_CodePurchasing}
                onChange={(value) =>
                  handleChange({ target: { name: "ID_CodePurchasing", value } })
                }
                selected={() =>
                  codePurchasingInfo.find(
                    (cp) => cp.ID.toString() === form.ID_CodePurchasing,
                  )?.Code_Purchasing
                }
                menuProps={{
                  className: "p-2 max-h-48 overflow-auto",
                  style: { zIndex: 9999 },
                }}
                className={`w-full ${errors.ID_CodePurchasing ? "border-red-500 text-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`}
              >
                <div className="sticky top-0 z-20 border-b border-gray-200 bg-white px-2 pb-2">
                  <Input
                    label="Buscar..."
                    value={searchCodePurchasing}
                    onChange={(e) => setSearchCodePurchasing(e.target.value)}
                    className="!text-sm"
                  />
                </div>
                {filteredCodePurchasing.length > 0 ? (
                  filteredCodePurchasing.map((u) => (
                    <Option key={u.ID} value={u.ID.toString()}>
                      {u.Code_Purchasing}
                    </Option>
                  ))
                ) : (
                  <Option disabled>No hay resultados</Option>
                )}
              </Select>

              {/** USUARIO RESPONSABLE */}
              <Select
                label={
                  errors.ID_User
                    ? "El campo Usuario Responsable es obligatorio"
                    : "Usuario Responsable"
                }
                name="ID_User"
                value={form.ID_User}
                disabled
                onChange={(value) =>
                  handleChange({ target: { name: "ID_User", value } })
                }
                selected={() =>
                  userInfo.find((u) => u.ID.toString() === form.ID_User)?.Name
                }
                menuProps={{
                  className: "p-2 max-h-48 overflow-auto",
                  style: { zIndex: 9999 },
                }}
                className={`w-full ${errors.ID_User ? "border-red-500 text-red-500 focus:ring-red-400" : "border-gray-300 !bg-blue-gray-50 focus:ring-blue-400"}`}
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

              {/** DIRECTOR DE PROYECTO */}
              <Select
                label={
                  errors.Dir_Project
                    ? "El campo Director de Proyecto es obligatorio"
                    : "Director de Proyecto"
                }
                name="Dir_Project"
                disabled={requerimentExists}
                value={form.Dir_Project}
                onChange={(value) =>
                  handleChange({ target: { name: "Dir_Project", value } })
                }
                selected={() =>
                  projectManagerInfo.find(
                    (p) => p.ID.toString() === form.Dir_Project,
                  )?.Name
                }
                menuProps={{
                  className: "p-2 max-h-48 overflow-auto",
                  style: { zIndex: 9999 },
                }}
                className={`w-full ${errors.Dir_Project ? "border-red-500 text-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`}
              >
                <div className="sticky top-0 z-20 border-b border-gray-200 bg-white px-2 pb-2">
                  <Input
                    label="Buscar..."
                    value={searchProjectManager}
                    onChange={(e) => setSearchProjectManager(e.target.value)}
                    className="!text-sm"
                  />
                </div>
                {filteredProjeManager.length > 0 ? (
                  filteredProjeManager.map((pm) => (
                    <Option key={pm.ID} value={pm.ID.toString()}>
                      {pm.Name}
                    </Option>
                  ))
                ) : (
                  <Option disabled>No hay resultados</Option>
                )}
              </Select>
              {/** TECHNICAL MANAGER */}
              <Select
                label={
                  errors.Technical_Resp
                    ? "El campo Responsable Técnico es obligatorio"
                    : "Responsable Técnico"
                }
                name="Technical_Resp"
                disabled={requerimentExists}
                value={form.Technical_Resp}
                onChange={(value) =>
                  handleChange({ target: { name: "Technical_Resp", value } })
                }
                selected={() =>
                  TechManagerInfo.find(
                    (p) => p.ID.toString() === form.Technical_Resp,
                  )?.Name
                }
                menuProps={{
                  className: "p-2 max-h-48 overflow-auto",
                  style: { zIndex: 9999 },
                }}
                className={`w-full ${errors.Technical_Resp ? "border-red-500 text-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`}
              >
                <div className="sticky top-0 z-20 border-b border-gray-200 bg-white px-2 pb-2">
                  <Input
                    label="Buscar..."
                    value={searchTechManager}
                    onChange={(e) => setSearchTechManager(e.target.value)}
                    className="!text-sm"
                  />
                </div>
                {filteredTechManager.length > 0 ? (
                  filteredTechManager.map((tm) => (
                    <Option key={tm.ID} value={tm.ID.toString()}>
                      {tm.Name}
                    </Option>
                  ))
                ) : (
                  <Option disabled>No hay resultados</Option>
                )}
              </Select>

              {/** LIDER TECNICO */}
              {/* <Select
                label={
                  errors.Technical_Leader
                    ? "El campo Líder Técnico es obligatorio"
                    : "Líder Técnico"
                }
                name="Technical_Leader"
                disabled={requerimentExists}
                value={form.Technical_Leader}
                onChange={(value) =>
                  handleChange({ target: { name: "Technical_Leader", value } })
                }
                selected={() =>
                  TechLeadInfo.find(
                    (p) => p.ID.toString() === form.Technical_Leader,
                  )?.Name
                }
                menuProps={{
                  className: "p-2 max-h-48 overflow-auto",
                  style: { zIndex: 9999 },
                }}
                className={`w-full ${errors.Technical_Leader ? "border-red-500 text-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`}
              >
                <div className="sticky top-0 z-20 border-b border-gray-200 bg-white px-2 pb-2">
                  <Input
                    label="Buscar..."
                    value={searchTechLead}
                    onChange={(e) => setSearchTechLead(e.target.value)}
                    className="!text-sm"
                  />
                </div>
                {filteredTechLead.length > 0 ? (
                  filteredTechLead.map((tl) => (
                    <Option key={tl.ID} value={tl.ID.toString()}>
                      {tl.Name}
                    </Option>
                  ))
                ) : (
                  <Option disabled>No hay resultados</Option>
                )}
              </Select> */}

              {/** ESTADO */}
              <Input
                label={
                  errors.ID_Status ? "El campo Estado es obligatorio" : "Estado"
                }
                type="text"
                name="ID_Status"
                value={"Iniciando"}
                readOnly
                className={`w-full ${errors.ID_Status ? "!focus:ring-red-400 !border-red-500 !text-red-500" : "border-gray-300 !bg-blue-gray-50 focus:ring-blue-400"}`}
              />
            </CardBody>

            <div className="px-6">
              {/** INPUT PARA PEGAR VARIAS CELDAS DESDE EXCEL */}
              <div className="flex gap-2 items-center">
                <Input
                  label="Pegar desde Excel (Ctrl + V)"
                  placeholder="Pega aquí las filas copiadas desde Excel"
                  className="placeholder:opacity-0 focus:placeholder:opacity-100"
                  onPaste={handlePasteFromExcel}
                />
                <Button variant="filled" color="blue" onClick={handleDownloadExcel}> <ArrowDownTrayIcon {...icon} /> </Button>
              </div>
              <HomeScroll
                form={form}
                errors={errors}
                annexType={annexType}
                paginatedSupply={paginatedSupply}
                page={page}
                itemsPerPage={itemsPerPage}
                totalItems={totalItems}
                totalPages={totalPages}
                itemsPerPageOptions={itemsPerPageOptions}
                unitsInfo={unitsInfo}
                filteredUnits={filteredUnits}
                searchUnits={searchUnits}
                setSearchUnits={setSearchUnits}
                setSearchTypeEspenses={setSearchTypeEspenses}
                typeEspensesInfo={typeEspensesInfo}
                filteredTypesEspenses={filteredTypesEspenses}
                searchTypeEspenses={searchTypeEspenses}
                handleArrayChange={handleArrayChange}
                setAnnexType={setAnnexType}
                addRow={addRow}
                removeRow={removeRow}
                setPage={setPage}
                setItemsPerPage={setItemsPerPage}
              />
              <div className="p-6 pt-0">
                <Button color="blue" fullWidth onClick={handleSubmit}>
                  Guardar Requerimiento
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </>
  );
}

export default Requirements;
