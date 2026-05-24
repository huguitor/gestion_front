function envBool(value, defaultValue = true) {
    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return defaultValue;
    }

    return String(value)
        .toLowerCase() === "true";
}

export const modules = {

    productos:
        envBool(
            import.meta.env.VITE_MODULO_PRODUCTOS,
            true
        ),

    registro:
        envBool(
            import.meta.env.VITE_MODULO_REGISTRO,
            true
        ),

    pedidos:
        envBool(
            import.meta.env.VITE_MODULO_PEDIDOS,
            true
        ),

    carrito:
        envBool(
            import.meta.env.VITE_MODULO_CARRITO,
            true
        ),

};
