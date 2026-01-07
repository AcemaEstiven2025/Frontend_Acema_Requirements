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
import {
    ArrowDownTrayIcon
} from "@heroicons/react/24/solid";
import { useMaterialTailwindController } from "@/context";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "@/utils/apiClient";

const icon = {
    className: "w-5 h-5 text-inherit",
};

export function Quotes() {
    const { requirementId } = useParams();
    const [controller] = useMaterialTailwindController();
    const { profile } = controller;

    const initialForm = {
        Supply: "",
        ID_Requirement: requirementId || "",
        ID_User: profile.id.toString(),

    };

    const [form, setForm] = useState(initialForm);
    const [generalInfo, setGeneralInfo] = useState({});

    const requirementsSelect = generalInfo?.requirements?.map(requirement => {
        const projectFound = generalInfo?.projects?.find(project => project.ID == requirement.ID_Project);
        const codePurchasing = projectFound?.CodesProjectsPurchasing?.find(code => code.ID == requirement.ID_CodePurchasing);
        return {
            value: requirement.ID.toString(),
            label: `${projectFound?.Name_Project} - ${codePurchasing?.Code_Purchasing} - ${requirement.Requirement_Group}`,
        }
    });

    const progress = 0;

    useEffect(() => {
        const loadGeneralInfo = async () => {
            const response = apiClient("/form/info");
            setGeneralInfo(response);
        };

        loadGeneralInfo();
    }, []);

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

    const handleDownloadExcel = async () => {
        try {
            const response = await apiClient({
                url: '/templates/quotes',
                method: 'GET',
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response]));

            const link = document.createElement('a');
            link.href = url;

            link.setAttribute('download', 'Plantilla cotizacion.xlsx');

            document.body.appendChild(link);
            link.click();

            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Error al descargar el archivo:", error);
        }
    };

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

    return (
        <Card className="w-full border border-blue-gray-100 shadow-sm">
            <CardHeader
                floated={false}
                shadow={false}
                color="transparent"
                className="m-0 p-6"
            >
                <Typography variant="h5" color="blue-gray">
                    Crear Cotización
                </Typography>
                <Typography variant="small" className="text-blue-gray-600">
                    Complete la información para generar una nueva Cotización.
                </Typography>
            </CardHeader>
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
            <CardBody className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-6 pt-0">
                    <Select
                        label={
                            errors.Requirement_Group
                                ? errors.Requirement_Group
                                : "Número de Requerimiento"
                        }
                        name="Requirement_Group"
                        value={form.ID_Requirement}
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
                    <Input
                        label={"Proveedor"}
                        value={form.Supply}
                    />
                </div>

                <div className="flex gap-2 items-center">
                    <Input
                        label="Pegar desde Excel (Ctrl + V)"
                        placeholder="Pega aquí las filas copiadas desde Excel"
                        className="placeholder:opacity-0 focus:placeholder:opacity-100"
                        onPaste={handlePasteFromExcel}
                    />
                    <Button variant="filled" color="blue" onClick={handleDownloadExcel}> <ArrowDownTrayIcon {...icon} /> </Button>
                </div>
            </CardBody>
        </Card>
    )
}