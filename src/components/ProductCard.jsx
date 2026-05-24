import { Link } from "react-router-dom";

function ProductCard({
    producto,
    mostrarPrecio = true
}) {
    return (
        <div className="col-md-6 col-lg-4">
            <Link
                to={`/productos/${producto.slug}`}
                className="text-decoration-none text-dark"
            >
                <div className="card h-100 shadow-sm border-0 product-card-clickable">

                    {producto.foto_url ? (
                        <div className="position-relative">
                            <img
                                src={producto.foto_url}
                                className="card-img-top"
                                alt={producto.nombre}
                                style={{
                                    height: "220px",
                                    objectFit: "cover"
                                }}
                            />

                            {producto.video_url && (
                                <div
                                    className="position-absolute top-0 end-0 m-2 px-2 py-1 rounded-pill"
                                    style={{
                                        background: "rgba(0,0,0,0.75)",
                                        color: "#fff",
                                        fontSize: "12px",
                                        fontWeight: "600"
                                    }}
                                >
                                    ▶ Video
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="placeholder-box d-flex align-items-center justify-content-center">
                            Sin imagen
                        </div>
                    )}

                    <div className="card-body d-flex flex-column">
                        <h5 className="card-title">
                            {producto.nombre}
                        </h5>

                        <p className="card-text text-muted flex-grow-1">
                            {producto.descripcion_corta ||
                                "Producto disponible en catálogo."}
                        </p>

                        {mostrarPrecio && producto.precio_venta ? (
                            <p className="fw-bold fs-5 mb-3">
                                ${producto.precio_venta}
                            </p>
                        ) : (
                            <p className="text-muted small mb-3">
                                Ingresá para ver precios y realizar pedidos.
                            </p>
                        )}

                    </div>
                </div>
            </Link>
        </div>
    );
}

export default ProductCard;