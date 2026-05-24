import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

const STORAGE_KEY = "pedido_carrito";

export function CartProvider({ children }) {
    const [items, setItems] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
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

    const agregarProducto = (producto) => {
        setItems((prevItems) => {
            const stock = producto.stock ?? null;

            if (stock !== null && Number(stock) <= 0) {
                return prevItems;
            }

            const existente = prevItems.find(
                (item) => item.id === producto.id
            );

            if (existente) {
                const nuevaCantidad = normalizarCantidad(
                    existente.cantidad + 1,
                    existente.stock
                );

                return prevItems.map((item) =>
                    item.id === producto.id
                        ? { ...item, cantidad: nuevaCantidad }
                        : item
                );
            }

            return [
                ...prevItems,
                {
                    id: producto.id,
                    sku: producto.sku || "",
                    nombre: producto.nombre,
                    slug: producto.slug,
                    precio_venta: Number(producto.precio_venta || 0),
                    foto_url: producto.foto_url || null,
                    stock: stock,
                    cantidad: 1,
                },
            ];
        });
    };

    const cambiarCantidad = (productoId, cantidad) => {
        setItems((prevItems) => {
            const itemActual = prevItems.find((item) => item.id === productoId);

            if (!itemActual) {
                return prevItems;
            }

            const nuevaCantidad = normalizarCantidad(
                cantidad,
                itemActual.stock
            );

            if (nuevaCantidad <= 0) {
                return prevItems.filter((item) => item.id !== productoId);
            }

            return prevItems.map((item) =>
                item.id === productoId
                    ? { ...item, cantidad: nuevaCantidad }
                    : item
            );
        });
    };

    const eliminarProducto = (productoId) => {
        setItems((prevItems) =>
            prevItems.filter((item) => item.id !== productoId)
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
                cambiarCantidad,
                eliminarProducto,
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