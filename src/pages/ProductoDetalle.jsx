import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/client";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function ProductoDetalle() {
    const { slug } = useParams();
    const navigate = useNavigate();

    const { isAuthenticated, loadingAuth } = useAuth();
    const { agregarProducto } = useCart();

    const [producto, setProducto] = useState(null);
    const [error, setError] = useState("");
    const [avisoStock, setAvisoStock] = useState("");
    const [mostrarVideo, setMostrarVideo] = useState(false);
    const [cantidad, setCantidad] = useState(1);

    useEffect(() => {
        if (loadingAuth) return;

        const cargarDatos = async () => {
            try {
                const endpoint = isAuthenticated
                    ? `/productos/web/productos-cliente/${slug}/`
                    : `/productos/web/productos/${slug}/`;

                const res = await api.get(endpoint);
                setProducto(res.data);
            } catch (err) {
                console.error(err);
                setError("No se pudo cargar el producto.");
            }
        };

        cargarDatos();
    }, [slug, isAuthenticated, loadingAuth]);

    const obtenerStock = () => {
        if (producto?.stock === null || producto?.stock === undefined) {
            return null;
        }

        return Number(producto.stock);
    };

    const normalizarCantidad = (valor) => {
        const stock = obtenerStock();
        let nuevaCantidad = Number(valor);

        if (!Number.isFinite(nuevaCantidad) || nuevaCantidad < 1) {
            nuevaCantidad = 1;
        }

        if (stock !== null && nuevaCantidad > stock) {
            setAvisoStock(`Solo quedan ${stock} unidades disponibles.`);
            return stock;
        }

        setAvisoStock("");
        return nuevaCantidad;
    };

    const cambiarCantidad = (valor) => {
        setCantidad(normalizarCantidad(valor));
    };

    const agregarCantidadAlCarrito = () => {
        const cantidadFinal = normalizarCantidad(cantidad);

        if (cantidadFinal <= 0) {
            setAvisoStock("No hay stock disponible para este producto.");
            return false;
        }

        for (let i = 0; i < cantidadFinal; i++) {
            agregarProducto(producto);
        }

        setCantidad(cantidadFinal);
        return true;
    };

    const agregar = () => {
        const agregado = agregarCantidadAlCarrito();

        if (agregado) {
            alert("Producto agregado al pedido");
        }
    };

    const hacerPedido = () => {
        const agregado = agregarCantidadAlCarrito();

        if (agregado) {
            navigate("/carrito");
        }
    };

    const consultarWhatsapp = () => {
        const telefono = "5492995214846";
        const urlActual = window.location.href;

        const mensaje = `Hola.

Quiero consultar por este producto:

Producto:
${producto.nombre}

Código:
${producto.sku || producto.codigo || "-"}

Precio:
${producto.precio_venta ? `$${producto.precio_venta}` : "Consultar"}

Link:
${urlActual}

Consulta:
`;

        const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, "_blank");
    };

    if (loadingAuth || !producto) {
        return (
            <MainLayout>
                <div className="container py-5">
                    Cargando producto...
                </div>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout>
                <div className="container py-5">
                    <div className="alert alert-danger">
                        {error}
                    </div>
                </div>
            </MainLayout>
        );
    }

    const stock = obtenerStock();
    const sinStock = stock !== null && stock <= 0;

    return (
        <MainLayout>
            <div className="container py-4">
                <div className="row g-4">
                    <div className="col-lg-7">
                        {producto.foto_url ? (
                            <img
                                src={producto.foto_url}
                                alt={producto.nombre}
                                className="img-fluid rounded shadow w-100"
                            />
                        ) : (
                            <div className="placeholder-box">
                                Sin imagen
                            </div>
                        )}

                        {producto.video_url && (
                            <div className="mt-3 d-flex gap-2 flex-wrap">
                                <button
                                    type="button"
                                    className="media-thumb-button"
                                    onClick={() => setMostrarVideo(true)}
                                >
                                    <div className="media-thumb-icon">
                                        ▶
                                    </div>

                                    <div className="media-thumb-label">
                                        Video
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="col-lg-5">
                        <div className="card shadow-sm border-0 sticky-top">
                            <div className="card-body">
                                <h1 className="h3">
                                    {producto.nombre}
                                </h1>

                                <p className="text-muted">
                                    {producto.descripcion || producto.descripcion_corta}
                                </p>

                                {producto.precio_venta ? (
                                    <>
                                        <h2 className="mb-3">
                                            ${producto.precio_venta}
                                        </h2>

                                        {stock !== null && (
                                            <div
                                                className={
                                                    sinStock
                                                        ? "alert alert-danger py-2"
                                                        : "alert alert-success py-2"
                                                }
                                            >
                                                {sinStock
                                                    ? "Sin stock disponible."
                                                    : `Stock disponible: ${stock} unidades.`}
                                            </div>
                                        )}

                                        {avisoStock && (
                                            <div className="alert alert-warning py-2">
                                                {avisoStock}
                                            </div>
                                        )}

                                        <div className="mb-3">
                                            <div className="small text-muted mb-2">
                                                Cantidad
                                            </div>

                                            <input
                                                type="number"
                                                min="1"
                                                max={stock ?? undefined}
                                                value={cantidad}
                                                className="form-control"
                                                disabled={sinStock}
                                                onChange={(e) => cambiarCantidad(e.target.value)}
                                            />
                                        </div>

                                        <button
                                            className="btn btn-primary w-100 mb-2"
                                            onClick={hacerPedido}
                                            disabled={sinStock}
                                        >
                                            Hacer pedido
                                        </button>

                                        <button
                                            className="btn btn-outline-primary w-100 mb-2"
                                            onClick={agregar}
                                            disabled={sinStock}
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
                                    <div className="alert alert-info">
                                        Ingresá para ver precios y realizar pedidos.
                                    </div>
                                )}
                            </div>
                        </div>
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
                            className="video-close-btn"
                            onClick={() => setMostrarVideo(false)}
                        >
                            ✕
                        </button>

                        <video
                            controls
                            autoPlay
                            playsInline
                            className="video-modal-player"
                        >
                            <source src={producto.video_url} />
                            Tu navegador no soporta video.
                        </video>

                        <button
                            type="button"
                            className="btn btn-dark w-100 mt-3"
                            onClick={() => setMostrarVideo(false)}
                        >
                            Cerrar video
                        </button>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}

export default ProductoDetalle;