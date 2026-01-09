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
    const ITEMS_PER_PAGE_QUOTES = 5;

    const [requirementGroup, setRequirementGroup] = useState(requirementId);
    const [searchRequirements, setSearchRequirements] = useState("");
    const [searchRequirementsList, setSearchRequirementsList] = useState("");
    const [searchQuotes, setSearchQuotes] = useState("");
    const [searchQuotesSupplier, setSearchQuotesSuplier] = useState("");
    const [generalInfo, setGeneralInfo] = useState({});
    const [currentPageQuotes, setCurrentPageQuotes] = useState(1)
    const [requirementItems, setRequirementItems] = useState([
        {
            ID: 1,
            Supply: "Nuevo suministro",
            ID_Unit: 1,
            Quantity: 5,
            ID_Expenses: 1
        },
        {
            ID: 2,
            Supply: "Prueba",
            ID_Unit: 3,
            Quantity: 10,
            ID_Expenses: 2
        },
        {
            ID: 3,
            Supply: "Canaleta Ranurada 80x80x2m. Dx",
            ID_Unit: 3,
            Quantity: 10,
            ID_Expenses: 2
        },
        {
            ID: 3,
            Supply: "Amarre Negro 35cms(14) x100Uds",
            ID_Unit: 3,
            Quantity: 10,
            ID_Expenses: 2
        },
    ]);
    const [quotes, setQuotes] = useState([
        {
            Supplier: "Proveedor 1",
            items: [
                {
                    ID: 1,
                    Supply: "Canaleta Ranurada 80x80x2m. Dx Canaleta Ranurada 80x80x2m. Dx",
                    Term: "3 dias",
                    Quantity: 5,
                    UnitCost: 100,
                    IVA: 100,
                },
                {
                    ID: 2,
                    Supply: "Canaleta Ranurada 80x80x2m. Dx Canaleta Ranurada 80x80x2m. Dx",
                    Term: "2 dias",
                    Quantity: 5,
                    UnitCost: 10000,
                    IVA: 300
                },
                {
                    ID: 3,
                    Supply: "Canaleta Ranurada 80x80x2m. DxCanaleta Ranurada 80x80x2m. DxCanaleta Ranurada 80x80x2m. Dx",
                    Term: "2 dias",
                    Quantity: 5,
                    UnitCost: 10000,
                    IVA: 300
                },
            ]
        },
        {
            Supplier: "Alcatech",
            items: [
                {
                    ID: 4,
                    Supply: "Canaleta Ranurada 80x80x2m. Dx Canaleta Ranurada 80x80x2m. Dx",
                    Term: "10 dias",
                    Quantity: 5,
                    UnitCost: 51235677,
                    IVA: 5512,
                },
                {
                    ID: 5,
                    Supply: "Canaleta Ranurada 80x80x2m. Dx Canaleta Ranurada 80x80x2m. Dx",
                    Term: "5 dias",
                    Quantity: 5,
                    UnitCost: 11234300,
                    IVA: 14400
                },
            ]
        },
        {
            Supplier: "Alcatech",
            items: [
                {
                    ID: 4,
                    Supply: "PC",
                    Term: "10 dias",
                    Quantity: 5,
                    UnitCost: 51235677,
                    IVA: 5512,
                },
                {
                    ID: 5,
                    Supply: "Item test",
                    Term: "5 dias",
                    Quantity: 5,
                    UnitCost: 11234300,
                    IVA: 14400
                },
            ]
        },
        {
            Supplier: "Alcatech",
            items: [
                {
                    ID: 4,
                    Supply: "PC",
                    Term: "10 dias",
                    Quantity: 5,
                    UnitCost: 51235677,
                    IVA: 5512,
                },
                {
                    ID: 5,
                    Supply: "Item test",
                    Term: "5 dias",
                    Quantity: 5,
                    UnitCost: 11234300,
                    IVA: 14400
                },
            ]
        },
        {
            Supplier: "Alcatech",
            items: [
                {
                    ID: 4,
                    Supply: "PC",
                    Term: "10 dias",
                    Quantity: 5,
                    UnitCost: 51235677,
                    IVA: 5512,
                },
                {
                    ID: 5,
                    Supply: "Item test",
                    Term: "5 dias",
                    Quantity: 5,
                    UnitCost: 11234300,
                    IVA: 14400
                },
            ]
        },
        {
            Supplier: "Alcatech",
            items: [
                {
                    ID: 4,
                    Supply: "PC",
                    Term: "10 dias",
                    Quantity: 5,
                    UnitCost: 51235677,
                    IVA: 5512,
                },
                {
                    ID: 5,
                    Supply: "Item test",
                    Term: "5 dias",
                    Quantity: 5,
                    UnitCost: 11234300,
                    IVA: 14400
                },
            ]
        },
        {
            Supplier: "Alcatech",
            items: [
                {
                    ID: 4,
                    Supply: "PC",
                    Term: "10 dias",
                    Quantity: 5,
                    UnitCost: 51235677,
                    IVA: 5512,
                },
                {
                    ID: 5,
                    Supply: "Item test",
                    Term: "5 dias",
                    Quantity: 5,
                    UnitCost: 11234300,
                    IVA: 14400
                },
            ]
        },
        {
            Supplier: "Alcatech",
            items: [
                {
                    ID: 4,
                    Supply: "PC",
                    Term: "10 dias",
                    Quantity: 5,
                    UnitCost: 51235677,
                    IVA: 5512,
                },
                {
                    ID: 5,
                    Supply: "Item test",
                    Term: "5 dias",
                    Quantity: 5,
                    UnitCost: 11234300,
                    IVA: 14400
                },
            ]
        },
        {
            Supplier: "Alcatech",
            items: [
                {
                    ID: 4,
                    Supply: "PC",
                    Term: "10 dias",
                    Quantity: 5,
                    UnitCost: 51235677,
                    IVA: 5512,
                },
                {
                    ID: 5,
                    Supply: "Item test",
                    Term: "5 dias",
                    Quantity: 5,
                    UnitCost: 11234300,
                    IVA: 14400
                },
            ]
        }
    ]);

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

    console.log(indexOfFirstItemQuotes, indexOfLastItemQuotes, currentRowsQuotes)

    const progress = 0;

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
                <div className="grid grid-cols-[250px_1fr] gap-2">
                    <div className="border-r-2 border-gray-100 flex flex-col gap-2">
                        <div className="border-b border-gray-200 bg-white px-2 pb-2">
                            <Input
                                label="Buscar requerimiento"
                                value={searchRequirementsList}
                                onChange={(e) => setSearchRequirementsList(e.target.value)}
                                className="!text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-3 p-4">
                            {requirementItemsFiltered.map((item, indexItem) => {
                                return (
                                    <div className="relative p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer" key={item.ID}>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex flex-row justify-between items-start">
                                                <h3 className="text-slate-800 font-semibold text-base leading-tight">
                                                    {item.Supply}
                                                </h3>
                                                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[11px] font-medium rounded-md flex items-center justify-center">
                                                    Pendiente
                                                </span>
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
                                    // disabled={!requirementGroup}
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
                                        }, index) => (
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
                                                <td className="py-3 px-6 text-center max-w-[200px] break-words whitespace-normal">hola</td>
                                                <td className="py-3 px-6 text-center">
                                                    <Button
                                                        size="sm"
                                                        color="blue"
                                                        onClick={() => { }}
                                                    >
                                                        Asignar
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
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
                </div>
            </CardBody>
        </Card >
    );
};