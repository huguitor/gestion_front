import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

function Carrito() {
    const {
        items,
        totalItems,
        totalPedido,
        cambiarCantidad,
        eliminarItem,
        vaciarCarrito,
    } = useCart();

    const { user } = useAuth();
    const navigate = useNavigate();

    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");

    const WHATSAPP_EMPRESA = "5492995214846";

    const generarMensajeWhatsApp = (pedidoId = null) => {
        const cliente = user?.nombre || user?.email || "Cliente web";

        const lineasItems = items.map((item, index) => {
            const subtotal = item.precio_venta * item.cantidad;
            const etiquetaTipo = item.tipo === "servicio" ? "Servicio" : "Producto";

            return `${index + 1}) [${etiquetaTipo}] ${item.nombre}
Código: ${item.sku || "Sin código"}
Cantidad: ${item.cantidad}
Precio unitario: $${item.precio_venta}
Subtotal: $${subtotal.toFixed(2)}`;
        });

        return `Hola, quiero realizar este pedido:

${pedidoId ? `Pedido web N°: ${pedidoId}\n` : ""}
Cliente: ${cliente}
Email: ${user?.email || "No informado"}

Detalle del pedido:
${lineasItems.join("\n\n")}

Cantidad total de ítems: ${totalItems}
Total estimado: $${totalPedido.toFixed(2)}

Quedo atento/a a la confirmación.`;
    };

    const abrirWhatsApp = (pedidoId = null) => {
        const mensaje = generarMensajeWhatsApp(pedidoId);
        const url = `https://wa.me/${WHATSAPP_EMPRESA}?text=${encodeURIComponent(mensaje)}`;

        window.open(url, "_blank");
    };

    const confirmarPedido = async () => {
        setError("");

        if (items.length === 0) {
            setError("El carrito está vacío.");
            return;
        }

        try {
            setGuardando(true);

            const payload = {
                observaciones_cliente: "",
                items: items.map((item) =>
                    item.tipo === "servicio"
                        ? { servicio: item.id, cantidad: item.cantidad }
                        : { producto: item.id, cantidad: item.cantidad }
                ),
            };

            const res = await api.post("/pedidos/", payload);

            abrirWhatsApp(res.data.id);

            vaciarCarrito();

            navigate("/productos");
        } catch (err) {
            console.error(err);

            const detalle =
                err.response?.data?.items?.[0] ||
                err.response?.data?.detail ||
                err.response?.data?.non_field_errors?.[0];

            setError(
                detalle ||
                "No se pudo guardar el pedido. Verificá que estés logueado y que haya stock disponible."
            );
        } finally {
            setGuardando(false);
        }
    };

    return (
        <MainLayout>
            <section className="py-5 bg-light border-bottom">
                <div className="container">
                    <h1 className="mb-3">Carrito de pedido</h1>
                    <p className="text-muted mb-0">
                        Revisá los productos seleccionados antes de enviar el pedido.
                    </p>
                </div>
            </section>

            <section className="py-5">
                <div className="container">
                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}

                    {items.length === 0 ? (
                        <div className="alert alert-secondary">
                            Tu carrito está vacío.

                            <div className="mt-3">
                                <Link to="/productos" className="btn btn-dark">
                                    Ver productos
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <table className="table align-middle">
                                    <thead>
                                        <tr>
                                            <th>Producto</th>
                                            <th>Precio</th>
                                            <th style={{ width: "140px" }}>Cantidad</th>
                                            <th>Subtotal</th>
                                            <th></th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {items.map((item) => (
                                            <tr key={item.key}>
                                                <td>
                                                    <div className="d-flex align-items-center gap-3">
                                                        {item.foto_url && (
                                                            <img
                                                                src={item.foto_url}
                                                                alt={item.nombre}
                                                                style={{
                                                                    width: "56px",
                                                                    height: "56px",
                                                                    objectFit: "cover",
                                                                    borderRadius: "8px",
                                                                }}
                                                            />
                                                        )}

                                                        <div>
                                                            <div className="fw-bold">
                                                                {item.nombre}

                                                                {item.tipo === "servicio" && (
                                                                    <span className="badge bg-info text-dark ms-2">
                                                                        Servicio
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {item.sku && (
                                                                <small className="text-muted d-block">
                                                                    {item.tipo === "servicio" ? "Código" : "SKU"}: {item.sku}
                                                                </small>
                                                            )}

                                                            {item.stock !== null && item.stock !== undefined && (
                                                                <small className="text-muted d-block">
                                                                    Stock disponible: {item.stock}
                                                                </small>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    ${Number(item.precio_venta || 0).toFixed(2)}
                                                </td>

                                                <td>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max={item.stock ?? undefined}
                                                        className="form-control form-control-sm"
                                                        value={item.cantidad}
                                                        onChange={(e) =>
                                                            cambiarCantidad(
                                                                item.key,
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </td>

                                                <td>
                                                    ${(
                                                        Number(item.precio_venta || 0) * item.cantidad
                                                    ).toFixed(2)}
                                                </td>

                                                <td className="text-end">
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger btn-sm"
                                                        onClick={() => eliminarItem(item.key)}
                                                    >
                                                        Quitar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mt-4">
                                <div>
                                    <p className="mb-1">
                                        Productos en pedido: <strong>{totalItems}</strong>
                                    </p>

                                    <h4 className="mb-0">
                                        Total estimado: ${totalPedido.toFixed(2)}
                                    </h4>
                                </div>

                                <div className="d-flex flex-column flex-sm-row gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger"
                                        onClick={vaciarCarrito}
                                        disabled={guardando}
                                    >
                                        Vaciar
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-success"
                                        onClick={confirmarPedido}
                                        disabled={guardando}
                                    >
                                        {guardando
                                            ? "Guardando pedido..."
                                            : "Confirmar pedido y enviar WhatsApp"}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </MainLayout>
    );
}

export default Carrito;