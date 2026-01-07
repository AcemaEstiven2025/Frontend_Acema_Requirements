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
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { apiClient } from "@/utils/apiClient";

export function AssignQuoteResponsibles() {
    const { requirementId } = useParams();
    const [users, setUsers] = useState([]);
    const [requirementData, setRequirementData] = useState({
        project: '',
        code: "",
        name: "",
    });
    const [searchUser, setSearchUser] = useState("");
    const [errors, setErrors] = useState({ users: [] });
    const [assignedUsers, setAssignedUsers] = useState([{ ID_User: "" }]);

    const filteredUsers = users.filter((u) =>
        u.Name?.toLowerCase().includes(searchUser.toLowerCase()) && !assignedUsers.find((au) => au.ID_User === u.ID)
    );

    const totalFields = assignedUsers.length;
    const completedFields = assignedUsers.filter((u) => u.ID_User).length;
    const progress = Math.round((completedFields / totalFields) * 100);

    useEffect(() => {
        const loadRequirementData = async () => {
            try {
                const { data, ok } = await apiClient.get("/form/requirementinfo");
                if (ok) {
                    setRequirementData({
                        project: data.project,
                        code: data.code,
                        name: data.name,
                    })
                }
            } catch (error) {
                console.error("Error loading data", error);
            }
        };

        const loadUsersData = async () => {
            try {
                const response = await apiClient.get("/form/info");
                setUsers(response.users)
            } catch (error) {
                console.error("Error loading data", error);
            }
        };

        loadRequirementData();
        loadUsersData();
    }, []);

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

    const validateAssignment = () => {
        let hasError = false;
        const newErrors = { users: [] };
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
            text: "Se asignarán usuarios seleccionados",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "SI, asignar!",
            cancelButtonText: "No, cancelar!",
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            const payload = {
                ID_User: assignedUsers.map((u) => u.ID_User).filter(Boolean),
            };
            try {
                const { ok, message} = await apiClient.post("/form/responsiblesquote", payload);
                if (ok) {
                    swalWithTailwind.fire({
                        title: "Asignación exitosa",
                        text: "Usuarios asignados correctamente 👌",
                        icon: "success",
                        confirmButtonText: "OK",
                    });
                } else {
                    swalWithTailwind.fire({
                        title: "Error",
                        text: message || "Ocurrió un error en el envío",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
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

    return (
        <div className="mt-12 flex justify-center">
            <Card className="w-full max-w-5xl shadow-lg">
                <CardHeader floated={false} shadow={false} className="p-6">
                    <Typography variant="h4">Asignar Responsables de la Cotización</Typography>
                    <div className="mb-1 flex justify-between text-xs">
                        <span>Progreso</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="mt-4">
                        <Progress value={progress} color="green" />
                    </div>
                </CardHeader>
                <CardBody className="grid gap-6">
                    <Input
                        label={"Proyecto"}
                        value={requirementData.project}
                        disabled
                    />

                    <div className="grid grid-cols-[5fr_5fr_1fr] gap-4">
                        <Input
                            label={"Codigo de Venta"}
                            value={requirementData.code}
                            disabled
                        />
                        <Input
                            label={"Nombre del Pedido"}
                            value={requirementData.name}
                            disabled
                        />
                        <Input
                            label={"Codigo del requerimiento"}
                            value={requirementId}
                            disabled
                        />
                    </div>

                    <Typography className="font-semibold">Usuarios</Typography>
                    {assignedUsers.map((row, i) => (
                        <div key={i} className="mb-2 flex gap-3 items-center">
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
                                className={`w-full ${errors.users[i]
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
                </CardBody>
                <CardFooter>
                    <Button color="blue" fullWidth onClick={handleSubmit}>
                        Asignar Responsables
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}