import { Link } from "react-router-dom";

function ProductCard({ producto }) {
    return (
        <div className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0">
                {producto.foto_url ? (
                    <img
                        src={producto.foto_url}
                        className="card-img-top"
                        alt={producto.nombre}
                        style={{ height: "220px", objectFit: "cover" }}
                    />
                ) : (
                    <div className="placeholder-box d-flex align-items-center justify-content-center">
                        Sin imagen
                    </div>
                )}

                <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{producto.nombre}</h5>
                    <p className="card-text text-muted flex-grow-1">
                        {producto.descripcion_corta || "Producto disponible en catálogo."}
                    </p>
                    <p className="fw-bold fs-5 mb-3">${producto.precio_venta}</p>
                    <Link to={`/productos/${producto.slug}`} className="btn btn-dark">
                        Ver detalle
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;