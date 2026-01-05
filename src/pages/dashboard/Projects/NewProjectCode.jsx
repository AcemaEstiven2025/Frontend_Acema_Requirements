// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   CardHeader,
//   CardBody,
//   CardFooter,
//   Typography,
//   Input,
//   Button,
//   Select,
//   Option,
//   Progress,
// } from "@material-tailwind/react";
// import Swal from "sweetalert2";

// export function NewProjectCode() {
//   /* -------------------- STATE -------------------- */
//   const initialForm = {
//     Code_Purchasing: "",
//     Name_Order: "",
//     Current_Budget: "",
//     Cost_center: "",
//     WBS: "",
//     Engineering_Manager: "",
//     Purchasing_Director: "",
//     ID_Project: "",
//   };

//   const [form, setForm] = useState(initialForm);
//   const [errors, setErrors] = useState({});
//   const [mounted, setMounted] = useState(false);

//   const [techManagerInfo, setTechManagerInfo] = useState([]);
//   const [purchasingDirectorInfo, setPurchasingDirectorInfo] = useState([]);
//   const [projectInfo, setProjectInfo] = useState([]);
//   const [codeprojectInfo, setCodeProjectInfo] = useState([]);

//   /* -------------------- MOUNT ANIMATION -------------------- */
//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   /* -------------------- LOAD DATA -------------------- */
//   useEffect(() => {
//     const loadInfo = async () => {
//       const res = await axios.get("/form/info", { withCredentials: true });
//       const res2 = await axios.get("/form/infoprojects", {
//         withCredentials: true,
//       });
//       setTechManagerInfo(res.data.userTechManager || []);
//       setPurchasingDirectorInfo(res.data.userGeneralManager || []);
//       console.log(res2);
//       setProjectInfo(res2.data.data || []);
//     };
//     loadInfo();
//   }, []);

//   /* -------------------- HANDLERS -------------------- */
//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//     setErrors((prev) => ({ ...prev, [e.target.name]: null }));

//     if (e.target.name === "ID_Project") {
//       const r = projectInfo.find((x) => x.ID.toString() === e.target.value);

//       // const p = projectInfo.find(
//       //   (x) => x.ID.toString() == r.ID_Project.toString(),
//       // );
//       // let code = "";
//       // if (p) {
//       //   setCodePurchasingInfo(p.CodesProjectsPurchasing);
//       //   code = p.CodesProjectsPurchasing.find(
//       //     (c) => c.ID.toString() == r.ID_CodePurchasing,
//       //   );
//       // }
//       if (r) {
//         //  setCodeProjectInfo(r.CodesProjectsPurchasing)
//         setForm((prev) => ({
//           ...prev,
//           Code_Purchasing: r.Num_Project.toString(),
//         }));
//       }
//     }
//   };

//   /* -------------------- VALIDATION -------------------- */
//   const validateForm = () => {
//     const newErrors = {};

//     // if (!form.Code_Purchasing) newErrors.Code_Purchasing = "Purchase code required";
//     if (!form.Code_Purchasing) {
//       newErrors.Code_Purchasing = "Código de compra obligatorio";
//     } else if (form.Code_Purchasing.trim().length < 7) {
//       newErrors.Code_Purchasing = "El código debe tener al menos 7 caracteres";
//     }
//     if (!form.Name_Order) newErrors.Name_Order = "Nombre de codigo obligatorio";
//     if (!form.Current_Budget)
//       newErrors.Current_Budget = "Presupuesto obligatorio";
//     if (!form.Engineering_Manager)
//       newErrors.Engineering_Manager = "Lider de ingenieria Obligatorio";
//     if (!form.Purchasing_Director)
//       newErrors.Purchasing_Director = "Director de compra Obligatorio";
//     if (!form.ID_Project) newErrors.ID_Project = "Proyecto obligatorio";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   /* -------------------- PROGRESS BAR -------------------- */
//   const requiredFields = [
//     "Code_Purchasing",
//     "Name_Order",
//     "Current_Budget",
//     "Engineering_Manager",
//     "Purchasing_Director",
//     "ID_Project",
//   ];

//   const completedFields = requiredFields.filter(
//     (f) => form[f] && form[f] !== "",
//   ).length;

//   const progress = Math.round((completedFields / requiredFields.length) * 100);

//   /* -------------------- SUBMIT -------------------- */
//   const handleSubmit = async () => {
//     if (!validateForm()) return;

//     const swalWithTailwind = Swal.mixin({
//       customClass: {
//         popup: "rounded-xl p-4",
//         title: "text-lg font-semibold text-gray-800",
//         htmlContainer: "text-sm text-gray-600",
//         confirmButton:
//           "ml-10 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700",
//         cancelButton:
//           "mr-10 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700",
//       },
//       buttonsStyling: false,
//     });

//     swalWithTailwind
//       .fire({
//         title: "¿Crear código de proyecto?",
//         text: "Se creará un nuevo código de compra",
//         icon: "question",
//         showCancelButton: true,
//         confirmButtonText: "Sí, crear",
//         cancelButtonText: "Cancelar",
//         reverseButtons: true,
//       })
//       .then(async (result) => {
//         if (result.isConfirmed) {
//           try {
//             const res = await axios.post("/form/createprojectcode", form, {
//               withCredentials: true,
//             });

//             swalWithTailwind.fire({
//               title: "¡Código creado!",
//               text: res.data.message || "Creado correctamente 🎉",
//               icon: "success",
//               confirmButtonText: "OK",
//             });

//             setForm(initialForm);
//           } catch (error) {
//             swalWithTailwind.fire({
//               title: "Error",
//               text: "No se pudo crear el código",
//               icon: "error",
//               confirmButtonText: "OK",
//             });
//           }
//         }
//       });
//   };

//   /* -------------------- UI -------------------- */
//   return (
//     <div className="mt-12 flex justify-center">
//       <Card
//         className={`w-full max-w-5xl border border-blue-gray-100 shadow-lg transition-all duration-700 ease-out hover:-translate-y-1 hover:shadow-2xl ${mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"} `}
//       >
//         {/* ---------- HEADER ---------- */}
//         <CardHeader floated={false} shadow={false} className="p-6">
//           <Typography variant="h4" color="blue-gray">
//             Crear Código de Proyecto
//           </Typography>
//           <Typography className="text-blue-gray-600">
//             Complete la información del código de compra
//           </Typography>

//           {/* PROGRESS BAR */}
//           <div className="mt-4">
//             <div className="mb-1 flex justify-between text-xs">
//               <span>Progreso</span>
//               <span>{progress}%</span>
//             </div>
//             <Progress value={progress} color="green" />
//           </div>
//         </CardHeader>

//         {/* ---------- BODY ---------- */}
//         <CardBody className="grid grid-cols-1 gap-6 md:grid-cols-2">
//           {[
//             <Select
//               label={errors.ID_Project || "Proyecto"}
//               value={form.ID_Project}
//               error={Boolean(errors.ID_Project)}
//               onChange={(value) =>
//                 handleChange({ target: { name: "ID_Project", value } })
//               }
//               selected={() =>
//                 projectInfo.find((p) => p.ID.toString() === form.ID_Project)
//                   ?.Name_Project
//               }
//             >
//               {projectInfo.length > 0 ? (
//                 projectInfo.map((p) => (
//                   <Option key={p.ID} value={p.ID.toString()}>
//                     {p.Name_Project}
//                   </Option>
//                 ))
//               ) : (
//                 <Option disabled>No hay proyectos</Option>
//               )}
//             </Select>,
//             //        <Select
//             //   label={errors.Code_Purchasing || "Código de Compra"}
//             //   value={form.Code_Purchasing}
//             //   error={Boolean(errors.Code_Purchasing)}
//             //   onChange={(value) =>
//             //     handleChange({ target: { name: "Code_Purchasing", value } })
//             //   }
//             //   selected={() =>
//             //     codeprojectInfo.find(
//             //       (p) => p.ID.toString() === form.Code_Purchasing
//             //     )?.Name_Project
//             //   }
//             // >
//             //   {codeprojectInfo.length > 0 ? (
//             //     codeprojectInfo.map((p) => (
//             //       <Option key={p.ID} value={p.ID.toString()}>
//             //         {p.Code_Purchasing}
//             //       </Option>
//             //     ))
//             //   ) : (
//             //     <Option disabled>No hay proyectos</Option>
//             //   )}
//             // </Select>,
//             <Input
//               label={errors.Code_Purchasing || "Código de Compra"}
//               name="Code_Purchasing"
//               value={form.Code_Purchasing}
//               onChange={handleChange}
//               error={Boolean(errors.Code_Purchasing)}
//             />,
//             <Input
//               label={errors.Name_Order || "Nombre de la Orden"}
//               name="Name_Order"
//               value={form.Name_Order}
//               onChange={handleChange}
//               error={Boolean(errors.Name_Order)}
//             />,
//             <Select
//               label={errors.Engineering_Manager || "Engineering Manager"}
//               value={form.Engineering_Manager}
//               error={Boolean(errors.Engineering_Manager)}
//               onChange={(value) =>
//                 handleChange({
//                   target: { name: "Engineering_Manager", value },
//                 })
//               }
//               selected={() =>
//                 techManagerInfo.find(
//                   (tm) => tm.ID.toString() === form.Engineering_Manager,
//                 )?.Name
//               }
//             >
//               {techManagerInfo.length > 0 ? (
//                 techManagerInfo.map((tm) => (
//                   <Option key={tm.ID} value={tm.ID.toString()}>
//                     {tm.Name}
//                   </Option>
//                 ))
//               ) : (
//                 <Option disabled>No hay resultados</Option>
//               )}
//             </Select>,
//             <Select
//               label={
//                 errors.Purchasing_Director
//                   ? errors.Purchasing_Director
//                   : "Purchasing Director"
//               }
//               value={form.Purchasing_Director}
//               error={Boolean(errors.Purchasing_Director)}
//               onChange={(value) =>
//                 handleChange({
//                   target: { name: "Purchasing_Director", value },
//                 })
//               }
//               selected={() =>
//                 purchasingDirectorInfo.find(
//                   (d) => d.ID.toString() === form.Purchasing_Director,
//                 )?.Name
//               }
//             >
//               {purchasingDirectorInfo.length > 0 ? (
//                 purchasingDirectorInfo.map((gm) => (
//                   <Option key={gm.ID} value={gm.ID.toString()}>
//                     {gm.Name}
//                   </Option>
//                 ))
//               ) : (
//                 <Option disabled>No hay resultados</Option>
//               )}
//             </Select>,
//             <Input
//               label={errors.Current_Budget || "Presupuesto Actual"}
//               type="number"
//               name="Current_Budget"
//               value={form.Current_Budget}
//               onChange={handleChange}
//               error={Boolean(errors.Current_Budget)}
//             />,

//             <Input
//               label="Centro de Costos"
//               name="Cost_center"
//               value={form.Cost_center}
//               onChange={handleChange}
//             />,
//             <Input
//               label="WBS"
//               name="WBS"
//               value={form.WBS}
//               onChange={handleChange}
//             />,
//           ].map((field, index) => (
//             <div
//               key={index}
//               className={`transition-all duration-700 ease-out ${mounted ? "" : "translate-y-6 opacity-100"} `}
//               style={{ transitionDelay: `${index * 80}ms` }}
//             >
//               {field}
//             </div>
//           ))}
//         </CardBody>

//         {/* ---------- FOOTER ---------- */}
//         <CardFooter className="pt-0">
//           <Button
//             color="blue"
//             fullWidth
//             onClick={handleSubmit}
//             className="shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-95"
//           >
//             Crear Código
//           </Button>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }

// export default NewProjectCode;

//TODO *******************************
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   CardHeader,
//   CardBody,
//   CardFooter,
//   Typography,
//   Input,
//   Button,
//   Select,
//   Option,
//   Progress,
// } from "@material-tailwind/react";
// import Swal from "sweetalert2";

// export function NewProjectCode() {
//   /* -------------------- STATE -------------------- */
//   const initialForm = {
//     Code_Purchasing: [""], // ahora array
//     Name_Order: [""],      // ahora array
//     Current_Budget: "",
//     Cost_center: "",
//     WBS: "",
//     Engineering_Manager: "",
//     Purchasing_Director: "",
//     ID_Project: "",
//   };

//   const [form, setForm] = useState(initialForm);
//   const [errors, setErrors] = useState({});
//   const [mounted, setMounted] = useState(false);

//   const [techManagerInfo, setTechManagerInfo] = useState([]);
//   const [purchasingDirectorInfo, setPurchasingDirectorInfo] = useState([]);
//   const [projectInfo, setProjectInfo] = useState([]);

//   /* -------------------- MOUNT -------------------- */
//   useEffect(() => setMounted(true), []);

//   /* -------------------- LOAD DATA -------------------- */
//   useEffect(() => {
//     const loadInfo = async () => {
//       const res = await axios.get("/form/info", { withCredentials: true });
//       const res2 = await axios.get("/form/infoprojects", {
//         withCredentials: true,
//       });

//       setTechManagerInfo(res.data.userTechManager || []);
//       setPurchasingDirectorInfo(res.data.userGeneralManager || []);
//       setProjectInfo(res2.data.data || []);
//     };
//     loadInfo();
//   }, []);

//   /* -------------------- HANDLERS -------------------- */
//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//     setErrors((prev) => ({ ...prev, [e.target.name]: null }));
//   };

//   // Manejo de arrays
//   const handleArrayChange = (field, index, value) => {
//     const updated = [...form[field]];
//     updated[index] = value;

//     setForm((prev) => ({
//       ...prev,
//       [field]: updated,
//     }));

//     setErrors((prev) => {
//       const copy = { ...prev };
//       if (copy[field]) copy[field][index] = null;
//       return copy;
//     });
//   };

//   const addItem = (field) => {
//     setForm((prev) => ({
//       ...prev,
//       [field]: [...prev[field], ""],
//     }));
//   };

//   const removeItem = (field, index) => {
//     setForm((prev) => ({
//       ...prev,
//       [field]: prev[field].filter((_, i) => i !== index),
//     }));
//   };

//   /* -------------------- VALIDATION -------------------- */
//   const validateForm = () => {
//     const newErrors = {};

//     newErrors.Code_Purchasing = [];
//     form.Code_Purchasing.forEach((code, i) => {
//       if (!code) {
//         newErrors.Code_Purchasing[i] = "Código obligatorio";
//       } else if (code.trim().length < 7) {
//         newErrors.Code_Purchasing[i] = "Mínimo 7 caracteres";
//       }
//     });

//     newErrors.Name_Order = [];
//     form.Name_Order.forEach((name, i) => {
//       if (!name) newErrors.Name_Order[i] = "Nombre obligatorio";
//     });

//     if (!form.Current_Budget)
//       newErrors.Current_Budget = "Presupuesto obligatorio";
//     if (!form.Engineering_Manager)
//       newErrors.Engineering_Manager = "Líder de ingeniería obligatorio";
//     if (!form.Purchasing_Director)
//       newErrors.Purchasing_Director = "Director de compra obligatorio";
//     if (!form.ID_Project)
//       newErrors.ID_Project = "Proyecto obligatorio";

//     setErrors(newErrors);
//     return Object.values(newErrors).flat().filter(Boolean).length === 0;
//   };

//   /* -------------------- PROGRESS -------------------- */
//   const totalRequired =
//     form.Code_Purchasing.length +
//     form.Name_Order.length +
//     4;

//   let completed = 0;
//   form.Code_Purchasing.forEach((c) => c && completed++);
//   form.Name_Order.forEach((n) => n && completed++);
//   if (form.Current_Budget) completed++;
//   if (form.Engineering_Manager) completed++;
//   if (form.Purchasing_Director) completed++;
//   if (form.ID_Project) completed++;

//   const progress = Math.round((completed / totalRequired) * 100);

//   /* -------------------- SUBMIT -------------------- */
//   const handleSubmit = async () => {
//     if (!validateForm()) return;

//     try {
//       await axios.post("/form/createprojectcode", form, {
//         withCredentials: true,
//       });

//       Swal.fire("¡Creado!", "Código creado correctamente 🎉", "success");
//       setForm(initialForm);
//     } catch {
//       Swal.fire("Error", "No se pudo crear el código", "error");
//     }
//   };

//   /* -------------------- UI -------------------- */
//   return (
//     <div className="mt-12 flex justify-center">
//       <Card className="w-full max-w-5xl shadow-lg">
//         <CardHeader floated={false} shadow={false} className="p-6">
//           <Typography variant="h4">Crear Código de Proyecto</Typography>
//           <div className="mt-4">
//             <Progress value={progress} color="green" />
//           </div>
//         </CardHeader>

//         <CardBody className="grid gap-6 md:grid-cols-2">
//           {/* CAMPOS ORIGINALES */}
//           <Select
//             label={errors.ID_Project || "Proyecto"}
//             error={Boolean(errors.ID_Project)}
//             value={form.ID_Project}
//             onChange={(value) =>
//               handleChange({ target: { name: "ID_Project", value } })
//             }
//             selected={() =>
//               projectInfo.find((p) => p.ID.toString() === form.ID_Project)
//                 ?.Name_Project
//             }
//           >
//             {projectInfo.map((p) => (
//               <Option key={p.ID} value={p.ID.toString()}>
//                 {p.Name_Project}
//               </Option>
//             ))}
//           </Select>

//           <Select
//             label={errors.Engineering_Manager || "Engineering Manager"}
//             error={Boolean(errors.Engineering_Manager)}
//             value={form.Engineering_Manager}
//             onChange={(value) =>
//               handleChange({ target: { name: "Engineering_Manager", value } })
//             }
//             selected={() =>
//               techManagerInfo.find(
//                 (tm) => tm.ID.toString() === form.Engineering_Manager
//               )?.Name
//             }
//           >
//             {techManagerInfo.map((tm) => (
//               <Option key={tm.ID} value={tm.ID.toString()}>
//                 {tm.Name}
//               </Option>
//             ))}
//           </Select>

//           <Select
//             label={errors.Purchasing_Director || "Purchasing Director"}
//             error={Boolean(errors.Purchasing_Director)}
//             value={form.Purchasing_Director}
//             onChange={(value) =>
//               handleChange({
//                 target: { name: "Purchasing_Director", value },
//               })
//             }
//             selected={() =>
//               purchasingDirectorInfo.find(
//                 (d) => d.ID.toString() === form.Purchasing_Director
//               )?.Name
//             }
//           >
//             {purchasingDirectorInfo.map((gm) => (
//               <Option key={gm.ID} value={gm.ID.toString()}>
//                 {gm.Name}
//               </Option>
//             ))}
//           </Select>

//           <Input
//             label={errors.Current_Budget || "Presupuesto Actual"}
//             name="Current_Budget"
//             type="number"
//             value={form.Current_Budget}
//             onChange={handleChange}
//             error={Boolean(errors.Current_Budget)}
//           />

//           <Input
//             label="Centro de Costos"
//             name="Cost_center"
//             value={form.Cost_center}
//             onChange={handleChange}
//           />

//           <Input
//             label="WBS"
//             name="WBS"
//             value={form.WBS}
//             onChange={handleChange}
//           />
//         </CardBody>

//         {/* -------- SECCIÓN APARTE: CÓDIGOS DINÁMICOS -------- */}
//         <CardBody className="border-t mt-4 space-y-4">
//           <Typography variant="h6">Códigos de Compra</Typography>

//           {form.Code_Purchasing.map((code, i) => (
//             <div key={i} className="flex gap-2">
//               <Input
//                 label={errors.Code_Purchasing?.[i] || `Código ${i + 1}`}
//                 value={code}
//                 error={Boolean(errors.Code_Purchasing?.[i])}
//                 onChange={(e) =>
//                   handleArrayChange("Code_Purchasing", i, e.target.value)
//                 }
//               />
//               <Button color="green" onClick={() => addItem("Code_Purchasing")}>+</Button>
//               {form.Code_Purchasing.length > 1 && (
//                 <Button color="red" onClick={() => removeItem("Code_Purchasing", i)}>-</Button>
//               )}
//             </div>
//           ))}

//           <Typography variant="h6" className="mt-4">
//             Nombres de Orden
//           </Typography>

//           {form.Name_Order.map((name, i) => (
//             <div key={i} className="flex gap-2">
//               <Input
//                 label={errors.Name_Order?.[i] || `Orden ${i + 1}`}
//                 value={name}
//                 error={Boolean(errors.Name_Order?.[i])}
//                 onChange={(e) =>
//                   handleArrayChange("Name_Order", i, e.target.value)
//                 }
//               />
//               <Button color="green" onClick={() => addItem("Name_Order")}>+</Button>
//               {form.Name_Order.length > 1 && (
//                 <Button color="red" onClick={() => removeItem("Name_Order", i)}>-</Button>
//               )}
//             </div>
//           ))}
//         </CardBody>

//         <CardFooter>
//           <Button fullWidth color="blue" onClick={handleSubmit}>
//             Crear Código
//           </Button>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }

// export default NewProjectCode;


// TODO *****************************



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

export function NewProjectCode() {
  /* -------------------- STATE -------------------- */
  const initialForm = {
    Code_Purchasing: [""],
    Name_Order: [""],
    Current_Budget: "",
    Cost_center: "",
    WBS: "",
    Engineering_Manager: "",
    Purchasing_Director: "",
    ID_Project: "",
  };
 
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [mounted, setMounted] = useState(false);
  
  const [codeExistInfo,setCodeExistInfo] = useState([])
  const [techManagerInfo, setTechManagerInfo] = useState([]);
  const [purchasingDirectorInfo, setPurchasingDirectorInfo] = useState([]);
  const [projectInfo, setProjectInfo] = useState([]);

  /* -------------------- MOUNT -------------------- */
  useEffect(() => setMounted(true), []);

  /* -------------------- LOAD DATA -------------------- */
  useEffect(() => {
    const loadInfo = async () => {
      const res = await axios.get("/form/info", { withCredentials: true });
      const res2 = await axios.get("/form/infoprojects", {
        withCredentials: true,
      });
//    const projects = res2.data.data.map(p => p.project);
    // console.log(res2.data)
// setProjectInfo(projects);
      setTechManagerInfo(res.data.userTechManager || []);
      setPurchasingDirectorInfo(res.data.userpurchasingDirector || []);
      setProjectInfo(res2.data.date|| []);
    };
    loadInfo();
  }, [form.ID_Project]);

  /* -------------------- HANDLERS -------------------- */
  const handleChange = (e) => {
  const { name, value } = e.target;

  setForm((prev) => {
    let updatedForm = {
      ...prev,
      [name]: value,
    };

    // 🔹 Si cambia el proyecto
    if (name === "ID_Project") {
      const project = projectInfo.find(
        (x) => x.ID.toString() === value
      );

      if (project) {
        setCodeExistInfo(project.CodesProjectsPurchasing)
        // Si ya hay códigos, se actualizan todos
        if (prev.Code_Purchasing.length > 0) {
          updatedForm.Code_Purchasing = prev.Code_Purchasing.map(
            () => project.Num_Project.toString()
          );
        } else {
          // Seguridad: al menos un item
          updatedForm.Code_Purchasing = [
            project.Num_Project.toString(),
          ];
        }
      }
    }

    return updatedForm;
  });

  // 🔹 Limpia error solo del campo modificado
  setErrors((prev) => ({
    ...prev,
    [name]: null,
  }));
};


  // 🔹 Manejo de pares Code + Name (UNIDOS)
  const handlePairChange = (index, field, value) => {
    const codes = [...form.Code_Purchasing];
    const names = [...form.Name_Order];

    if (field === "code") codes[index] = value;
    if (field === "name") names[index] = value;

    setForm((prev) => ({
      ...prev,
      Code_Purchasing: codes,
      Name_Order: names,
    }));

    setErrors((prev) => {
      const copy = { ...prev };
      if (copy.Code_Purchasing) copy.Code_Purchasing[index] = null;
      if (copy.Name_Order) copy.Name_Order[index] = null;
      return copy;
    });
  };

  const addPair = () => {
    setForm((prev) => ({
      ...prev,
      Code_Purchasing: [...prev.Code_Purchasing, ""],
      Name_Order: [...prev.Name_Order, ""],
    }));
  };

  const removePair = (index) => {
    setForm((prev) => ({
      ...prev,
      Code_Purchasing: prev.Code_Purchasing.filter((_, i) => i !== index),
      Name_Order: prev.Name_Order.filter((_, i) => i !== index),
    }));
  };

  /* -------------------- VALIDATION -------------------- */
  const validateForm = () => {
    const newErrors = {};

    newErrors.Code_Purchasing = [];
    newErrors.Name_Order = [];

    form.Code_Purchasing.forEach((code, i) => {
      if (!code) {
        newErrors.Code_Purchasing[i] = "Código obligatorio";
      } else if (code.trim().length < 7) {
        newErrors.Code_Purchasing[i] = "Mínimo 7 caracteres";
      }
    });

    form.Name_Order.forEach((name, i) => {
      if (!name) {
        newErrors.Name_Order[i] = "Nombre obligatorio";
      }
    });

    if (!form.Current_Budget)
      newErrors.Current_Budget = "Presupuesto obligatorio";
    if (!form.Engineering_Manager)
      newErrors.Engineering_Manager = "Líder de ingeniería obligatorio";
    if (!form.Purchasing_Director)
      newErrors.Purchasing_Director = "Director de compra obligatorio";
    if (!form.ID_Project)
      newErrors.ID_Project = "Proyecto obligatorio";

    setErrors(newErrors);
    return Object.values(newErrors).flat().filter(Boolean).length === 0;
  };

  /* -------------------- PROGRESS -------------------- */
  const totalRequired =
    form.Code_Purchasing.length * 2 + 4;

  let completed = 0;

  form.Code_Purchasing.forEach((c) => c && completed++);
  form.Name_Order.forEach((n) => n && completed++);
  if (form.Current_Budget) completed++;
  if (form.Engineering_Manager) completed++;
  if (form.Purchasing_Director) completed++;
  if (form.ID_Project) completed++;

  const progress = Math.round((completed / totalRequired) * 100);

  /* -------------------- SUBMIT -------------------- */
  // const handleSubmit = async () => {
  //   if (!validateForm()) return;

  //   try {
  //     await axios.post("/form/createprojectcode", form, {
  //       withCredentials: true,
  //     });

  //     Swal.fire("¡Creado!", "Código creado correctamente 🎉", "success");
  //     setForm(initialForm);
  //   } catch {
  //     Swal.fire("Error", "No se pudo crear el código", "error");
  //   }
  // };

  const handleSubmit = async () => {
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
      title: "¿Crear código de proyecto?",
      text: "Se creará un nuevo código de compra",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, crear",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    })
    .then(async (result) => {
      if (result.isConfirmed) {
        try {
         const resp =  await axios.post("/form/createcodeproject", form, {
            withCredentials: true,
          });
          if (resp.data.message == "Códigos Creados exitosamente") {
             swalWithTailwind.fire({
            title: "¡Creado!",
            text: "Código creado correctamente 🎉",
            icon: "success",
            confirmButtonText: "OK",
          });
           setForm(initialForm);
          	} else {
             swalWithTailwind.fire({
            title: "¡Upsss!",
            text: `${resp.data.message}  😢`,
            icon: "info",
            confirmButtonText: "OK",
          });
          }
         
        } catch (error) {
          swalWithTailwind.fire({
            title: "Error",
            text: "No se pudo crear el código",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithTailwind.fire({
          title: "Cancelado",
          text: "La creación del código fue cancelada",
          icon: "info",
          confirmButtonText: "OK",
        });
      }
    });
};

 const [searchCode, setSearchCode] = useState("");

  // Filtrar según búsqueda
  const filteredCodes = codeExistInfo.filter((item) =>
    item.Code_Purchasing.toLowerCase().includes(searchCode.toLowerCase()) ||
    item.Name_Order.toLowerCase().includes(searchCode.toLowerCase())
  );
  /* -------------------- UI -------------------- */
  return (
    <div className="mt-12 flex justify-center">
      <Card className="w-full max-w-5xl shadow-lg">
        <CardHeader floated={false} shadow={false} className="p-6">
          <Typography variant="h4">Create Project Code</Typography>
           <div className="mb-1 flex justify-between text-xs">
              <span>Progreso</span>
              <span>{progress}%</span>
            </div>
          <div className="mt-4">
            <Progress value={progress} color="green" />
          </div>
        </CardHeader>

        {/* ---------- CAMPOS ORIGINALES ---------- */}
        <CardBody className="grid gap-6 md:grid-cols-2">
          <Select
            label={errors.ID_Project || "Proyecto"}
            error={Boolean(errors.ID_Project)}
            value={form.ID_Project}
            onChange={(value) =>
              handleChange({ target: { name: "ID_Project", value } })
            }
            selected={() =>
              projectInfo.find((p) => p.ID.toString() === form.ID_Project)
                ?.Name_Project
            }
          >
            {projectInfo.map((p) => (
              <Option key={p.ID} value={p.ID.toString()}>
                {p.Name_Project}
              </Option>
            ))}
          </Select>

          <Select
            label={errors.Engineering_Manager || "Responsable de ingenieria"} //rol = responsable tecnico
            value={form.Engineering_Manager}
            error={Boolean(errors.Engineering_Manager)}
            onChange={(value) =>
              handleChange({ target: { name: "Engineering_Manager", value } })
            }
            selected={() =>
              techManagerInfo.find(
                (tm) => tm.ID.toString() === form.Engineering_Manager
              )?.Name
            }
          >
            {techManagerInfo.map((tm) => (
              <Option key={tm.ID} value={tm.ID.toString()}>
                {tm.Name}
              </Option>
            ))}
          </Select>

          <Select
            label={errors.Purchasing_Director || "Director de compras"}
            value={form.Purchasing_Director}
            error={Boolean(errors.Purchasing_Director)}
            onChange={(value) =>
              handleChange({
                target: { name: "Purchasing_Director", value },
              })
            }
            selected={() =>
              purchasingDirectorInfo.find(
                (d) => d.ID.toString() === form.Purchasing_Director
              )?.Name
            }
          >
            {purchasingDirectorInfo.map((gm) => (
              <Option key={gm.ID} value={gm.ID.toString()}>
                {gm.Name}
              </Option>
            ))}
          </Select>

          <Input
            label={errors.Current_Budget || "Presupuesto Actual"}
            name="Current_Budget"
            type="number"
            value={form.Current_Budget}
            onChange={handleChange}
            error={Boolean(errors.Current_Budget)}
          />

          <Input
            label="Centro de Costos"
            name="Cost_center"
            value={form.Cost_center}
            onChange={handleChange}
          />

          <Input
            label="WBS"
            name="WBS"
            value={form.WBS}
            onChange={handleChange}
          />
        </CardBody>

        {/* ---------- SECCIÓN DINÁMICA UNIDA ---------- */}
        <CardBody className="border-t space-y-4">
          <Typography variant="h6">Purchase Codes</Typography>
  <Select
      label="Códigos existentes"
      value={null} // No selecciona nada
      className="w-full border-gray-300 focus:ring-blue-400"
      menuProps={{
        className: "p-2 max-h-48 overflow-auto", // scroll si hay más de 4 items
        style: { zIndex: 9999 },
      }}
    >
      {/* Buscador */}
      <div className="sticky top-0 z-20 border-b border-gray-200 bg-white px-2 pb-2">
        <Input
          label="Buscar..."
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          className="!text-sm text-black"
        />
      </div>

      {/* Opciones */}
      {filteredCodes.length > 0 ? (
        filteredCodes.map((item) => (
          <Option key={item.ID} value={item.Code_Purchasing}>
            {item.Code_Purchasing} - {item.Name_Order}
          </Option>
        ))
      ) : (
        <Option disabled>No hay códigos existentes</Option>
      )}
    </Select>
          {form.Code_Purchasing.map((_, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-5">
                <Input
                  label={errors.Code_Purchasing?.[i] || `Código ${i + 1}`}
                  value={form.Code_Purchasing[i]}
                  error={Boolean(errors.Code_Purchasing?.[i])}
                  onChange={(e) =>
                    handlePairChange(i, "code", e.target.value)
                  }
                />
              </div>

              <div className="col-span-5">
                <Input
                  label={errors.Name_Order?.[i] || `Orden ${i + 1}`}
                  value={form.Name_Order[i]}
                  error={Boolean(errors.Name_Order?.[i])}
                  onChange={(e) =>
                    handlePairChange(i, "name", e.target.value)
                  }
                />
              </div>

              <div className="col-span-2 flex gap-2">
                <Button color="green" onClick={addPair}>+</Button>
                {form.Code_Purchasing.length > 1 && (
                  <Button color="red" onClick={() => removePair(i)}>-</Button>
                )}
              </div>
            </div>
          ))}
        </CardBody>

        <CardFooter>
          <Button fullWidth color="blue" onClick={handleSubmit}>
            Crear Código
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default NewProjectCode;

