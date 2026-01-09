import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Button,
  Select,
  Option,
  Progress,
} from "@material-tailwind/react";
import Swal from "sweetalert2";
import { useMaterialTailwindController } from "@/context";

export function NewProject() {
  const [controller, {  doChangeStatus }] = useMaterialTailwindController();
  const { profile } = controller;

  /* -------------------- STATE -------------------- */
  const initialForm = {
    Name_Project: "",
    Num_Project: "",
    Location: "",
    Dir_Project: profile.id.toString(),
    Ger_Project: "",
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [generalManagerInfo, setGeneralManagerInfo] = useState([]);
  const [searchManager, setSearchManager] = useState("");
  const [mounted, setMounted] = useState(false);

  /* -------------------- SLIDER -------------------- */
  const images = [
    "/img/granja-tecnico.jpg",
    "/img/logo-acema.png",
    "/img/home-decor-3.jpg",
    "/img/granja-tecnico.jpg",
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  /* -------------------- MOUNT ANIMATION -------------------- */
  useEffect(() => setMounted(true), []);

  /* -------------------- SLIDER AUTO -------------------- */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  /* -------------------- LOAD DATA -------------------- */
  useEffect(() => {
    const loadInfo = async () => {
      const res = await axios.get("/form/info", { withCredentials: true });
      setGeneralManagerInfo(res.data.userGeneralProject || []);
    };
    loadInfo();
  }, []);

  /* -------------------- HANDLERS -------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  /* -------------------- VALIDATION -------------------- */
  const validateForm = () => {
    const newErrors = {};
    if (!form.Name_Project)
      newErrors.Name_Project = "Nombre del proyecto es obligatorio";
    if (!form.Num_Project)
      newErrors.Num_Project = "Numero del proyecto es obligatorio";
    if (!form.Ger_Project) newErrors.Ger_Project = "Gerente es obligatorio";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* -------------------- PROGRESS -------------------- */
  const requiredFields = ["Name_Project", "Num_Project", "Ger_Project"];

  const completedFields = requiredFields.filter(
    (f) => form[f] && form[f] !== "",
  ).length;

  const progress = Math.round((completedFields / requiredFields.length) * 100);

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = async () => {
    if (!validateForm()) return;

    const swalWithTailwind = Swal.mixin({
      customClass: {
        popup: "rounded-xl p-4",
        title: "text-lg font-semibold text-gray-800",
        confirmButton:
          "ml-10 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700",
        cancelButton:
          "mr-10 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700",
      },
      buttonsStyling: false,
    });

    swalWithTailwind
      .fire({
        title: "¿Crear proyecto?",
        text: "Se creará un nuevo proyecto",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, crear",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            const res = await axios.post("/form/createproject", form, {
              withCredentials: true,
            });
            if (res.data.message == "Proyecto creado con exito") {

              const obj = {
              ID_Project: form.ID_Project,
              ID_Status: "1",
              Change_Date: new Date().toISOString(),
              remarks: "CREACION DE CODIGO DE COMPRA",
              Engineering_Manager: form.Engineering_Manager,
              Purchasing_Director: form.Purchasing_Director
            };
            await doChangeStatus(obj);
              

              swalWithTailwind.fire({
                title: "Proyecto creado 🎉",
                text: res.data.message || "Creado correctamente",
                icon: "success",
              });
              setForm(initialForm);
            } else {
              swalWithTailwind.fire({
                title: "El proyecto ya existe",
                text: res.data.message || "No se pudo crear el proyecto",
                icon: "info",
              });
            }
          } catch {
            swalWithTailwind.fire({
              title: "Error",
              text: "No se pudo crear el proyecto",
              icon: "error",
            });
          }
        }
      });
  };

  /* -------------------- FILTER -------------------- */
  const filteredManagers = generalManagerInfo.filter((m) =>
    m.Name?.toLowerCase().includes(searchManager.toLowerCase()),
  );

  /* -------------------- UI -------------------- */
  return (
    <div className="mt-12 flex flex-col items-center gap-6">
      {/* ---------- SLIDER ---------- */}
      <div
        className={`relative h-64 w-full max-w-4xl overflow-hidden rounded-lg shadow-lg transition-all duration-700 ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <img
          src={images[currentSlide]}
          alt="slide"
          className="h-full w-full object-contain object-center transition-all duration-700"
        />
      </div>

      {/* ---------- FORM ---------- */}
      <Card
        className={`w-full max-w-4xl border border-blue-gray-100 transition-all duration-700 ease-out hover:-translate-y-1 hover:shadow-2xl ${mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"} `}
      >
        <CardHeader floated={false} shadow={false} className="p-6">
          <Typography variant="h4">Crear Proyecto Nuevo</Typography>
          <Typography className="text-blue-gray-600">
            Información básica del proyecto
          </Typography>

          {/* PROGRESS BAR */}
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs">
              <span>Progreso</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} color="green" />
          </div>
        </CardHeader>
        <CardBody className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {[
            <Input
              label={errors.Name_Project || "Nombre del Proyecto"}
              name="Name_Project"
              value={form.Name_Project}
              onChange={handleChange}
              error={Boolean(errors.Name_Project)}
            />,
            <Input
              label={errors.Num_Project || "Número del Proyecto"}
              name="Num_Project"
              value={form.Num_Project}
              onChange={handleChange}
              error={Boolean(errors.Num_Project)}
            />,
            <Input
              label="Ubicación"
              name="Location"
              value={form.Location}
              onChange={handleChange}
            />,
            <Select
              label={
                errors.Ger_Project ? errors.Ger_Project : "Gerente del Proyecto"
              }
              name="Ger_Project"
              value={form.Ger_Project}
              onChange={(value) =>
                handleChange({ target: { name: "Ger_Project", value } })
              }
              selected={() =>
                generalManagerInfo.find(
                  (g) => g.ID.toString() === form.Ger_Project,
                )?.Name
              }
              menuProps={{
                className: "p-2 max-h-48 overflow-auto",
                style: { zIndex: 9999 },
              }}
              className={`w-full ${
                errors.Ger_Project
                  ? "border-red-500 text-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
            >
              {/* Buscador */}
              <div className="sticky top-0 z-20 border-b border-gray-200 bg-white px-2 pb-2">
                <Input
                  label="Buscar..."
                  value={searchManager}
                  onChange={(e) => setSearchManager(e.target.value)}
                  className="!text-sm"
                />
              </div>

              {/* Opciones */}
              {filteredManagers.length > 0 ? (
                filteredManagers.map((r) => (
                  <Option key={r.ID} value={r.ID.toString()}>
                    {r.Name}
                  </Option>
                ))
              ) : (
                <Option disabled>No hay resultados</Option>
              )}
            </Select>,
            <Input
              label="Director del Proyecto"
              value={profile.name}
              readOnly
              className="bg-blue-gray-200"
            />,
          ].map((field, i) => (
            <div
              key={i}
              className={`transition-all duration-700 ${mounted ? "" : "translate-y-20 opacity-100"} `}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {field}
            </div>
          ))}
        </CardBody>
        <CardFooter>
          <Button
            color="blue"
            fullWidth
            onClick={handleSubmit}
            className="transition-all hover:scale-[1.02] active:scale-95"
          >
            Crear Proyecto
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default NewProject;
