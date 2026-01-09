import {
    Typography,
    Card,
    CardHeader,
    CardBody,
    Input,
    Button,
    Select,
    Option,
    Textarea,
    Progress,
    CardFooter,
} from "@material-tailwind/react";
import {
    ArrowDownTrayIcon,
    ArrowUpTrayIcon,
    DocumentIcon,
    XCircleIcon
} from "@heroicons/react/24/solid";
import { useMaterialTailwindController } from "@/context";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "@/utils/apiClient";
import Swal from "sweetalert2";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    `pdfjs-dist/build/pdf.worker.min.mjs`,
    import.meta.url
).toString();

const icon = {
    className: "w-5 h-5 text-inherit",
};

export function Quotes() {
    const { requirementId } = useParams();
    const [controller] = useMaterialTailwindController();
    const { profile } = controller;

    const fileInputRef = useRef(null);
    const scrollRef = useRef(null);

    const initialForm = {
        Supply: [""],
        ID_Requirement: requirementId || "",
        ID_User: profile.id.toString(),
        Suggested_Supplier: "",
        Quantity: [""],
        Term: [""],
        UnitCost: [""],
        IVA: [""],
        File: null,
    };

    const [form, setForm] = useState(initialForm);
    const [generalInfo, setGeneralInfo] = useState({});
    const [searchRequirements, setSearchRequirements] = useState("");
    const [errors, setErrors] = useState({});
    const [itemsPerPage, setItemsPerPage] = useState(4);
    const [page, setPage] = useState(1);

    /* -------------------- ESTADOS PDF -------------------- */
    const [numPagesPdf, setNumPagesPdf] = useState(null);
    const [pageNumberPdf, setPageNumberPdf] = useState(1);
    const [scalePdf, setScalePdf] = useState(1.0);
    const [pdfWidth, setPdfWidth] = useState(window.innerWidth > 640 ? 400 : 250);

    /* -------------------- PROGRESS -------------------- */
    const staticFields = ["ID_Requirement", "Suggested_Supplier"];
    const arrayFields = ["Supply", "UnitCost", "Quantity"];
    const itemCount = Array.isArray(form.Supply) ? form.Supply.length : 0;
    const totalTasks = staticFields.length + (arrayFields.length * itemCount);
    const completedStatic = staticFields.filter(
        (f) => form[f] && String(form[f]).trim().length > 0
    ).length;
    let completedArrays = 0;
    if (itemCount > 0) {
        arrayFields.forEach(field => {
            const currentArray = form[field] || [];
            const filledInArray = currentArray.filter(
                val => val !== undefined && val !== null && String(val).trim() !== ""
            ).length;
            completedArrays += filledInArray;
        });
    }
    const totalCompleted = completedStatic + completedArrays;
    const progress = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

    /* -------------------- PAGINACION -------------------- */
    const itemsPerPageOptions = [4, 8, 10, 50];
    const totalItems = form.Supply.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedSupply = form.Supply.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage,
    );

    const requirementsSelect = generalInfo?.requirements?.map(requirement => {
        const projectFound = generalInfo?.projects?.find(project => project.ID == requirement.ID_Project);
        const codePurchasing = projectFound?.CodesProjectsPurchasing?.find(code => code.ID == requirement.ID_CodePurchasing);
        return {
            value: requirement.Requirement_Group.toString(),
            label: `${projectFound?.Name_Project} - ${codePurchasing?.Code_Purchasing} - Req No.${requirement.Requirement_Group}`,
        }
    });

    const zoomIn = () => setScalePdf(prev => Math.min(prev + 0.2, 3.0));
    const zoomOut = () => setScalePdf(prev => Math.max(prev - 0.2, 0.5));
    const resetZoom = () => setScalePdf(1.0);

    useEffect(() => {
        const handleResize = () => {
            setPdfWidth(window.innerWidth > 640 ? 400 : 250);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const loadGeneralInfo = async () => {
            const response = await apiClient("/form/info");
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
                !newForm.Quantity[itemsCount] &&
                !newForm.Term[itemsCount] &&
                !newForm.UnitCost[itemsCount] &&
                !newForm.IVA[itemsCount]
            ) {
                newForm.Supply.splice(itemsCount, 1);
                newForm.Quantity.splice(itemsCount, 1);
                newForm.Term.splice(itemsCount, 1);
                newForm.UnitCost.splice(itemsCount, 1);
                newForm.IVA.splice(itemsCount, 1);
            }
            rows.forEach((row) => {
                const cols = row.split("\t");

                // Ajusta el orden según tu Excel
                const [
                    supply = "",
                    quantity = "",
                    term = "",
                    unitCost = "",
                    iva = "",
                ] = cols;

                newForm.Supply.push(supply);
                newForm.Quantity.push(quantity);
                newForm.Term.push(term);
                newForm.UnitCost.push(unitCost);
                newForm.IVA.push(iva);
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

    const addRow = () => {
        setForm((prev) => ({
            ...prev,
            Supply: [...prev.Supply, ""],
            UnitCost: [...prev.UnitCost, ""],
            Quantity: [...prev.Quantity, ""],
            Term: [...prev.Term, ""],
            IVA: [...prev.IVA, ""],
        }));

        setPage((_) => Math.ceil((form.Supply.length + 1) / itemsPerPage));
    };

    const removeRow = (pageIndex) => {
        setForm((prev) => {
            if (prev.Supply.length === 1) return prev;
            const absoluteIndex = (page - 1) * itemsPerPage + pageIndex;

            const newSupply = prev.Supply.filter((_, i) => i !== absoluteIndex);
            const newQuantity = prev.Quantity.filter((_, i) => i !== absoluteIndex);
            const newTerm = prev.Term.filter((_, i) => i !== absoluteIndex);
            const newUnitCost = prev.UnitCost.filter((_, i) => i !== absoluteIndex);
            const newIVA = prev.IVA.filter((_, i) => i !== absoluteIndex);


            // Ajustar la página si la página actual queda vacía
            const newTotalItems = newSupply.length;
            const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);
            if (page > newTotalPages) setPage(newTotalPages || 1); // Evita 0

            return {
                ...prev,
                Supply: newSupply,
                Quantity: newQuantity,
                Term: newTerm,
                UnitCost: newUnitCost,
                IVA: newIVA,
            };
        });
    };

    const handleFileClick = () => {
        fileInputRef.current.click();
    };

    const onFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setForm(prev => ({ ...prev, File: selectedFile }));
        }
    }

    const clearFile = () => {
        setForm(prev => ({ ...prev, File: null }));
        fileInputRef.current.value = null;
    };

    function onDocumentLoadSuccess({ numPages }) {
        setNumPagesPdf(numPages);
    };

    const handleMouseDown = (e) => {
        const container = scrollRef.current;
        container.style.cursor = 'grabbing'; // Cambia a mano cerrada al apretar

        const startX = e.pageX - container.offsetLeft;
        const startY = e.pageY - container.offsetTop;
        const scrollLeft = container.scrollLeft;
        const scrollTop = container.scrollTop;

        const handleMouseMove = (e) => {
            const x = e.pageX - container.offsetLeft;
            const y = e.pageY - container.offsetTop;
            const walkX = (x - startX) * 1.5; // Velocidad de movimiento
            const walkY = (y - startY) * 1.5;
            container.scrollLeft = scrollLeft - walkX;
            container.scrollTop = scrollTop - walkY;
        };

        const handleMouseUp = () => {
            container.style.cursor = 'grab';
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const validateForm = () => {
        const newErrors = {};
        const excludedFields = ["IVA", "Term", "File"];

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

    const normalizeArray = (arr) =>
        Array.isArray(arr)
            ? arr.map((v) => (v === "" || v === undefined ? null : v))
            : [];

    const buildFormData = (form) => {
        const formData = new FormData();
        // 🔹 campos simples
        formData.append("ID_Requirement", form.ID_Requirement);
        formData.append("Suggested_Supplier", form.Suggested_Supplier);

        // 🔹 arrays NORMALIZADOS
        const Supply = normalizeArray(form.Supply);
        const Term = normalizeArray(form.Term);
        const Quantity = normalizeArray(form.Quantity);
        const UnitCost = normalizeArray(form.UnitCost);
        const IVA = normalizeArray(form.IVA);

        Supply.forEach((v, i) => {
            formData.append(`Supply[${i}]`, v ?? "");
        });

        Term.forEach((v, i) => {
            formData.append(`Term[${i}]`, v ?? "");
        });

        Quantity.forEach((v, i) => {
            formData.append(`Quantity[${i}]`, v ?? "");
        });

        UnitCost.forEach((v, i) => {
            formData.append(`UnitCost[${i}]`, v ?? "");
        });

        IVA.forEach((v, i) => {
            formData.append(`IVA[${i}]`, v ?? "");
        });

        if (form.File) {
            formData.append("file", form.File);
        }

        return formData;
    };

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
                    title: "Estas seguro de Crear esta Cotización?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "SI, Crear!",
                    cancelButtonText: "No, cancelar!",
                    reverseButtons: true,
                })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        const formData = buildFormData(form);
                        const { ok, message } = await apiClient.post("/form/quotes", formData);
                        if (ok) {
                            swalWithTailwind.fire({
                                title: "CREADO",
                                text: "Requerimiento de compra creado exitosamente. 👌",
                                icon: "success",
                                confirmButtonText: "OK",
                            });
                        } else {
                            swalWithTailwind.fire({
                                title: "No se pudo crear el requerimiento",
                                text: message,
                                icon: "info",
                                confirmButtonText: "OK",
                            });
                        }
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        swalWithTailwind.fire({
                            title: "CANCELADO",
                            text: "COTIZACIÓN CANCELADO 😢",
                            icon: "error",
                            confirmButtonText: "OK",
                        });
                    }
                });
        } catch (error) {
            console.error(error);
        }
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-0">
                    <Select
                        label={
                            errors.ID_Requirement
                                ? "El campo Número de Requerimiento es obligatorio"
                                : "Número de Requerimiento"
                        }
                        name="ID_Requirement"
                        value={form.ID_Requirement}
                        onChange={(value) =>
                            handleChange({
                                target: { name: "ID_Requirement", value },
                            })
                        }
                        disabled={!!requirementId}
                        selected={() =>
                            requirementsSelect?.find(
                                (p) =>
                                    p.value.toString() ===
                                    form.ID_Requirement,
                            )?.label
                        }
                        menuProps={{
                            className: "p-2 max-h-48 overflow-auto",
                        }}
                        className={`w-full ${errors.ID_Requirement ? "border-red-500 text-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`}
                    >
                        <div className="sticky top-0 z-20 border-b border-gray-200 bg-white px-2 pb-2">
                            <Input
                                label="Buscar..."
                                value={searchRequirements}
                                onChange={(e) => setSearchRequirements(e.target.value)}
                                className="!text-sm"
                            />
                        </div>
                        {requirementsSelect?.length > 0 ? (
                            requirementsSelect?.map((r) => (
                                <Option
                                    key={r.value}
                                    value={r.value.toString()}
                                >
                                    {r.label.toString()}
                                </Option>
                            ))
                        ) : (
                            <Option disabled>No hay resultados</Option>
                        )}
                    </Select>
                    <Input
                        label={
                            errors.Suggested_Supplier ? "El campo Proveedor es obligatorio" : "Proveedor"
                        }
                        type="text"
                        name="Suggested_Supplier"
                        value={form.Suggested_Supplier}
                        onChange={handleChange}
                        className={`w-full ${errors.Suggested_Supplier ? "!focus:ring-red-400 !border-red-500 !text-red-500"
                            : "border-gray-300 focus:ring-blue-400"
                            }`}
                    />
                </div>

                <div className="flex flex-col w-full justify-center items-center">
                    <div className="flex flex-col items-center justify-center w-full max-w-xs">
                        <input
                            ref={fileInputRef}
                            type="file"
                            style={{ display: 'none' }}
                            onChange={onFileChange}
                            accept="application/pdf"
                        />
                        <div
                            className="group relative items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-blue-50 hover:border-blue-400 transition-all cursor-pointer"
                        >
                            {form.File ? (
                                <div className="flex flex-col items-center text-center gap-4 p-6">
                                    <DocumentIcon className="w-9 h-9 text-inherit" />
                                    <p className="text-base font-medium text-gray-700 truncate w-48">
                                        {form.File.name}
                                    </p>
                                    <button
                                        onClick={clearFile}
                                        className="absolute top-2 right-2 p-1 hover:text-blue-600"
                                    >
                                        <XCircleIcon className="w-7 h-7 text-inherit" />
                                    </button>
                                </div>
                            ) : (
                                <div className="size-full p-4" onClick={handleFileClick}>
                                    <div className="flex flex-col items-center justify-center" >
                                        <div className="p-3 mb-2 group-hover:scale-110 transition-transform">
                                            <ArrowUpTrayIcon {...icon} />
                                        </div>
                                        <p className="text-sm font-semibold text-gray-600">
                                            Subir Cotización
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Solo .pdf
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
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
                <div className={form.File ? "grid lg:grid-cols-[30vw_1fr] size-full gap-6" : "flex flex-col sm:flex-row size-full gap-6"}>
                    {form.File && (
                        <div className="w-full">
                            <div
                                className="relative border border-blue-gray-100 rounded-b-lg bg-gray-200 overflow-auto shadow-inner h-[380px] sm:h-[550px] w-[305px] sm:w-full"
                                style={{
                                    cursor: scalePdf > 1 ? 'grab' : 'default'
                                }}
                                ref={scrollRef}
                                onMouseDown={handleMouseDown}
                            >
                                <div className="flex justify-center items-start min-h-full p-4">
                                    <Document
                                        file={form.File}
                                        onLoadSuccess={onDocumentLoadSuccess}
                                    >
                                        <Page
                                            pageNumber={pageNumberPdf}
                                            scale={scalePdf}
                                            renderTextLayer={false}
                                            renderAnnotationLayer={false}
                                            width={pdfWidth}
                                        />
                                    </Document>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 mb-4 justify-center">
                                <Button size="sm" variant="text" onClick={zoomOut} className="flex items-center gap-2">
                                    -
                                </Button>
                                <Typography variant="small" className="font-bold w-12 text-center">
                                    {Math.round(scalePdf * 100)}%
                                </Typography>
                                <Button size="sm" variant="text" onClick={zoomIn} className="flex items-center gap-2">
                                    +
                                </Button>
                                <Button size="sm" variant="text" onClick={resetZoom}>
                                    Reset
                                </Button>
                            </div>
                            <div className="flex items-center gap-4 mt-4 justify-center">
                                <Button
                                    size="sm"
                                    variant="outlined"
                                    disabled={pageNumberPdf <= 1}
                                    onClick={() => setPageNumberPdf(prev => prev - 1)}
                                >
                                    Anterior
                                </Button>
                                <Typography variant="small" className="font-medium">
                                    Página {pageNumberPdf} de {numPagesPdf}
                                </Typography>
                                <Button
                                    size="sm"
                                    variant="outlined"
                                    disabled={pageNumberPdf >= numPagesPdf}
                                    onClick={() => setPageNumberPdf(prev => prev + 1)}
                                >
                                    Siguiente
                                </Button>
                            </div>
                        </div>

                    )}
                    {!form.File ?
                        <CardBody className="p-0 flex flex-col gap-4 w-full">
                            <div className="mt-10 max-h-[480px] overflow-y-auto px-2">
                                <div className="mb-4 flex items-center justify-between">
                                    <span>Total items: {totalItems}</span>

                                    <div className="flex items-center gap-2">
                                        <label>Cantidad por página:</label>
                                        <select
                                            value={itemsPerPage}
                                            onChange={(e) => {
                                                setItemsPerPage(Number(e.target.value));
                                                setPage(1);
                                            }}
                                            className="rounded border px-2 py-1"
                                        >
                                            {itemsPerPageOptions.map((n) => (
                                                <option key={n} value={n}>
                                                    {n}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:grid sm:grid-cols-[27rem_1fr] gap-2 pt-2">
                                    {paginatedSupply.map((_, index) => {
                                        const realIndex = (page - 1) * itemsPerPage + index;

                                        return (
                                            <React.Fragment key={realIndex}>
                                                <div className="row-span-2">
                                                    <Textarea
                                                        label="Descripcion del Suministro"
                                                        className={`w-full ${errors.Supply?.[realIndex]
                                                            ? "!focus:ring-red-400 !border-red-500 !text-red-500"
                                                            : "border-gray-300 focus:ring-blue-400"
                                                            }`}
                                                        value={form.Supply[realIndex] || ""}
                                                        onChange={(e) =>
                                                            handleArrayChange(realIndex, "Supply", e.target.value)
                                                        }
                                                        rows={0}
                                                        resize={true}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ">
                                                    <Input
                                                        label={errors.Quantity?.[realIndex] ? "El campo Cantidad es obligatorio" : "Cantidad"}
                                                        type="number"
                                                        value={form.Quantity[realIndex] || ""}
                                                        className={`w-full ${errors.Quantity?.[realIndex]
                                                            ? "!focus:ring-red-400 !border-red-500 !text-red-500"
                                                            : "border-gray-300 focus:ring-blue-400"
                                                            }`}
                                                        onChange={(e) => handleArrayChange(realIndex, "Quantity", e.target.value)}
                                                    />
                                                    <Input
                                                        label={errors.Term?.[realIndex] ? "El campo Plazo es obligatorio" : "Plazo"}
                                                        type="text"
                                                        value={form.Term[realIndex] || ""}
                                                        className={`w-full ${errors.Term?.[realIndex]
                                                            ? "!focus:ring-red-400 !border-red-500 !text-red-500"
                                                            : "border-gray-300 focus:ring-blue-400"
                                                            }`}
                                                        onChange={(e) => handleArrayChange(realIndex, "Term", e.target.value)}
                                                    />
                                                    <Input
                                                        label={errors.UnitCost?.[realIndex] ? "El campo Costo Unitario es obligatorio" : "Costo Unitario"}
                                                        type="number"
                                                        value={form.UnitCost[realIndex] || ""}
                                                        className={`w-full ${errors.UnitCost?.[realIndex]
                                                            ? "!focus:ring-red-400 !border-red-500 !text-red-500"
                                                            : "border-gray-300 focus:ring-blue-400"
                                                            }`}
                                                        onChange={(e) => handleArrayChange(realIndex, "UnitCost", e.target.value)}
                                                    />
                                                    <Input
                                                        label={errors.IVA?.[realIndex] ? "El campo IVA es obligatorio" : "IVA"}
                                                        type="number"
                                                        value={form.IVA[realIndex] || ""}
                                                        className={`w-full ${errors.IVA?.[realIndex]
                                                            ? "!focus:ring-red-400 !border-red-500 !text-red-500"
                                                            : "border-gray-300 focus:ring-blue-400"
                                                            }`}
                                                        onChange={(e) => handleArrayChange(realIndex, "IVA", e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-span-1 mb-10 flex items-center justify-between rounded-md bg-blue-gray-50 px-3 py-2 sm:col-span-2 md:col-span-3 lg:col-span-4">
                                                    <span className="text-sm font-semibold text-blue-gray-700">
                                                        Item {realIndex + 1}
                                                    </span>

                                                    <div className="flex gap-2">
                                                        <Button color="green" size="sm" onClick={addRow}>
                                                            +
                                                        </Button>
                                                        <Button color="red" size="sm" onClick={() => removeRow(index)}>
                                                            -
                                                        </Button>
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                                {totalItems > itemsPerPage && (
                                    <div className="flex items-center justify-center gap-3 py-4">
                                        <Button size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
                                            Anterior
                                        </Button>

                                        <span className="text-sm font-medium">
                                            Página {page} de {totalPages}
                                        </span>

                                        <Button size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                                            Siguiente
                                        </Button>
                                    </div>
                                )}
                                <div className="mb-4 flex items-center justify-between">
                                    <span>Total items: {totalItems}</span>

                                    <div className="flex items-center gap-2">
                                        <label>Cantidad por página:</label>
                                        <select
                                            value={itemsPerPage}
                                            onChange={(e) => {
                                                setItemsPerPage(Number(e.target.value));
                                                setPage(1); // Ir a la primera página al cambiar
                                            }}
                                            className="rounded border px-2 py-1"
                                        >
                                            {itemsPerPageOptions.map((n) => (
                                                <option key={n} value={n}>
                                                    {n}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                        :
                        <CardBody className="p-0 flex flex-col gap-4 w-full">
                            <div className="mt-10 max-h-[480px] overflow-y-auto px-2">
                                <div className="mb-4 flex items-center justify-between">
                                    <span>Total items: {totalItems}</span>

                                    <div className="flex items-center gap-2">
                                        <label>Cantidad por página:</label>
                                        <select
                                            value={itemsPerPage}
                                            onChange={(e) => {
                                                setItemsPerPage(Number(e.target.value));
                                                setPage(1);
                                            }}
                                            className="rounded border px-2 py-1"
                                        >
                                            {itemsPerPageOptions.map((n) => (
                                                <option key={n} value={n}>
                                                    {n}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 pt-2">
                                    {paginatedSupply.map((_, index) => {
                                        const realIndex = (page - 1) * itemsPerPage + index;
                                        return (
                                            <div key={realIndex} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                                                <div className="h-full">
                                                    <Textarea
                                                        label="Descripcion del Suministro"
                                                        className={`w-full ${errors.Supply?.[realIndex]
                                                            ? "!focus:ring-red-400 !border-red-500 !text-red-500"
                                                            : "border-gray-300 focus:ring-blue-400"
                                                            }`}
                                                        value={form.Supply[realIndex] || ""}
                                                        onChange={(e) =>
                                                            handleArrayChange(realIndex, "Supply", e.target.value)
                                                        }
                                                        rows={7}
                                                        resize={true}
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <Input
                                                        label={errors.Quantity?.[realIndex] ? "El campo Cantidad es obligatorio" : "Cantidad"}
                                                        type="number"
                                                        value={form.Quantity[realIndex] || ""}
                                                        className={`w-full ${errors.Quantity?.[realIndex]
                                                            ? "!focus:ring-red-400 !border-red-500 !text-red-500"
                                                            : "border-gray-300 focus:ring-blue-400"
                                                            }`}
                                                        onChange={(e) => handleArrayChange(realIndex, "Quantity", e.target.value)}
                                                    />
                                                    <Input
                                                        label={errors.UnitCost?.[realIndex] ? "El campo Costo Unitario es obligatorio" : "Costo Unitario"}
                                                        type="number"
                                                        value={form.UnitCost[realIndex] || ""}
                                                        className={`w-full ${errors.UnitCost?.[realIndex]
                                                            ? "!focus:ring-red-400 !border-red-500 !text-red-500"
                                                            : "border-gray-300 focus:ring-blue-400"
                                                            }`}
                                                        onChange={(e) => handleArrayChange(realIndex, "UnitCost", e.target.value)}
                                                    />
                                                    <Input
                                                        label={errors.IVA?.[realIndex] ? "El campo IVA es obligatorio" : "IVA"}
                                                        type="number"
                                                        value={form.IVA[realIndex] || ""}
                                                        className={`w-full ${errors.IVA?.[realIndex]
                                                            ? "!focus:ring-red-400 !border-red-500 !text-red-500"
                                                            : "border-gray-300 focus:ring-blue-400"
                                                            }`}
                                                        onChange={(e) => handleArrayChange(realIndex, "IVA", e.target.value)}
                                                    />
                                                    <Input
                                                        label={errors.Term?.[realIndex] ? "El campo Plazo es obligatorio" : "Plazo"}
                                                        type="text"
                                                        value={form.Term[realIndex] || ""}
                                                        className={`w-full ${errors.Term?.[realIndex]
                                                            ? "!focus:ring-red-400 !border-red-500 !text-red-500"
                                                            : "border-gray-300 focus:ring-blue-400"
                                                            }`}
                                                        onChange={(e) => handleArrayChange(realIndex, "Term", e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-span-1 mb-10 flex items-center justify-between rounded-md bg-blue-gray-50 px-3 py-2 sm:col-span-2 md:col-span-3 lg:col-span-4">
                                                    <span className="text-sm font-semibold text-blue-gray-700">
                                                        Item {realIndex + 1}
                                                    </span>

                                                    <div className="flex gap-2">
                                                        <Button color="green" size="sm" onClick={addRow}>
                                                            +
                                                        </Button>
                                                        <Button color="red" size="sm" onClick={() => removeRow(index)}>
                                                            -
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                {totalItems > itemsPerPage && (
                                    <div className="flex items-center justify-center gap-3 py-4">
                                        <Button size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
                                            Anterior
                                        </Button>

                                        <span className="text-sm font-medium">
                                            Página {page} de {totalPages}
                                        </span>

                                        <Button size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                                            Siguiente
                                        </Button>
                                    </div>
                                )}
                                <div className="mb-4 flex items-center justify-between">
                                    <span>Total items: {totalItems}</span>

                                    <div className="flex items-center gap-2">
                                        <label>Cantidad por página:</label>
                                        <select
                                            value={itemsPerPage}
                                            onChange={(e) => {
                                                setItemsPerPage(Number(e.target.value));
                                                setPage(1); // Ir a la primera página al cambiar
                                            }}
                                            className="rounded border px-2 py-1"
                                        >
                                            {itemsPerPageOptions.map((n) => (
                                                <option key={n} value={n}>
                                                    {n}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </CardBody>}
                </div>

            </CardBody>
            <CardFooter className="p-6 pt-0">
                <Button color="blue" fullWidth onClick={handleSubmit}>
                    Guardar Requerimiento
                </Button>
            </CardFooter>
        </Card>
    )
}