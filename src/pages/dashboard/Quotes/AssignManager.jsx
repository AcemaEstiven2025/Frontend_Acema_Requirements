import axios from "axios";
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

export function AssignManager() {
    const initialForm = {
        user: ''
    };

    const { requirementId } = useParams();
    const [users, setUsers] = useState([]);
    const [requirementData, setRequirementData] = useState({
        project: '',
        code: "",
        name: "",
    });
    const [searchUser, setSearchUser] = useState("");
    const [errors, setErrors] = useState({ user: "" });
    const [form, setForm] = useState(initialForm);

    const filteredUsers = users.filter((u) =>
        u.Name?.toLowerCase().includes(searchUser.toLowerCase()),
    );

    const fields = Object.keys(form);
    const totalRequired = fields.length;
    const completedFields = fields.filter(
        (f) => form[f] && form[f] !== "",
    ).length;
    const progress = Math.round((completedFields / totalRequired) * 100);

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

    const handleChange = (value, name) => {
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: null,
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!form.user) newErrors.user = "El usuario es obligatorio";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

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
                title: "¿Estás seguro?",
                text: "Se asignarán como Gestor al Usuario seleccionado",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Sí, asignar",
                cancelButtonText: "Cancelar",
                reverseButtons: true,
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const { ok, message } = await apiClient.post("/form/assignmanager", form);
                        if (ok) {
                            swalWithTailwind.fire({
                                title: "Gestor asignado 🎉",
                                text: res.data.message || "Asignado correctamente",
                                icon: "success",
                            });
                            setForm(initialForm);
                        } else {
                            swalWithTailwind.fire({
                                title: "Ha ocurrido un problema",
                                text: message || "No se pudo asignar el Gestor",
                                icon: "info",
                            });
                        }
                    } catch {
                        swalWithTailwind.fire({
                            title: "Error",
                            text: "No se pudo asignar el Gestor",
                            icon: "error",
                        });
                    }
                }
            });
    };

    return (
        <div className="mt-12 flex justify-center">
            <Card className="w-full max-w-5xl shadow-lg">
                <CardHeader floated={false} shadow={false} className="p-6">
                    <Typography variant="h4">Asignar Gestor de Facturación</Typography>
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

                    <Select
                        label={errors.user || "Usuario"}
                        value={form.user}
                        onChange={(val) => handleChange(val, "user")}
                        selected={() =>
                            users.find((u) => u.ID.toString() === form.user)?.Name
                        }
                        menuProps={{
                            className: "p-2 max-h-48 overflow-auto",
                            style: { zIndex: 9999 },
                        }}
                        className={`w-full ${errors.user
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
                </CardBody>
                <CardFooter>
                    <Button color="blue" fullWidth onClick={handleSubmit}>
                        Asignar Gestor
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}