import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import api from "../api/client";

function MiPedidoDetalle() {

    const { id } = useParams();

    const [pedido, setPedido] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [descargando, setDescargando] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {

        const cargarPedido = async () => {

            try {

                const res =
                    await api.get(
                        `/pedidos/${id}/`
                    );

                setPedido(
                    res.data
                );

            } catch {

                setError(
                    "No se pudo cargar el detalle del pedido."
                );

            } finally {

                setCargando(
                    false
                );

            }

        };

        cargarPedido();

    }, [id]);

    const descargarPDF = async () => {

        try {

            setDescargando(true);

            const res =
                await api.get(
                    `/pedidos/${id}/pdf/`,
                    {
                        responseType:
                            "blob",
                    }
                );

            const url =
                URL.createObjectURL(
                    new Blob(
                        [res.data]
                    )
                );

            const a =
                document.createElement(
                    "a"
                );

            a.href = url;

            a.download =
                `pedido_${id}.pdf`;

            a.click();

            URL.revokeObjectURL(
                url
            );

        } catch {

            alert(
                "No se pudo generar el PDF"
            );

        } finally {

            setDescargando(
                false
            );

        }

    };

    const formatearFecha = (fecha) =>
        fecha
            ? new Date(
                fecha
            ).toLocaleString(
                "es-AR",
                {
                    dateStyle:
                        "short",

                    timeStyle:
                        "short",
                }
            )
            : "-";

    const formatearPrecio = (valor) =>
        `$${Number(
            valor || 0
        ).toFixed(2)}`;

    return (
        <MainLayout>

            <section className="py-5 bg-light border-bottom">

                <div className="container">

                    <div className="d-flex gap-2">

                        <Link
                            to="/mis-pedidos"
                            className="btn btn-outline-dark btn-sm"
                        >
                            Volver
                        </Link>

                        <button
                            className="btn btn-danger btn-sm"
                            onClick={
                                descargarPDF
                            }
                            disabled={
                                descargando
                            }
                        >
                            {
                                descargando
                                    ? "Generando..."
                                    : "Descargar PDF"
                            }
                        </button>

                    </div>

                </div>

            </section>

            <section className="py-5">

                <div className="container">

                    {cargando && (
                        <div className="alert alert-info">
                            Cargando...
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}

                    {!cargando &&
                        pedido && (
                            <div className="card">

                                <div className="card-body">

                                    <h3>
                                        Pedido #{pedido.id}
                                    </h3>

                                    <p>
                                        Fecha:
                                        {" "}
                                        {
                                            formatearFecha(
                                                pedido.creado
                                            )
                                        }
                                    </p>

                                    <p>
                                        Total:
                                        {" "}
                                        {
                                            formatearPrecio(
                                                pedido.total
                                            )
                                        }
                                    </p>

                                </div>

                            </div>
                        )}

                </div>

            </section>

        </MainLayout>
    );

}

export default MiPedidoDetalle;