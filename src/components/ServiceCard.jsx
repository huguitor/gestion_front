import { Link } from "react-router-dom";

function ServiceCard({ servicio }) {
    return (
        <div className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0">
                {servicio.imagen_url ? (
                    <img
                        src={servicio.imagen_url}
                        className="card-img-top"
                        alt={servicio.nombre}
                        style={{ height: "220px", objectFit: "cover" }}
                    />
                ) : (
                    <div className="placeholder-box d-flex align-items-center justify-content-center">
                        Sin imagen
                    </div>
                )}

                <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{servicio.nombre}</h5>
                    <p className="card-text text-muted flex-grow-1">
                        {servicio.descripcion_corta || "Servicio disponible para contratar."}
                    </p>
                    <p className="fw-bold fs-5 mb-3">${servicio.precio_base}</p>
                    <Link to={`/servicios/${servicio.slug}`} className="btn btn-outline-dark">
                        Ver detalle
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ServiceCard;