import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/client";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function ServicioDetalle() {
    const { slug } = useParams();
    const navigate = useNavigate();

    const { isAuthenticated, loadingAuth } = useAuth();
    const { agregarServicio } = useCart();

    const [servicio, setServicio] = useState(null);
    const [error, setError] = useState("");
    const [mostrarVideo, setMostrarVideo] = useState(false);
    const [cantidad, setCantidad] = useState(1);

    const cambiarCantidad = (valor) => {
        const nuevaCantidad = Number(valor);

        if (!Number.isFinite(nuevaCantidad) || nuevaCantidad < 1) {
            setCantidad(1);
            return;
        }

        setCantidad(Math.floor(nuevaCantidad));
    };

    const agregarCantidadAlCarrito = () => {
        for (let i = 0; i < cantidad; i++) {
            agregarServicio(servicio);
        }
    };

    const agregar = () => {
        agregarCantidadAlCarrito();
        alert("Servicio agregado al pedido");
    };

    const hacerPedido = () => {
        agregarCantidadAlCarrito();
        navigate("/carrito");
    };

    const consultarWhatsapp = () => {
        const telefono = "5492995214846";
        const urlActual = window.location.href;

        const mensaje = `Hola.

Quiero consultar por este servicio:

Servicio:
${servicio.nombre}

Código:
${servicio.codigo_interno || "-"}

Precio:
${servicio.precio_base ? `$${servicio.precio_base}` : "Consultar"}

Link:
${urlActual}

Consulta:
`;

        const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, "_blank");
    };

    useEffect(() => {
        if (loadingAuth) return;

        const cargarDatos = async () => {
            try {
                const endpoint = isAuthenticated
                    ? `/productos/web/servicios-cliente/${slug}/`
                    : `/productos/web/servicios/${slug}/`;

                const res = await api.get(endpoint);
                setServicio(res.data);
            } catch (err) {
                console.error("Error cargando servicio:", err);
                setError("No se pudo cargar el servicio.");
            }
        };

        cargarDatos();
    }, [slug, isAuthenticated, loadingAuth]);

    if (loadingAuth || !servicio) {
        return (
            <MainLayout>
                <div className="container py-5">
                    <p>Cargando servicio...</p>
                </div>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout>
                <div className="container py-5">
                    <div className="alert alert-danger">{error}</div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="container py-4">
                <div className="row g-4">

                    <div className="col-md-6">

                        {servicio.imagen_url ? (
                            <img
                                src={servicio.imagen_url}
                                alt={servicio.nombre}
                                className="img-fluid rounded shadow-sm w-100"
                            />
                        ) : (
                            <div className="placeholder-box d-flex align-items-center justify-content-center">
                                Sin imagen
                            </div>
                        )}

                        {servicio.video_url && (
                            <div className="mt-3">
                                <button
                                    type="button"
                                    className="btn p-0 border rounded shadow-sm video-thumb-button"
                                    onClick={() => setMostrarVideo(true)}
                                >
                                    <video
                                        muted
                                        className="video-thumb"
                                    >
                                        <source src={servicio.video_url} type="video/mp4" />
                                    </video>

                                    <span className="video-thumb-label">
                                        ▶ Ver video
                                    </span>
                                </button>
                            </div>
                        )}

                    </div>

                    <div className="col-md-6">

                        <h1 className="h3">
                            {servicio.nombre}
                        </h1>

                        <p className="text-muted">
                            {servicio.descripcion ||
                                servicio.descripcion_corta ||
                                "Servicio disponible."}
                        </p>

                        {servicio.precio_base ? (
                            <>
                                <h3 className="mt-4">
                                    ${servicio.precio_base}
                                </h3>

                                <div className="mb-3 mt-3">
                                    <div className="small text-muted mb-2">
                                        Cantidad
                                    </div>

                                    <input
                                        type="number"
                                        min="1"
                                        value={cantidad}
                                        className="form-control"
                                        onChange={(e) => cambiarCantidad(e.target.value)}
                                    />
                                </div>

                                <button
                                    className="btn btn-primary w-100 mb-2"
                                    onClick={hacerPedido}
                                >
                                    Hacer pedido
                                </button>

                                <button
                                    className="btn btn-outline-primary w-100 mb-2"
                                    onClick={agregar}
                                >
                                    Agregar al carrito
                                </button>

                                <button
                                    className="btn btn-success w-100"
                                    onClick={consultarWhatsapp}
                                >
                                    🟢 Consultar por WhatsApp
                                </button>
                            </>
                        ) : (
                            <div className="alert alert-info mt-4">
                                Ingresá para ver precios y realizar pedidos.
                            </div>
                        )}

                    </div>

                </div>
            </div>

            {mostrarVideo && (
                <div
                    className="video-modal-backdrop"
                    onClick={() => setMostrarVideo(false)}
                >
                    <div
                        className="video-modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="btn btn-light video-modal-close"
                            onClick={() => setMostrarVideo(false)}
                        >
                            ✕
                        </button>

                        <video
                            controls
                            autoPlay
                            className="video-modal-player"
                        >
                            <source
                                src={servicio.video_url}
                                type="video/mp4"
                            />

                            Tu navegador no soporta video.
                        </video>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}

export default ServicioDetalle;