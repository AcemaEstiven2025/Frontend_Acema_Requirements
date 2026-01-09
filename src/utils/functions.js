export const formatoPesoColombiano = (numero) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0, // El peso colombiano no suele usar centavos
        maximumFractionDigits: 0
    }).format(numero);
};