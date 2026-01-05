// import React, { useEffect, useState } from "react";
// import { Card, CardHeader, CardBody, CardFooter, Select, Option, Input, Button, Typography } from "@material-tailwind/react";
// import axios from "axios";
// import Swal from "sweetalert2";

// export function AssingResponible({ profile }) {
//   const [projects, setProjects] = useState([]);
//   const [codePurchasing, setCodePurchasing] = useState([]);
//   const [users, setUsers] = useState([]);

//   const [selectedProject, setSelectedProject] = useState(""); // solo para mostrar
//   const [assignedCodes, setAssignedCodes] = useState([{ ID_CodeProjPurch: "" }]);
//   const [assignedUsers, setAssignedUsers] = useState([{ ID_User: "" }]);

//   const [searchCode, setSearchCode] = useState("");
//   const [searchUser, setSearchUser] = useState("");

//   /* -------------------- LOAD DATA -------------------- */
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const res = await axios.get("/form/info", { withCredentials: true });
// console.log(res.data)
//         setProjects(res.data.projects || []);
//         setCodePurchasing(res.data.projects || []);
//         setUsers(res.data.users || []);
//       } catch (error) {
//         console.error("Error loading data", error);
//       }
//     };
//     loadData();
//   }, []);

//   /* -------------------- HANDLERS -------------------- */
//   const handleChange = (list, setList, index, field, value) => {
//     const newList = [...list];
//     newList[index][field] = value;
//     setList(newList);
//   };

//   const addRow = (list, setList, defaultItem) => setList([...list, defaultItem]);
//   const removeRow = (list, setList, index) => setList(list.filter((_, i) => i !== index));

//   /* -------------------- FILTERED DATA -------------------- */
// const filteredCodes = codePurchasing
//   .filter(c => (!selectedProject || c.ID_Project?.toString() === selectedProject))
//   .filter(c => c.Code_Purchasing?.toLowerCase().includes(searchCode.toLowerCase()));

// const filteredUsers = users
//   .filter(u => u.Name?.toLowerCase().includes(searchUser.toLowerCase()));

//   /* -------------------- SUBMIT -------------------- */
//   const handleSubmit = async () => {
//     const IDs_Code = assignedCodes.map(c => parseInt(c.ID_CodeProjPurch)).filter(Boolean);
//     const IDs_User = assignedUsers.map(u => parseInt(u.ID_User)).filter(Boolean);

//     if (!IDs_Code.length || !IDs_User.length) {
//       Swal.fire("Error", "Debes seleccionar al menos un código y un usuario", "error");
//       return;
//     }

//     try {
//       await axios.post("/form/assignresponsibles", {
//         ID_User: IDs_User,
//         ID_CodeProjPurch: IDs_Code
//       }, { withCredentials: true });

//       Swal.fire("Asignación exitosa", "Usuarios asignados correctamente", "success");
//       setAssignedCodes([{ ID_CodeProjPurch: "" }]);
//       setAssignedUsers([{ ID_User: "" }]);
//     } catch (error) {
//       Swal.fire("Error", "No se pudo asignar usuarios", "error");
//     }
//   };

//   /* -------------------- RENDER -------------------- */
//   return (
//     <Card className="w-full max-w-5xl mx-auto mt-10">
//       <CardHeader floated={false} shadow={false} className="p-6">
//         <Typography variant="h4">Asignar Responsables a Códigos de Compra</Typography>
//         <Typography className="text-blue-gray-600">
//           Solo el encargado puede asignar personas a los códigos de compra
//         </Typography>
//       </CardHeader>
//       <CardBody className="flex flex-col gap-6">

//         {/* ----- PROYECTO ----- */}
//         <div>
//           <Typography className="font-semibold mb-2">Proyecto</Typography>
//           <Select
//             label="Seleccionar Proyecto"
//             value={selectedProject}
//             onChange={(val) => setSelectedProject(val)}
//             selected={() => projects.find(p => p.ID.toString() === selectedProject)?.Name_Project}
//             menuProps={{ className: "p-2 max-h-48 overflow-auto", style: { zIndex: 9999 } }}
//           >
//             {projects.map(p => (
//               <Option key={p.ID} value={p.ID.toString()}>{p.Name_Project}</Option>
//             ))}
//           </Select>
//         </div>

//         {/* ----- CÓDIGOS DE COMPRA ----- */}
//         <div>
//           <Typography className="font-semibold mb-2">Códigos de Compra</Typography>
//           {assignedCodes.map((row, i) => (
//             <div key={i} className="flex gap-3 items-end mb-2">
//               <Select
//                 label="Código de Compra"
//                 value={row.ID_CodeProjPurch}
//                 onChange={(val) => handleChange(assignedCodes, setAssignedCodes, i, "ID_CodeProjPurch", val)}
//                 selected={() => codePurchasing.find(c => c.ID.toString() === row.ID_CodeProjPurch)?.Code_Purchasing}
//                 menuProps={{ className: "p-2 max-h-48 overflow-auto", style: { zIndex: 9999 } }}
//               >
//                 <div className="sticky top-0 z-20 border-b border-gray-200 bg-white px-2 pb-2">
//                   <Input
//                     label="Buscar..."
//                     value={searchCode}
//                     onChange={(e) => setSearchCode(e.target.value)}
//                     className="!text-sm"
//                   />
//                 </div>
//                 {filteredCodes.map(c => (
//                   <Option key={c.ID} value={c.ID.toString()}>{c.Code_Purchasing}</Option>
//                 ))}
//               </Select>
//               <div className="flex gap-2">
//                 <Button size="sm" color="green" onClick={() => addRow(assignedCodes, setAssignedCodes, { ID_CodeProjPurch: "" })}>+</Button>
//                 {assignedCodes.length > 1 && <Button size="sm" color="red" onClick={() => removeRow(assignedCodes, setAssignedCodes, i)}>-</Button>}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* ----- USUARIOS ----- */}
//         <div>
//           <Typography className="font-semibold mb-2">Usuarios</Typography>
//           {assignedUsers.map((row, i) => (
//             <div key={i} className="flex gap-3 items-end mb-2">
//               <Select
//                 label="Usuario"
//                 value={row.ID_User}
//                 onChange={(val) => handleChange(assignedUsers, setAssignedUsers, i, "ID_User", val)}
//                 selected={() => users.find(u => u.ID.toString() === row.ID_User)?.Name}
//                 menuProps={{ className: "p-2 max-h-48 overflow-auto", style: { zIndex: 9999 } }}
//               >
//                 <div className="sticky top-0 z-20 border-b border-gray-200 bg-white px-2 pb-2">
//                   <Input
//                     label="Buscar..."
//                     value={searchUser}
//                     onChange={(e) => setSearchUser(e.target.value)}
//                     className="!text-sm"
//                   />
//                 </div>
//                 {filteredUsers.length > 0 ? filteredUsers.map(u => (
//                   <Option key={u.ID} value={u.ID.toString()}>{u.Name}</Option>
//                 )) : <Option disabled>No hay resultados</Option>}
//               </Select>
//               <div className="flex gap-2">
//                 <Button size="sm" color="green" onClick={() => addRow(assignedUsers, setAssignedUsers, { ID_User: "" })}>+</Button>
//                 {assignedUsers.length > 1 && <Button size="sm" color="red" onClick={() => removeRow(assignedUsers, setAssignedUsers, i)}>-</Button>}
//               </div>
//             </div>
//           ))}
//         </div>

//       </CardBody>
//       <CardFooter>
//         <Button color="blue" fullWidth onClick={handleSubmit}>Asignar Responsables</Button>
//       </CardFooter>
//     </Card>
//   );
// }

// export default AssingResponible

//TODO   *****************************************

// import React, { useEffect, useState } from "react";
// import { Card, CardHeader, CardBody, CardFooter, Select, Option, Input, Button, Typography, Progress } from "@material-tailwind/react";
// import axios from "axios";
// import Swal from "sweetalert2";

// export function AssingResponible({ profile }) {
//   const [projects, setProjects] = useState([]);
//   const [codePurchasing, setCodePurchasing] = useState([]);
//   const [users, setUsers] = useState([]);

//   const [selectedProject, setSelectedProject] = useState("");
//   const [assignedCodes, setAssignedCodes] = useState([{ ID_CodeProjPurch: "" }]);
//   const [assignedUsers, setAssignedUsers] = useState([{ ID_User: "" }]);

//   const [searchCode, setSearchCode] = useState("");
//   const [searchUser, setSearchUser] = useState("");

//   /* -------------------- LOAD DATE -------------------- */

//     useEffect(() => {
//       const loadInfo = async () => {
//         const res = await axios.get("/form/info", { withCredentials: true });
//         const res2 = await axios.get("/form/infoprojects", {
//           withCredentials: true,
//         });
//         setProjects(res2.data.data || []);
//         setUsers(res.data.users || []);
//       };
//       loadInfo();
//     }, []);

//   /* -------------------- HANDLERS -------------------- */
//   const handleChange = (list, setList, index, field, value) => {
//     console.log(list, setList, index, field, value)
//     const newList = [...list];
//     newList[index][field] = value;
//     setList(newList);

//      if (name === "ID_Project") {
//       const project = projects.find(
//         (x) => x.ID.toString() === value
//       );

//       if (project) {
//         setCodePurchasing(project.CodesProjectsPurchasing)}}
//   };

//   const addRow = (list, setList, defaultItem) => setList([...list, defaultItem]);
//   const removeRow = (list, setList, index) => setList(list.filter((_, i) => i !== index));

//   /* -------------------- FILTERED DATA -------------------- */
//   const filteredCodes = codePurchasing
//     .filter(c => (!selectedProject || c.ID_Project?.toString() === selectedProject))
//     .filter(c => c.Code_Purchasing?.toLowerCase().includes(searchCode.toLowerCase()));

//   const filteredUsers = users
//     .filter(u => u.Name?.toLowerCase().includes(searchUser.toLowerCase()));

//   /* -------------------- PROGRESS -------------------- */
//   const totalRequired = assignedCodes.length + assignedUsers.length;
//   const completed =
//     assignedCodes.filter(c => c.ID_CodeProjPurch).length +
//     assignedUsers.filter(u => u.ID_User).length;
//   const progress = totalRequired > 0 ? Math.round((completed / totalRequired) * 100) : 0;

//   /* -------------------- SUBMIT -------------------- */
//   const handleSubmit = async () => {
//     const IDs_Code = assignedCodes.map(c => parseInt(c.ID_CodeProjPurch)).filter(Boolean);
//     const IDs_User = assignedUsers.map(u => parseInt(u.ID_User)).filter(Boolean);

//     if (!IDs_Code.length || !IDs_User.length) {
//       Swal.fire("Error", "Debes seleccionar al menos un código y un usuario", "error");
//       return;
//     }

//     try {
//       await axios.post("/form/assignresponsibles", {
//         ID_User: IDs_User,
//         ID_CodeProjPurch: IDs_Code
//       }, { withCredentials: true });

//       Swal.fire("Asignación exitosa", "Usuarios asignados correctamente", "success");
//       setAssignedCodes([{ ID_CodeProjPurch: "" }]);
//       setAssignedUsers([{ ID_User: "" }]);
//     } catch (error) {
//       Swal.fire("Error", "No se pudo asignar usuarios", "error");
//     }
//   };

//   /* -------------------- RENDER -------------------- */
//   return (
//     <Card className="w-full max-w-5xl mx-auto mt-10 shadow-lg">
//       <CardHeader floated={false} shadow={false} className="p-6">
//         <Typography variant="h4">Asignar Responsables a Códigos de Compra</Typography>
//         <Typography className="text-blue-gray-600 text-sm">
//           Solo el encargado puede asignar personas a los códigos de compra
//         </Typography>

//         {/* ----- BARRA DE PROGRESO ----- */}
//         <div className="mt-4">
//           <div className="flex justify-between text-xs mb-1">
//             <span>Progreso</span>
//             <span>{progress}%</span>
//           </div>
//           <Progress
//             value={progress}
//             color="green"
//             className="transition-all duration-500 ease-in-out"
//           />
//         </div>
//       </CardHeader>

//       <CardBody className="flex flex-col gap-6">

//         {/* ----- PROYECTO ----- */}
//         <div>
//           <Typography className="font-semibold mb-2">Proyecto</Typography>
//           <Select
//             label="Seleccionar Proyecto"
//             value={selectedProject}
//             onChange={(val) => setSelectedProject(val)}
//             selected={() => projects.find(p => p.ID.toString() === selectedProject)?.Name_Project}
//             menuProps={{ className: "p-2 max-h-48 overflow-auto", style: { zIndex: 9999 } }}
//           >
//             {projects.map(p => (
//               <Option key={p.ID} value={p.ID.toString()}>{p.Name_Project}</Option>
//             ))}
//           </Select>
//         </div>

//         {/* ----- CÓDIGOS DE COMPRA ----- */}
//         <div>
//           <Typography className="font-semibold mb-2">Códigos de Compra</Typography>
//           {assignedCodes.map((row, i) => (
//             <div key={i} className="flex gap-3 items-end mb-2">
//               <Select
//                 label="Código de Compra"
//                 value={row.ID_CodeProjPurch}
//                 onChange={(val) => handleChange(assignedCodes, setAssignedCodes, i, "ID_CodeProjPurch", val)}
//                 selected={() => codePurchasing.find(c => c.ID.toString() === row.ID_CodeProjPurch)?.Code_Purchasing}
//                 menuProps={{ className: "p-2 max-h-48 overflow-auto", style: { zIndex: 9999 } }}
//               >
//                 <div className="sticky top-0 z-20 border-b border-gray-200 bg-white px-2 pb-2">
//                   <Input
//                     label="Buscar..."
//                     value={searchCode}
//                     onChange={(e) => setSearchCode(e.target.value)}
//                     className="!text-sm"
//                   />
//                 </div>
//                 {filteredCodes.length > 0 ? filteredCodes.map(c => (
//                   <Option key={c.ID} value={c.ID.toString()}>{c.Code_Purchasing}</Option>
//                 )) : <Option disabled>No hay resultados</Option>}
//               </Select>
//               <div className="flex gap-2">
//                 <Button size="sm" color="green" onClick={() => addRow(assignedCodes, setAssignedCodes, { ID_CodeProjPurch: "" })}>+</Button>
//                 {assignedCodes.length > 1 && <Button size="sm" color="red" onClick={() => removeRow(assignedCodes, setAssignedCodes, i)}>-</Button>}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* ----- USUARIOS ----- */}
//         <div>
//           <Typography className="font-semibold mb-2">Usuarios</Typography>
//           {assignedUsers.map((row, i) => (
//             <div key={i} className="flex gap-3 items-end mb-2">
//               <Select
//                 label="Usuario"
//                 value={row.ID_User}
//                 onChange={(val) => handleChange(assignedUsers, setAssignedUsers, i, "ID_User", val)}
//                 selected={() => users.find(u => u.ID.toString() === row.ID_User)?.Name}
//                 menuProps={{ className: "p-2 max-h-48 overflow-auto", style: { zIndex: 9999 } }}
//               >
//                 <div className="sticky top-0 z-20 border-b border-gray-200 bg-white px-2 pb-2">
//                   <Input
//                     label="Buscar..."
//                     value={searchUser}
//                     onChange={(e) => setSearchUser(e.target.value)}
//                     className="!text-sm"
//                   />
//                 </div>
//                 {filteredUsers.length > 0 ? filteredUsers.map(u => (
//                   <Option key={u.ID} value={u.ID.toString()}>{u.Name}</Option>
//                 )) : <Option disabled>No hay resultados</Option>}
//               </Select>
//               <div className="flex gap-2">
//                 <Button size="sm" color="green" onClick={() => addRow(assignedUsers, setAssignedUsers, { ID_User: "" })}>+</Button>
//                 {assignedUsers.length > 1 && <Button size="sm" color="red" onClick={() => removeRow(assignedUsers, setAssignedUsers, i)}>-</Button>}
//               </div>
//             </div>
//           ))}
//         </div>

//       </CardBody>

//       <CardFooter>
//         <Button color="blue" fullWidth onClick={handleSubmit}>Asignar Responsables</Button>
//       </CardFooter>
//     </Card>
//   );
// }

// export default AssingResponible;

// import React, { useEffect, useState } from "react";
// import { Card, CardHeader, CardBody, CardFooter, Select, Option, Input, Button, Typography, Progress } from "@material-tailwind/react";
// import axios from "axios";
// import Swal from "sweetalert2";

// export function AssingResponible() {
//   /* -------------------- STATES -------------------- */
//   const [projects, setProjects] = useState([]);
//   const [codePurchasing, setCodePurchasing] = useState([]);
//   const [users, setUsers] = useState([]);

//   const [selectedProject, setSelectedProject] = useState("");
//   const [assignedCodes, setAssignedCodes] = useState([{ ID_CodeProjPurch: "" }]);
//   const [assignedUsers, setAssignedUsers] = useState([{ ID_User: "" }]);

//   const [searchCode, setSearchCode] = useState("");
//   const [searchUser, setSearchUser] = useState("");

//   /* -------------------- LOAD DATA -------------------- */
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const res = await axios.get("/form/info", { withCredentials: true });
//         setProjects(res.data.projects || []);
//         setUsers(res.data.users || []);
//       } catch (error) {
//         console.error("Error loading data", error);
//       }
//     };
//     loadData();
//   }, []);

//   /* -------------------- FILTER CODES -------------------- */
//   useEffect(() => {
//     if (!selectedProject) {
//       setCodePurchasing([]);
//       return;
//     }

//     const project = projects.find((p) => p.ID.toString() === selectedProject);
//     if (project) {
//       // Asignar los códigos de compra del proyecto seleccionado
//       setCodePurchasing(project.CodesProjectsPurchasing || []);
//     }
//   }, [selectedProject, projects]);

//   /* -------------------- HANDLERS -------------------- */
//   const handleChange = (list, setList, index, field, value) => {
//     const newList = [...list];
//     newList[index][field] = value;
//     setList(newList);
//   };

//   const addRow = (list, setList, defaultItem) => setList([...list, defaultItem]);
//   const removeRow = (list, setList, index) => setList(list.filter((_, i) => i !== index));

//   /* -------------------- FILTERED OPTIONS -------------------- */
//   const filteredCodes = codePurchasing.filter((c) =>
//     c.Code_Purchasing?.toLowerCase().includes(searchCode.toLowerCase())
//   );

//   const filteredUsers = users.filter((u) =>
//     u.Name?.toLowerCase().includes(searchUser.toLowerCase())
//   );

//   /* -------------------- PROGRESS -------------------- */
//   const totalFields = assignedCodes.length + assignedUsers.length + 1; // +1 por proyecto
//   const completedFields =
//     (selectedProject ? 1 : 0) +
//     assignedCodes.filter((c) => c.ID_CodeProjPurch).length +
//     assignedUsers.filter((u) => u.ID_User).length;

//   const progress = Math.round((completedFields / totalFields) * 100);

//   /* -------------------- SUBMIT -------------------- */

// const handleSubmit = async () => {
//   try {
//     // -------------------- VALIDACIONES --------------------
//     if (!selectedProject) {
//       Swal.fire("Error", "Debes seleccionar un proyecto", "error");
//       return;
//     }

//     // IDs únicos y no vacíos
//     const IDs_Code = [...new Set(assignedCodes.map(c => parseInt(c.ID_CodeProjPurch)).filter(Boolean))];
//     const IDs_User = [...new Set(assignedUsers.map(u => parseInt(u.ID_User)).filter(Boolean))];

//     if (!IDs_Code.length) {
//       Swal.fire("Error", "Debes seleccionar al menos un código de compra", "error");
//       return;
//     }
//     if (!IDs_User.length) {
//       Swal.fire("Error", "Debes seleccionar al menos un usuario", "error");
//       return;
//     }

//     // Validar duplicados antes de enviar
//     if (IDs_Code.length !== assignedCodes.length) {
//       Swal.fire("Error", "Hay códigos de compra repetidos, elimínalos antes de enviar", "error");
//       return;
//     }
//     if (IDs_User.length !== assignedUsers.length) {
//       Swal.fire("Error", "Hay usuarios repetidos, elimínalos antes de enviar", "error");
//       return;
//     }

//     // -------------------- SWEETALERT2 TAILWIND --------------------
//     const swalWithTailwind = Swal.mixin({
//       customClass: {
//         popup: "rounded-xl p-4",
//         title: "text-lg font-semibold text-gray-800",
//         htmlContainer: "text-sm text-gray-600",
//         confirmButton:
//           "ml-10 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400",
//         cancelButton:
//           "mr-10 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400",
//       },
//       buttonsStyling: false,
//     });

//     const result = await swalWithTailwind.fire({
//       title: "¿Estás seguro?",
//       text: "Se asignarán los códigos y usuarios seleccionados",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "SI, asignar!",
//       cancelButtonText: "No, cancelar!",
//       reverseButtons: true,
//     });

//     if (result.isConfirmed) {
//       // -------------------- ENVIAR DATOS --------------------
//       const payload = {
//         ID_User: IDs_User,
//         ID_CodeProjPurch: IDs_Code,
//       };

//       const response = await axios.post("/form/requirementauth", payload, { withCredentials: true });

//       if (response.status === 200) {
//         swalWithTailwind.fire({
//           title: "Asignación exitosa",
//           text: "Usuarios asignados correctamente 👌",
//           icon: "success",
//           confirmButtonText: "OK",
//         });

//         // Reset del formulario
//         setAssignedCodes([{ ID_CodeProjPurch: "" }]);
//         setAssignedUsers([{ ID_User: "" }]);
//         setSelectedProject("");
//         setCodePurchasing([]);
//       } else {
//         swalWithTailwind.fire({
//           title: "Error",
//           text: "No se pudo completar la asignación",
//           icon: "error",
//           confirmButtonText: "OK",
//         });
//       }
//     } else if (result.dismiss === Swal.DismissReason.cancel) {
//       swalWithTailwind.fire({
//         title: "Cancelado",
//         text: "La asignación fue cancelada 😢",
//         icon: "error",
//         confirmButtonText: "OK",
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     Swal.fire("Error", "Ocurrió un error al procesar la solicitud", "error");
//   }
// };

//   /* -------------------- RENDER -------------------- */
//   return (
//     <Card className="w-full max-w-5xl mx-auto mt-10">
//       <CardHeader floated={false} shadow={false} className="p-6">
//         <Typography variant="h4">Asignar Responsables a Códigos de Compra</Typography>
//         <div className="mt-2 text-sm text-blue-gray-600">Solo el encargado puede asignar personas a los códigos de compra</div>
//         <div className="mt-4">
//           <Progress value={progress} color="green" label={`${progress}%`} />
//         </div>
//       </CardHeader>

//       <CardBody className="flex flex-col gap-6">
//         {/* PROYECTO */}
//         <div>
//           <Typography className="font-semibold mb-2">Proyecto</Typography>
//           <Select
//             label="Seleccionar Proyecto"
//             value={selectedProject}
//             onChange={(val) => setSelectedProject(val)}
//             selected={() => projects.find((p) => p.ID.toString() === selectedProject)?.Name_Project}
//             menuProps={{ className: "p-2 max-h-48 overflow-auto", style: { zIndex: 9999 } }}
//           >
//             {projects.map((p) => (
//               <Option key={p.ID} value={p.ID.toString()}>{p.Name_Project}</Option>
//             ))}
//           </Select>
//         </div>

//         {/* CÓDIGOS DE COMPRA */}
//         <div>
//           <Typography className="font-semibold mb-2">Códigos de Compra</Typography>
//           {assignedCodes.map((row, i) => (
//             <div key={i} className="flex gap-3 items-end mb-2">
//               <Select
//                 label="Código de Compra"
//                 value={row.ID_CodeProjPurch}
//                 onChange={(val) => handleChange(assignedCodes, setAssignedCodes, i, "ID_CodeProjPurch", val)}
//                 selected={() => codePurchasing.find(c => c.ID.toString() === row.ID_CodeProjPurch)?.Code_Purchasing}
//                 menuProps={{ className: "p-2 max-h-48 overflow-auto", style: { zIndex: 9999 } }}
//               >
//                 <div className="sticky top-0 z-20 border-b border-gray-200 bg-white px-2 pb-2">
//                   <Input
//                     label="Buscar..."
//                     value={searchCode}
//                     onChange={(e) => setSearchCode(e.target.value)}
//                     className="!text-sm"
//                   />
//                 </div>
//                 {filteredCodes.length > 0 ? filteredCodes.map((c) => (
//                   <Option key={c.ID} value={c.ID.toString()}>{c.Code_Purchasing}</Option>
//                 )) : <Option disabled>No hay resultados</Option>}
//               </Select>
//               <div className="flex gap-2">
//                 <Button size="sm" color="green" onClick={() => addRow(assignedCodes, setAssignedCodes, { ID_CodeProjPurch: "" })}>+</Button>
//                 {assignedCodes.length > 1 && <Button size="sm" color="red" onClick={() => removeRow(assignedCodes, setAssignedCodes, i)}>-</Button>}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* USUARIOS */}
//         <div>
//           <Typography className="font-semibold mb-2">Usuarios</Typography>
//           {assignedUsers.map((row, i) => (
//             <div key={i} className="flex gap-3 items-end mb-2">
//               <Select
//                 label="Usuario"
//                 value={row.ID_User}
//                 onChange={(val) => handleChange(assignedUsers, setAssignedUsers, i, "ID_User", val)}
//                 selected={() => users.find(u => u.ID.toString() === row.ID_User)?.Name}
//                 menuProps={{ className: "p-2 max-h-48 overflow-auto", style: { zIndex: 9999 } }}
//               >
//                 <div className="sticky top-0 z-20 border-b border-gray-200 bg-white px-2 pb-2">
//                   <Input
//                     label="Buscar..."
//                     value={searchUser}
//                     onChange={(e) => setSearchUser(e.target.value)}
//                     className="!text-sm"
//                   />
//                 </div>
//                 {filteredUsers.length > 0 ? filteredUsers.map((u) => (
//                   <Option key={u.ID} value={u.ID.toString()}>{u.Name}</Option>
//                 )) : <Option disabled>No hay resultados</Option>}
//               </Select>
//               <div className="flex gap-2">
//                 <Button size="sm" color="green" onClick={() => addRow(assignedUsers, setAssignedUsers, { ID_User: "" })}>+</Button>
//                 {assignedUsers.length > 1 && <Button size="sm" color="red" onClick={() => removeRow(assignedUsers, setAssignedUsers, i)}>-</Button>}
//               </div>
//             </div>
//           ))}
//         </div>
//       </CardBody>

//       <CardFooter>
//         <Button color="blue" fullWidth onClick={handleSubmit}>Asignar Responsables</Button>
//       </CardFooter>
//     </Card>
//   );
// }

// export default AssingResponible;

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
        const res = await axios.get("/form/info", { withCredentials: true });
        setProjects(res.data.projects || []);
        setUsers(res.data.users || []);
      } catch (error) {
        console.error("Error loading data", error);
      }
    };
    loadData();
  }, []);

  /* -------------------- FILTER CODES -------------------- */
  useEffect(() => {
    if (!selectedProject) {
      setCodePurchasing([]);
      return;
    }

    const project = projects.find((p) => p.ID.toString() === selectedProject);
    if (project) {
      setCodePurchasing(project.CodesProjectsPurchasing || []);
    }
  }, [selectedProject, projects]);

  /* -------------------- HANDLERS -------------------- */
  const handleChange = (list, setList, index, field, value) => {
    const newList = [...list];
    newList[index][field] = value;
    setList(newList);

    // Reset error for this row
    if (field === "ID_CodeProjPurch") {
      setErrors((prev) => {
        const newCodesErrors = [...prev.codes];
        newCodesErrors[index] = "";
        return { ...prev, codes: newCodesErrors };
      });
    }

    if (field === "ID_User") {
      setErrors((prev) => {
        const newUsersErrors = [...prev.users];
        newUsersErrors[index] = "";
        return { ...prev, users: newUsersErrors };
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
        const newErrors = [...prev[errorField]];
        newErrors.splice(index, 1);
        return { ...prev, [errorField]: newErrors };
      });
  };

  /* -------------------- FILTERED OPTIONS -------------------- */
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

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = async () => {
    let hasError = false;
    const newErrors = { project: "", codes: [], users: [] };

    // Proyecto
    if (!selectedProject) {
      newErrors.project = "Debes seleccionar un proyecto";
      hasError = true;
    }

    // Códigos
    const codeIds = assignedCodes.map((c) => c.ID_CodeProjPurch);
    const uniqueCodeIds = [...new Set(codeIds.filter(Boolean))];
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

    // Usuarios
    const userIds = assignedUsers.map((u) => u.ID_User);
    const uniqueUserIds = [...new Set(userIds.filter(Boolean))];
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

    setErrors(newErrors);

    if (hasError) return;

    // -------------------- SWEETALERT2 CONFIRM --------------------
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
        ID_User: uniqueUserIds,
        ID_CodeProjPurch: uniqueCodeIds,
      };
      try {
        const response = await axios.post("/form/requirementauth", payload, {
          withCredentials: true,
        });
        if (response.status === 200) {
          swalWithTailwind.fire({
            title: "Asignación exitosa",
            text: "Usuarios asignados correctamente 👌",
            icon: "success",
            confirmButtonText: "OK",
          });
          setAssignedCodes([{ ID_CodeProjPurch: "" }]);
          setAssignedUsers([{ ID_User: "" }]);
          setSelectedProject("");
          setCodePurchasing([]);
          setErrors({ project: "", codes: [], users: [] });
        }
      } catch (err) {
        swalWithTailwind.fire({
          title: "Error",
          text: "Ocurrio un error en el envio",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  /* -------------------- RENDER -------------------- */
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
      {/* PROYECTO */}
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

      {/* CÓDIGOS DE COMPRA */}
      <div>
        <Typography className="mb-2 font-semibold">Códigos de Compra</Typography>
        {assignedCodes.map((row, i) => {
          const selectedCodeName =
            codePurchasing.find(
              (c) => c.ID.toString() === row.ID_CodeProjPurch
            )?.Name_Order || "";

          return (
            <div
              key={i}
              className="mb-2 flex flex-col gap-3 md:flex-row md:items-end"
            >
              {/* SELECT */}
              <Select
                label={errors.codes[i] ? errors.codes[i] : "Código de Compra"}
                value={row.ID_CodeProjPurch}
                onChange={(val) => {
                  handleChange(
                    assignedCodes,
                    setAssignedCodes,
                    i,
                    "ID_CodeProjPurch",
                    val
                  );
                  setErrors((prev) => {
                    const newCodesErrors = [...prev.codes];
                    newCodesErrors[i] = "";
                    return { ...prev, codes: newCodesErrors };
                  });
                }}
                selected={() =>
                  codePurchasing.find(
                    (c) => c.ID.toString() === row.ID_CodeProjPurch
                  )?.Code_Purchasing
                }
                menuProps={{
                  className: "p-2 max-h-48 overflow-auto",
                  style: { zIndex: 9999 },
                }}
                className={`w-full  ${
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
                    <Option key={c.ID} value={c.ID.toString()}>
                      {c.Code_Purchasing}
                    </Option>
                  ))
                ) : (
                  <Option disabled>No hay resultados</Option>
                )}
              </Select>

              {/* INPUT AL LADO DEL SELECT */}
              <Input
                value={selectedCodeName}
                readOnly
                label="Nombre del Pedido"
                className="w-full  bg-gray-100"
              />

              {/* BOTONES + / - */}
              <div className="flex gap-2 mt-2 md:mt-0">
                <Button
                  size="sm"
                  color="green"
                  onClick={() =>
                    addRow(
                      assignedCodes,
                      setAssignedCodes,
                      { ID_CodeProjPurch: "" },
                      "codes"
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

      {/* USUARIOS */}
      <div>
        <Typography className="mb-2 font-semibold">Usuarios</Typography>
        {assignedUsers.map((row, i) => (
          <div key={i} className="mb-2 flex items-end gap-3">
            <Select
              label={errors.users[i] ? errors.users[i] : "Usuario"}
              value={row.ID_User}
              onChange={(val) => {
                handleChange(
                  assignedUsers,
                  setAssignedUsers,
                  i,
                  "ID_User",
                  val
                );
                setErrors((prev) => {
                  const newUsersErrors = [...prev.users];
                  newUsersErrors[i] = "";
                  return { ...prev, users: newUsersErrors };
                });
              }}
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
                      "users"
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
