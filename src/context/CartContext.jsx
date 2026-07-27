import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

const STORAGE_KEY = "pedido_carrito";

// Clave única dentro del carrito. Producto y servicio pueden compartir id
// numérico, así que combinamos tipo + id para no pisarlos entre sí.
const construirKey = (tipo, id) => `${tipo}-${id}`;

// Normaliza ítems viejos guardados en localStorage (antes solo había
// productos y no existían los campos `tipo`/`key`).
const normalizarItem = (item) => {
    const tipo = item.tipo || "producto";

    return {
        ...item,
        tipo,
        key: item.key || construirKey(tipo, item.id),
    };
};

export function CartProvider({ children }) {
    const [items, setItems] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            const parsed = saved ? JSON.parse(saved) : [];
            return parsed.map(normalizarItem);
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const normalizarCantidad = (cantidad, stock) => {
        const nuevaCantidad = Number(cantidad);

        if (!Number.isFinite(nuevaCantidad) || nuevaCantidad <= 0) {
            return 0;
        }

        if (stock !== null && stock !== undefined) {
            return Math.min(nuevaCantidad, Number(stock));
        }

        return nuevaCantidad;
    };

    // Suma un ítem ya normalizado (producto o servicio). Si ya está en el
    // carrito incrementa la cantidad respetando el stock cuando aplica.
    const agregarItem = (nuevoItem) => {
        setItems((prevItems) => {
            const stock = nuevoItem.stock ?? null;

            if (stock !== null && Number(stock) <= 0) {
                return prevItems;
            }

            const existente = prevItems.find(
                (item) => item.key === nuevoItem.key
            );

            if (existente) {
                const nuevaCantidad = normalizarCantidad(
                    existente.cantidad + 1,
                    existente.stock
                );

                return prevItems.map((item) =>
                    item.key === nuevoItem.key
                        ? { ...item, cantidad: nuevaCantidad }
                        : item
                );
            }

            return [...prevItems, { ...nuevoItem, cantidad: 1 }];
        });
    };

    const agregarProducto = (producto) => {
        const stock = producto.stock ?? null;

        agregarItem({
            key: construirKey("producto", producto.id),
            tipo: "producto",
            id: producto.id,
            sku: producto.sku || "",
            nombre: producto.nombre,
            slug: producto.slug,
            precio_venta: Number(producto.precio_venta || 0),
            foto_url: producto.foto_url || null,
            stock,
        });
    };

    // Los servicios no manejan stock. El precio unitario es `precio_base` y
    // lo guardamos como `precio_venta` para que el carrito sea uniforme.
    const agregarServicio = (servicio) => {
        agregarItem({
            key: construirKey("servicio", servicio.id),
            tipo: "servicio",
            id: servicio.id,
            sku: servicio.codigo_interno || "",
            nombre: servicio.nombre,
            slug: servicio.slug,
            precio_venta: Number(servicio.precio_base || 0),
            foto_url: servicio.imagen_url || null,
            stock: null,
        });
    };

    const cambiarCantidad = (key, cantidad) => {
        setItems((prevItems) => {
            const itemActual = prevItems.find((item) => item.key === key);

            if (!itemActual) {
                return prevItems;
            }

            const nuevaCantidad = normalizarCantidad(
                cantidad,
                itemActual.stock
            );

            if (nuevaCantidad <= 0) {
                return prevItems.filter((item) => item.key !== key);
            }

            return prevItems.map((item) =>
                item.key === key
                    ? { ...item, cantidad: nuevaCantidad }
                    : item
            );
        });
    };

    const eliminarItem = (key) => {
        setItems((prevItems) =>
            prevItems.filter((item) => item.key !== key)
        );
    };

    const vaciarCarrito = () => {
        setItems([]);
    };

    const totalItems = items.reduce(
        (acc, item) => acc + item.cantidad,
        0
    );

    const totalPedido = items.reduce(
        (acc, item) => acc + item.precio_venta * item.cantidad,
        0
    );

    return (
        <CartContext.Provider
            value={{
                items,
                totalItems,
                totalPedido,
                agregarProducto,
                agregarServicio,
                cambiarCantidad,
                eliminarItem,
                vaciarCarrito,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
