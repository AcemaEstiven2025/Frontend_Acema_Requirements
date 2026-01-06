import React from "react";
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
} from "@material-tailwind/react";

const RequirementsScroll = ({
  form,
  errors,
  annexType,
  paginatedSupply,
  page,
  itemsPerPage,
  totalItems,
  totalPages,
  itemsPerPageOptions,
  unitsInfo,
  filteredUnits,
  searchUnits,
  setSearchUnits,
  setSearchTypeEspenses,
  typeEspensesInfo,
  filteredTypesEspenses,
  searchTypeEspenses,
  handleArrayChange,
  setAnnexType,
  addRow,
  removeRow,
  setPage,
  setItemsPerPage,
}) => {
  return (
    Suggested_Suppliers: [""],
      {/* CONTENEDOR SCROLL */}
      <div className="mt-10 max-h-[480px] overflow-y-auto px-2">
        {/* FILTRO CANTIDAD POR PÁGINA */}
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

        {/* GRID DE ITEMS */}
        <div className="grid grid-cols-1 gap-2 pt-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {paginatedSupply.map((_, index) => {
            const realIndex = (page - 1) * itemsPerPage + index;

            return (
              <React.Fragment key={realIndex}>
                {/* SUMINISTRO */}
                <div className="row-span-2">
                  <Textarea
                    label="Descripcion del Suministro"
                    className={`w-full ${
                      errors.Supply?.[realIndex]
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

                {/* ANEXO */}
                <div className="row-span-2 w-full">
                  <label className="mb-1 block justify-center text-center text-sm font-medium text-gray-700">
                    Anexo
                  </label>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-center gap-2 text-center">
                      <Button
                        size="sm"
                        onClick={() => {
                          setAnnexType((prev) => ({ ...prev, [realIndex]: "text" }));
                          handleArrayChange(realIndex, "Annex", "");
                        }}
                      >
                        Texto
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          setAnnexType((prev) => ({ ...prev, [realIndex]: "file" }));
                          handleArrayChange(realIndex, "Annex", null);
                        }}
                      >
                        Archivo
                      </Button>
                    </div>

                    {annexType[realIndex] === "file" ? (
                      <input
                        type="file"
                        onChange={(e) =>
                          handleArrayChange(realIndex, "Annex", e.target.files[0])
                        }
                        className="w-full rounded border border-gray-300 px-2 py-1"
                      />
                    ) : (
                      <Input
                        label="Anexo"
                        value={form.Annex[realIndex] || ""}
                        onChange={(e) =>
                          handleArrayChange(realIndex, "Annex", e.target.value)
                        }
                        className="w-full"
                      />
                    )}
                  </div>
                </div>

                {/* UNIDAD DE MEDIDA*/}
                <Select
                  label={
                    errors.ID_Unit?.[realIndex]
                      ? "El campo Unidad de Medida es obligatorio"
                      : "Unidad de Medida"
                  }
                  value={form.ID_Unit[realIndex] || ""}
                  onChange={(value) => handleArrayChange(realIndex, "ID_Unit", value)}
                  selected={() =>
                    unitsInfo.find((un) => un.ID.toString() === form.ID_Unit[realIndex])
                      ?.Description
                  }
                  menuProps={{ className: "p-2 max-h-48 min-h-[120px] overflow-auto", style: { zIndex: 9999 } }}
                  className={`w-full ${
                    errors.ID_Unit?.[realIndex]
                      ? "border-red-500 text-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-blue-400"
                  }`}
                >
                  <div className="sticky top-0 z-20 border-b border-gray-200 bg-white px-2 pb-2">
                    <div className="px-2 pb-2 sticky top-0 bg-white z-10">
                 <Input
                   label="Buscar..."
                   value={searchUnits}
                   onChange={(e) => setSearchUnits(e.target.value)}
                   className="!text-sm" />
                </div>
                  </div>
                  {filteredUnits.length > 0 ? (
                    filteredUnits.map((un) => (
                      <Option key={un.ID} value={un.ID.toString()}>
                        {un.Description}
                      </Option>
                    ))
                  ) : (
                    <Option disabled>No hay resultados</Option>
                  )}
                </Select>

                {/* CANTIDAD */}
                <Input
                  label={errors.Quantity?.[realIndex] ? "El campo Cantidad es obligatorio" : "Cantidad"}
                  type="number"
                  value={form.Quantity[realIndex] || ""}
                  className={`w-full ${
                    errors.Quantity?.[realIndex]
                      ? "!focus:ring-red-400 !border-red-500 !text-red-500"
                      : "border-gray-300 focus:ring-blue-400"
                  }`}
                  onChange={(e) => handleArrayChange(realIndex, "Quantity", e.target.value)}
                />

                {/* TIPO GASTO */}
                <Select
                  label={errors.ID_Expenses?.[realIndex] ? "El campo Tipo de Gasto es obligatorio" : "Tipo de Gasto"}
                  value={form.ID_Expenses[realIndex] || ""}
                  onChange={(value) => handleArrayChange(realIndex, "ID_Expenses", value)}
                  selected={() =>
                    typeEspensesInfo.find((un) => un.ID.toString() === form.ID_Expenses[realIndex])
                      ?.Description
                  }
                  menuProps={{ className: "p-2 max-h-48 min-h-[120px] overflow-auto", style: { zIndex: 9999 } }}
                  className={`w-full ${
                    errors.ID_Expenses?.[realIndex]
                      ? "!focus:ring-red-400 !border-red-500 !text-red-500"
                      : "border-gray-300 focus:ring-blue-400"
                  }`}
                >
                  <div className="sticky top-0 z-20 border-b border-gray-200 bg-white px-2 pb-2">
                      <Input
                   label="Buscar..."
                   value={searchTypeEspenses}
                   onChange={(e) => setSearchTypeEspenses(e.target.value)}
                   className="!text-sm" />
                  </div>
                  {filteredTypesEspenses.length > 0 ? (
                    filteredTypesEspenses.map((un) => (
                      <Option key={un.ID} value={un.ID.toString()}>
                        {un.Description}
                      </Option>
                    ))
                  ) : (
                    <Option disabled>No hay resultados</Option>
                  )}
                </Select>

                {/* PROVEEDOR */}
                <Input
                  label="Proveedor"
                  className="w-full"
                  value={form.Suggested_Suppliers[realIndex] || ""}
                  onChange={(e) => handleArrayChange(realIndex, "Suggested_Suppliers", e.target.value)}
                />

                {/* BOTONES */}
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

        {/* PAGINACIÓN */}
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
      </div>
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
    </CardBody>
  );
};

export default RequirementsScroll;
