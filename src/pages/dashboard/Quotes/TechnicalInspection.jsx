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
    XCircleIcon
} from "@heroicons/react/24/solid";
import { useMaterialTailwindController } from "@/context";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "@/utils/apiClient";
import Swal from "sweetalert2";
import { formatoPesoColombiano } from "@/utils/functions";

export function TechnicalInspection() {
    const { requirementId } = useParams();
    const ITEMS_PER_PAGE = 4;
    const ITEMS_PER_PAGE_QUOTES = window.innerWidth / 275;

    const [requirementGroup, setRequirementGroup] = useState(requirementId);
    const [searchRequirements, setSearchRequirements] = useState("");
    const [searchRequirementsList, setSearchRequirementsList] = useState("");
    const [searchQuotes, setSearchQuotes] = useState("");
    const [searchQuotesSupplier, setSearchQuotesSuplier] = useState("");
    const [generalInfo, setGeneralInfo] = useState({});
    const [currentPageQuotes, setCurrentPageQuotes] = useState(1);
    const [currentPageRequirements, setCurrentPageRequirements] = useState(1);
    const [requirementSelected, setRequirementSelected] = useState(null);
    const [relations, setRelations] = useState([]);
    const [requirementItems, setRequirementItems] = useState([
        {
            "ID": 1,
            "Supply": "Cable eléctrico THHN calibre 12",
            "ID_Unit": 3,
            "Quantity": 100,
            "ID_Expenses": 1
        },
        {
            "ID": 2,
            "Supply": "Tubería PVC 1/2 pulgada",
            "ID_Unit": 3,
            "Quantity": 50,
            "ID_Expenses": 1
        },
        {
            "ID": 3,
            "Supply": "Interruptor termomagnético 20A",
            "ID_Unit": 1,
            "Quantity": 4,
            "ID_Expenses": 2
        },
        {
            "ID": 4,
            "Supply": "Tomacorriente doble 110V",
            "ID_Unit": 1,
            "Quantity": 12,
            "ID_Expenses": 2
        },
        {
            "ID": 5,
            "Supply": "Caja de registro plástica 4x4",
            "ID_Unit": 1,
            "Quantity": 20,
            "ID_Expenses": 1
        },
        {
            "ID": 6,
            "Supply": "Canaleta ranurada 80x80x2m Dx",
            "ID_Unit": 3,
            "Quantity": 10,
            "ID_Expenses": 2
        },
        {
            "ID": 7,
            "Supply": "Tornillo autorroscante 1 pulgada",
            "ID_Unit": 2,
            "Quantity": 200,
            "ID_Expenses": 1
        },
        {
            "ID": 8,
            "Supply": "Tarugo plástico 6 mm",
            "ID_Unit": 2,
            "Quantity": 200,
            "ID_Expenses": 1
        },
        {
            "ID": 9,
            "Supply": "Luminaria LED 36W",
            "ID_Unit": 1,
            "Quantity": 8,
            "ID_Expenses": 3
        },
        {
            "ID": 10,
            "Supply": "Conector EMT 1/2 pulgada",
            "ID_Unit": 1,
            "Quantity": 30,
            "ID_Expenses": 1
        },
        {
            "ID": 11,
            "Supply": "Abrazadera metálica 1/2 pulgada",
            "ID_Unit": 1,
            "Quantity": 40,
            "ID_Expenses": 1
        },
        {
            "ID": 12,
            "Supply": "Cinta aislante negra",
            "ID_Unit": 1,
            "Quantity": 10,
            "ID_Expenses": 1
        },
        {
            "ID": 13,
            "Supply": "Tablero eléctrico 12 polos",
            "ID_Unit": 1,
            "Quantity": 1,
            "ID_Expenses": 3
        },
        {
            "ID": 14,
            "Supply": "Canaleta plástica 40x25 mm",
            "ID_Unit": 3,
            "Quantity": 15,
            "ID_Expenses": 2
        },
        {
            "ID": 15,
            "Supply": "Conductor a tierra verde calibre 10",
            "ID_Unit": 3,
            "Quantity": 60,
            "ID_Expenses": 1
        }
    ]
    );
    const [quotes, setQuotes] = useState([
        {
            "Supplier": "Variedades",
            "items": [
                { "ID": 1, "Supply": "Canaleta Ranurada 80x80x2m Dx", "Term": "3 dias", "Quantity": 5, "UnitCost": 9800, "IVA": 1862 },
                { "ID": 2, "Supply": "Canaleta Ranurada 60x60x2m Dx", "Term": "3 dias", "Quantity": 8, "UnitCost": 8200, "IVA": 1558 },
                { "ID": 3, "Supply": "Canaleta Ranurada 40x40x2m Dx", "Term": "2 dias", "Quantity": 10, "UnitCost": 6500, "IVA": 1235 },
                { "ID": 4, "Supply": "Canaleta Plástica 40x25 mm", "Term": "2 dias", "Quantity": 12, "UnitCost": 3200, "IVA": 608 },
                { "ID": 5, "Supply": "Cable THHN calibre 12", "Term": "1 dia", "Quantity": 100, "UnitCost": 900, "IVA": 171 },
                { "ID": 6, "Supply": "Cable THHN calibre 10", "Term": "1 dia", "Quantity": 80, "UnitCost": 1200, "IVA": 228 },
                { "ID": 7, "Supply": "Tubería EMT 1/2 pulgada", "Term": "3 dias", "Quantity": 50, "UnitCost": 2100, "IVA": 399 },
                { "ID": 8, "Supply": "Conector EMT 1/2 pulgada", "Term": "2 dias", "Quantity": 40, "UnitCost": 500, "IVA": 95 },
                { "ID": 9, "Supply": "Abrazadera EMT 1/2 pulgada", "Term": "2 dias", "Quantity": 40, "UnitCost": 450, "IVA": 86 },
                { "ID": 10, "Supply": "Interruptor termomagnético 20A", "Term": "4 dias", "Quantity": 6, "UnitCost": 12500, "IVA": 2375 },
                { "ID": 11, "Supply": "Tomacorriente doble 110V", "Term": "3 dias", "Quantity": 15, "UnitCost": 3200, "IVA": 608 },
                { "ID": 12, "Supply": "Caja de registro 4x4", "Term": "2 dias", "Quantity": 20, "UnitCost": 1800, "IVA": 342 },
                { "ID": 13, "Supply": "Cinta aislante", "Term": "1 dia", "Quantity": 10, "UnitCost": 900, "IVA": 171 },
                { "ID": 14, "Supply": "Tarugo plástico 6mm", "Term": "1 dia", "Quantity": 200, "UnitCost": 120, "IVA": 23 },
                { "ID": 15, "Supply": "Tornillo autorroscante 1 pulgada", "Term": "1 dia", "Quantity": 200, "UnitCost": 150, "IVA": 29 }
            ]
        },
        {
            "Supplier": "Alcatech",
            "items": [
                { "ID": 16, "Supply": "Canaleta Ranurada 80x80x2m Dx", "Term": "10 dias", "Quantity": 5, "UnitCost": 10500, "IVA": 1995 },
                { "ID": 17, "Supply": "Canaleta Ranurada 60x60x2m Dx", "Term": "8 dias", "Quantity": 8, "UnitCost": 8800, "IVA": 1672 },
                { "ID": 18, "Supply": "Canaleta Ranurada 40x40x2m Dx", "Term": "7 dias", "Quantity": 10, "UnitCost": 7000, "IVA": 1330 },
                { "ID": 19, "Supply": "Canaleta Plástica 60x40 mm", "Term": "6 dias", "Quantity": 10, "UnitCost": 4200, "IVA": 798 },
                { "ID": 20, "Supply": "Cable THHN calibre 12", "Term": "5 dias", "Quantity": 100, "UnitCost": 950, "IVA": 181 },
                { "ID": 21, "Supply": "Cable THHN calibre 10", "Term": "5 dias", "Quantity": 80, "UnitCost": 1300, "IVA": 247 },
                { "ID": 22, "Supply": "Tubería EMT 3/4 pulgada", "Term": "7 dias", "Quantity": 40, "UnitCost": 3200, "IVA": 608 },
                { "ID": 23, "Supply": "Conector EMT 3/4 pulgada", "Term": "6 dias", "Quantity": 30, "UnitCost": 750, "IVA": 143 },
                { "ID": 24, "Supply": "Abrazadera EMT 3/4 pulgada", "Term": "6 dias", "Quantity": 30, "UnitCost": 680, "IVA": 129 },
                { "ID": 25, "Supply": "Interruptor termomagnético 32A", "Term": "10 dias", "Quantity": 4, "UnitCost": 18500, "IVA": 3515 },
                { "ID": 26, "Supply": "Tomacorriente industrial", "Term": "8 dias", "Quantity": 6, "UnitCost": 15500, "IVA": 2945 },
                { "ID": 27, "Supply": "Caja metálica 4x4", "Term": "6 dias", "Quantity": 15, "UnitCost": 3200, "IVA": 608 },
                { "ID": 28, "Supply": "Cinta aislante premium", "Term": "4 dias", "Quantity": 10, "UnitCost": 1400, "IVA": 266 },
                { "ID": 29, "Supply": "Tarugo nylon 8mm", "Term": "4 dias", "Quantity": 150, "UnitCost": 180, "IVA": 34 },
                { "ID": 30, "Supply": "Tornillo galvanizado 1 1/2 pulgada", "Term": "4 dias", "Quantity": 150, "UnitCost": 220, "IVA": 42 }
            ]
        },
        {
            "Supplier": "ElectroSur",
            "items": [
                { "ID": 31, "Supply": "Luminaria LED 36W", "Term": "5 dias", "Quantity": 10, "UnitCost": 18500, "IVA": 3515 },
                { "ID": 32, "Supply": "Luminaria LED 18W", "Term": "4 dias", "Quantity": 12, "UnitCost": 12000, "IVA": 2280 },
                { "ID": 33, "Supply": "Panel LED 60x60", "Term": "6 dias", "Quantity": 6, "UnitCost": 32000, "IVA": 6080 },
                { "ID": 34, "Supply": "Reflector LED 100W", "Term": "7 dias", "Quantity": 4, "UnitCost": 45000, "IVA": 8550 },
                { "ID": 35, "Supply": "Cable encauchetado 3x2.5mm", "Term": "5 dias", "Quantity": 50, "UnitCost": 4200, "IVA": 798 },
                { "ID": 36, "Supply": "Cable encauchetado 3x1.5mm", "Term": "5 dias", "Quantity": 60, "UnitCost": 3600, "IVA": 684 },
                { "ID": 37, "Supply": "Tablero eléctrico 12 polos", "Term": "10 dias", "Quantity": 1, "UnitCost": 95000, "IVA": 18050 },
                { "ID": 38, "Supply": "Breaker 20A", "Term": "6 dias", "Quantity": 8, "UnitCost": 13500, "IVA": 2565 },
                { "ID": 39, "Supply": "Breaker 32A", "Term": "6 dias", "Quantity": 6, "UnitCost": 17500, "IVA": 3325 },
                { "ID": 40, "Supply": "Caja estanca IP65", "Term": "7 dias", "Quantity": 6, "UnitCost": 9800, "IVA": 1862 },
                { "ID": 41, "Supply": "Sensor de movimiento", "Term": "8 dias", "Quantity": 5, "UnitCost": 16500, "IVA": 3135 },
                { "ID": 42, "Supply": "Fotocelda 110V", "Term": "8 dias", "Quantity": 5, "UnitCost": 14500, "IVA": 2755 },
                { "ID": 43, "Supply": "Canaleta decorativa blanca", "Term": "4 dias", "Quantity": 20, "UnitCost": 2800, "IVA": 532 },
                { "ID": 44, "Supply": "Regleta de conexión", "Term": "3 dias", "Quantity": 25, "UnitCost": 950, "IVA": 181 },
                { "ID": 45, "Supply": "Terminal ojo cobre", "Term": "3 dias", "Quantity": 50, "UnitCost": 600, "IVA": 114 }
            ]
        }
    ]
    );

    const quotesData = quotes.flatMap(group =>
        group.items.map(item => ({
            ...item,
            Supplier: group.Supplier
        }))
    );

    const requirementItemsFiltered = requirementItems.filter(item => searchRequirementsList ? item.Supply.toLowerCase().includes(searchRequirementsList.toLowerCase()) : item.Supply)

    const quotesDataFiltered = quotesData.filter(item => searchQuotes ? item.Supply.toLowerCase().includes(searchQuotes.toLowerCase()) : item.Supply)
        .filter(item => searchQuotesSupplier ? item.Supplier.toLowerCase().includes(searchQuotesSupplier.toLowerCase()) : item.Supplier);

    const totalPagesQuotes = Math.ceil(quotesData.length / ITEMS_PER_PAGE_QUOTES);
    const indexOfLastItemQuotes = currentPageQuotes * ITEMS_PER_PAGE_QUOTES;
    const indexOfFirstItemQuotes = indexOfLastItemQuotes - ITEMS_PER_PAGE_QUOTES;
    const currentRowsQuotes = quotesDataFiltered.slice(indexOfFirstItemQuotes, indexOfLastItemQuotes);

    const totalPagesRequirements = Math.ceil(requirementItemsFiltered.length / ITEMS_PER_PAGE);
    const indexOfLastItemRequirements = currentPageRequirements * ITEMS_PER_PAGE;
    const indexOfFirstItemRequirements = indexOfLastItemRequirements - ITEMS_PER_PAGE;
    const currentRowsRequirements = requirementItemsFiltered.slice(indexOfFirstItemRequirements, indexOfLastItemRequirements);

    const progress = Math.round((relations.length / requirementItems.length) * 100);

    const requirementsSelect = generalInfo?.requirements?.map(requirement => {
        const projectFound = generalInfo?.projects?.find(project => project.ID == requirement.ID_Project);
        const codePurchasing = projectFound?.CodesProjectsPurchasing?.find(code => code.ID == requirement.ID_CodePurchasing);
        return {
            value: requirement.Requirement_Group.toString(),
            label: `${projectFound?.Name_Project} - ${codePurchasing?.Code_Purchasing} - Req No.${requirement.Requirement_Group}`,
        }
    });

    useEffect(() => {
        const loadGeneralInfo = async () => {
            const response = await apiClient("/form/info");
            setGeneralInfo(response);
        };

        loadGeneralInfo();
    }, []);

    useEffect(() => {
        if (!requirementGroup) return;

    }, [requirementGroup]);

    const status = {
        pending: <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[11px] font-medium rounded-md flex items-center justify-center">Pendiente</span>,
        approved: <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[11px] font-medium rounded-md flex items-center justify-center">Aceptado</span>,
        rejected: <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[11px] font-medium rounded-md flex items-center justify-center">Denegado</span>,
        initiated: <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[11px] font-medium rounded-md flex items-center justify-center">Iniciado</span>
    };

    const handleChangeRequirement = (req) => {
        setRequirementSelected(req);
    };

    const handleDenegadeRequirement = (idRequirement) => {
        setRelations(prev => {
            const newData = [...prev];
            const relationIndex = prev.findIndex(relation => relation.ID_Requirement == idRequirement);
            if (relationIndex != "-1") {
                newData[relationIndex] = {
                    ID_Requirement: idRequirement,
                    approved: false
                }
            } else {
                newData.push({
                    ID_Requirement: idRequirement,
                    approved: false
                })
            }
            return newData;
        });
        setRequirementSelected(null);
    };

    const handlePendingRequirement = (idRequirement) => {
        setRelations(prev => {
            const newData = [...prev];
            const relationIndex = prev.findIndex(relation => relation.ID_Requirement == idRequirement);
            if (relationIndex != "-1") {
                newData[relationIndex] = {
                    ID_Requirement: idRequirement,
                    pending: true
                }
            } else {
                newData.push({
                    ID_Requirement: idRequirement,
                    pending: true
                })
            }
            return newData;
        });
        setRequirementSelected(null);
    };

    const handleCreateRelation = (idRequirement, idQuote) => {
        if (!idRequirement || !idQuote) return;
        setRelations(prev => {
            const newData = [...prev];
            const relationIndex = prev.findIndex(relation => relation.ID_Requirement == idRequirement || relation.ID_Quote == idQuote);
            if (relationIndex != "-1") {
                newData[relationIndex] = {
                    ID_Requirement: idRequirement,
                    approved: true,
                    ID_Quote: idQuote
                }
            } else {
                newData.push({
                    ID_Requirement: idRequirement,
                    approved: true,
                    ID_Quote: idQuote
                })
            }
            return newData;
        });
        setRequirementSelected(null);
    };

    const handleSubmit = async () => {
        try {
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
                    title: "Estas seguro de enviar la Inspección Técnica?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "SI, Enviar!",
                    cancelButtonText: "No, cancelar!",
                    reverseButtons: true,
                })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        const { ok, message } = await apiClient.post("/form/technicalinspection", relations);
                        if (ok) {
                            swalWithTailwind.fire({
                                title: "CREADO",
                                text: "Inspección Técnica enviada exitosamente. 👌",
                                icon: "success",
                                confirmButtonText: "OK",
                            });
                        } else {
                            swalWithTailwind.fire({
                                title: "No se pudo enviar la Inspección Técnica",
                                text: message,
                                icon: "info",
                                confirmButtonText: "OK",
                            });
                        }
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        swalWithTailwind.fire({
                            title: "CANCELADO",
                            text: "ENVIO CANCELADO 😢",
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
                    Inspección Técnica
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
            <CardBody className="flex flex-col gap-8">
                <Select
                    label="Número de Requerimiento"
                    name="ID_Requirement"
                    value={requirementGroup}
                    onChange={(value) =>
                        setRequirementGroup(value)
                    }
                    disabled={!!requirementId}
                    selected={() =>
                        requirementsSelect?.find(
                            (p) =>
                                p.value.toString() ===
                                requirementGroup,
                        )?.label
                    }
                    menuProps={{
                        className: "p-2 max-h-48 overflow-auto",
                    }}
                    className={`w-full border-gray-300 focus:ring-blue-400`}
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
                {requirementGroup && <div className="grid grid-cols-[250px_1fr] gap-2">
                    <div className="border-r-2 border-gray-100 flex flex-col gap-2">
                        <div className="border-b border-gray-200 bg-white px-2 pb-2">
                            <Input
                                label="Buscar requerimiento"
                                value={searchRequirementsList}
                                onChange={(e) => setSearchRequirementsList(e.target.value)}
                                className="!text-sm"
                                disabled={!requirementGroup}
                            />
                        </div>
                        <div className="flex flex-col gap-3 p-4">
                            {currentRowsRequirements.map((item) => {
                                const assigned = relations.find(relation => relation.ID_Requirement === item.ID);
                                const statusRequeriment = assigned ? assigned.approved ? "approved" : assigned.pending ? "pending" : "rejected" : "initiated";
                                return (
                                    <div className={`relative p-4 border ${requirementSelected === item.ID ? "border-blue-500" : "border-gray-300 shadow-sm"} rounded-xl hover:shadow-md transition-shadow duration-200 cursor-pointer`} key={item.ID} onClick={() => handleChangeRequirement(item.ID)}>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex flex-row justify-between items-start">
                                                <h3 className="text-slate-800 font-semibold text-base leading-tight">
                                                    {item.Supply}
                                                </h3>
                                                {status[statusRequeriment]}
                                            </div>
                                            <div className="flex flex-col items-start gap-3 mt-3">
                                                <span className="text-slate-400 text-xs font-medium">
                                                    {generalInfo?.units?.find(type => type.ID == item.ID_Unit)?.Description}: {item.Quantity} unidades
                                                </span>
                                                <span className="text-slate-400 text-xs font-semibold">
                                                    {generalInfo?.typeEspenses?.find(type => type.ID == item.ID_Expenses)?.Description}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                            <div className="flex items-center gap-2 justify-center">
                                <Button
                                    size="sm"
                                    variant="outlined"
                                    disabled={currentPageRequirements <= 1}
                                    onClick={() => setCurrentPageRequirements((prev) => prev - 1)}
                                >
                                    Ant
                                </Button>
                                <Typography variant="small" className="font-medium">
                                    {currentPageRequirements} de {totalPagesRequirements}
                                </Typography>
                                <Button
                                    size="sm"
                                    variant="outlined"
                                    disabled={currentPageRequirements >= totalPagesRequirements}
                                    onClick={() => setCurrentPageRequirements((prev) => prev + 1)}
                                >
                                    Sig
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="px-4 flex flex-col gap-4 min-w-0">
                        <div className="flex flex-row justify-between">
                            <div className="min-w-[30%]">
                                <Input
                                    label="Buscar item"
                                    value={searchQuotes}
                                    onChange={(e) => setSearchQuotes(e.target.value)}
                                    className="!text-sm"
                                    disabled={!requirementGroup}
                                />
                            </div>
                            <div className="flex min-w-[30%]">
                                {searchQuotesSupplier && <button
                                    onClick={() => setSearchQuotesSuplier("")}
                                    className="p-1"
                                >
                                    <XCircleIcon className="w-6 h-6 text-inherit" />
                                </button>}
                                <Select
                                    label="Filtrar por Proveedor"
                                    name="ID_Requirement"
                                    value={searchQuotesSupplier}
                                    onChange={(value) =>
                                        setSearchQuotesSuplier(value)
                                    }
                                    disabled={!requirementGroup}
                                    selected={searchQuotesSupplier}
                                    menuProps={{
                                        className: "p-2 max-h-48 overflow-auto",
                                    }}
                                    className={`w-full border-gray-300 focus:ring-blue-400`}
                                >
                                    {quotes?.length > 0 ? (
                                        quotes?.map((q) => (
                                            <Option
                                                key={q.Supplier}
                                                value={q.Supplier.toString()}
                                            >
                                                {q.Supplier.toString()}
                                            </Option>
                                        ))
                                    ) : (
                                        <Option disabled>No hay resultados</Option>
                                    )}
                                </Select>
                            </div>
                        </div>
                        <div className="flex flex-row gap-3">
                            <Button
                                size="sm"
                                variant="outlined"
                                color={requirementSelected ? "orange" : "gray"}
                                disabled={!requirementSelected}
                                onClick={() => handlePendingRequirement(requirementSelected)}
                            >
                                Requerimiento Pendiente
                            </Button>
                            <Button
                                size="sm"
                                variant="outlined"
                                color={requirementSelected ? "red" : "gray"}
                                disabled={!requirementSelected}
                                onClick={() => handleDenegadeRequirement(requirementSelected)}
                            >
                                Denegar requerimiento
                            </Button>
                        </div>
                        <Card className="">
                            <div className="overflow-x-auto rounded-xl p-0">
                                <table className="w-full min-w-max table-auto text-left rounded-sm">
                                    <thead >
                                        <tr>
                                            {[
                                                "ID",
                                                "Suministro",
                                                "Cantidad",
                                                "Proveedor",
                                                "Valor Unitario",
                                                "IVA",
                                                "Plazo",
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
                                        {currentRowsQuotes.map(({
                                            ID,
                                            IVA,
                                            Quantity,
                                            Supplier,
                                            Term,
                                            UnitCost,
                                            Supply
                                        }, index) => {
                                            const assigned = relations.find(relation => relation.ID_Quote === ID);
                                            const requirementAssigned = requirementItems.find(item => item.ID === assigned?.ID_Requirement);
                                            return (
                                                <tr
                                                    key={`${ID}-${index}`}
                                                    className="bg-white hover:bg-gray-50 transition-colors duration-200 border-b border-gray-200"
                                                >
                                                    <td className="py-3 px-6 font-medium text-center">{ID}</td>
                                                    <td className="py-3 px-6 text-center max-w-[200px] break-words whitespace-normal">{Supply}</td>
                                                    <td className="py-3 px-6 text-center max-w-[200px] break-words whitespace-normal">{Quantity}</td>
                                                    <td className="py-3 px-6 text-center max-w-[200px] break-words whitespace-normal">{Supplier}</td>
                                                    <td className="py-3 px-6 text-center max-w-[200px] break-words whitespace-normal">{formatoPesoColombiano(UnitCost)}</td>
                                                    <td className="py-3 px-6 text-center max-w-[200px] break-words whitespace-normal">{formatoPesoColombiano(IVA)}</td>
                                                    <td className="py-3 px-6 text-center max-w-[200px] break-words whitespace-normal">{Term}</td>
                                                    <td className="py-3 px-6 text-center max-w-[200px] break-words whitespace-normal">{requirementAssigned ? `Asignado a ${requirementAssigned.Supply}` : "Sin Asignar"}</td>
                                                    <td className="py-3 px-6 text-center">
                                                        <Button
                                                            size="sm"
                                                            color="blue"
                                                            onClick={() => handleCreateRelation(requirementSelected, ID)}
                                                        >
                                                            Asignar
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex items-center gap-4 my-4 justify-center">
                                <Button
                                    size="sm"
                                    variant="outlined"
                                    disabled={currentPageQuotes <= 1}
                                    onClick={() => setCurrentPageQuotes((prev) => prev - 1)}
                                >
                                    Anterior
                                </Button>
                                <Typography variant="small" className="font-medium">
                                    Página {currentPageQuotes} de {totalPagesQuotes}
                                </Typography>
                                <Button
                                    size="sm"
                                    variant="outlined"
                                    disabled={currentPageQuotes >= totalPagesQuotes}
                                    onClick={() => setCurrentPageQuotes((prev) => prev + 1)}
                                >
                                    Siguiente
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>}
                {requirementGroup && <div className="flex justify-center">
                    <Button
                        size="lg"
                        variant="filled"
                        color="blue"
                        disabled={progress < 100}
                        onClick={handleSubmit}
                    >
                        Enviar Inspección
                    </Button>
                </div>}
            </CardBody>
        </Card >
    );
};