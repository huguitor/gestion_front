import { Link } from "react-router-dom";

function ServiceCard({
    servicio,
    mostrarPrecio = true
}) {
    return (
        <div className="col-md-6 col-lg-4">
            <Link
                to={`/servicios/${servicio.slug}`}
                className="text-decoration-none text-dark"
            >
                <div className="card h-100 shadow-sm border-0 product-card-clickable">

                    {servicio.imagen_url ? (
                        <div className="position-relative">
                            <img
                                src={servicio.imagen_url}
                                className="card-img-top"
                                alt={servicio.nombre}
                                style={{
                                    height: "220px",
                                    objectFit: "cover"
                                }}
                            />

                            {servicio.video_url && (
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
                            {servicio.nombre}
                        </h5>

                        <p className="card-text text-muted flex-grow-1">
                            {servicio.descripcion_corta ||
                                "Servicio disponible para contratar."}
                        </p>

                        {mostrarPrecio && servicio.precio_base ? (
                            <p className="fw-bold fs-5 mb-3">
                                ${servicio.precio_base}
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

export default ServiceCard;
