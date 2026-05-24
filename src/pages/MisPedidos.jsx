import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import api from "../api/client";

function MisPedidos() {
    const [pedidos, setPedidos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const cargarPedidos = async () => {
            try {
                const res = await api.get("/pedidos/mis_pedidos/");
                setPedidos(res.data);
            } catch (err) {
                console.error(err);
                setError("No se pudieron cargar tus pedidos.");
            } finally {
                setCargando(false);
            }
        };

        cargarPedidos();
    }, []);

    const formatearFecha = (fecha) => {
        if (!fecha) return "-";

        return new Date(fecha).toLocaleString("es-AR", {
            dateStyle: "short",
            timeStyle: "short",
        });
    };

    const formatearPrecio = (valor) => {
        return `$${Number(valor || 0).toFixed(2)}`;
    };

    const obtenerClaseEstado = (estado) => {
        switch ((estado || "").toLowerCase()) {
            case "pendiente":
                return "bg-warning text-dark";
            case "revisado":
                return "bg-info text-dark";
            case "contactado":
                return "bg-primary";
            case "confirmado":
                return "bg-primary";
            case "entregado":
                return "bg-success";
            case "cancelado":
                return "bg-danger";
            default:
                return "bg-secondary";
        }
    };

    const obtenerTextoEstado = (estado) => {
        switch ((estado || "").toLowerCase()) {
            case "pendiente":
                return "Pedido recibido";
            case "revisado":
                return "Pedido revisado";
            case "contactado":
                return "Cliente contactado";
            case "confirmado":
                return "Pedido confirmado";
            case "entregado":
                return "Pedido entregado";
            case "cancelado":
                return "Pedido cancelado";
            default:
                return estado || "Sin estado";
        }
    };

    const pasos = [
        { key: "pendiente", label: "Recibido" },
        { key: "revisado", label: "Revisado" },
        { key: "contactado", label: "Contactado" },
        { key: "confirmado", label: "Confirmado" },
        { key: "entregado", label: "Entregado" },
    ];

    const obtenerIndiceEstado = (estado) => {
        const estadoNormalizado = (estado || "").toLowerCase();

        if (estadoNormalizado === "cancelado") {
            return -1;
        }

        return pasos.findIndex((paso) => paso.key === estadoNormalizado);
    };

    const renderTimeline = (estado) => {
        const estadoNormalizado = (estado || "").toLowerCase();
        const indiceActual = obtenerIndiceEstado(estado);

        if (estadoNormalizado === "cancelado") {
            return (
                <div className="d-flex flex-wrap gap-2 mt-2">
                    <span className="badge bg-danger">
                        ✖ Pedido cancelado
                    </span>
                </div>
            );
        }

        return (
            <div className="d-flex flex-wrap gap-2 mt-2">
                {pasos.map((paso, index) => {
                    const completado = indiceActual >= index;

                    return (
                        <span
                            key={paso.key}
                            className={`badge ${completado
                                    ? "bg-success"
                                    : "bg-light text-muted border"
                                }`}
                        >
                            {completado ? "✓" : "○"} {paso.label}
                        </span>
                    );
                })}
            </div>
        );
    };

    return (
        <MainLayout>
            <section className="py-5 bg-light border-bottom">
                <div className="container">
                    <h1 className="mb-3">Mis pedidos</h1>
                    <p className="text-muted mb-0">
                        Acá podés ver el estado de tus pedidos realizados desde la web.
                    </p>
                </div>
            </section>

            <section className="py-5">
                <div className="container">
                    {cargando && (
                        <div className="alert alert-info">
                            Cargando pedidos...
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}

                    {!cargando && !error && pedidos.length === 0 && (
                        <div className="alert alert-secondary">
                            Todavía no tenés pedidos cargados.
                        </div>
                    )}

                    {!cargando && pedidos.length > 0 && (
                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead>
                                    <tr>
                                        <th>Pedido</th>
                                        <th>Fecha</th>
                                        <th>Estado</th>
                                        <th>Total</th>
                                        <th>Productos</th>
                                        <th></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {pedidos.map((pedido) => (
                                        <tr key={pedido.id}>
                                            <td>
                                                <strong>#{pedido.id}</strong>
                                            </td>

                                            <td>
                                                {formatearFecha(pedido.creado)}
                                            </td>

                                            <td style={{ minWidth: "360px" }}>
                                                <span className={`badge ${obtenerClaseEstado(pedido.estado)}`}>
                                                    {obtenerTextoEstado(pedido.estado)}
                                                </span>

                                                {renderTimeline(pedido.estado)}
                                            </td>

                                            <td>
                                                {formatearPrecio(pedido.total)}
                                            </td>

                                            <td>
                                                {pedido.items?.length || 0}
                                            </td>

                                            <td className="text-end">
                                                <Link
                                                    to={`/mis-pedidos/${pedido.id}`}
                                                    className="btn btn-sm btn-outline-primary"
                                                >
                                                    Ver detalle
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>
        </MainLayout>
    );
}

export default MisPedidos;