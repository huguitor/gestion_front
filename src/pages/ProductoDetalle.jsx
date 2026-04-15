import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";
import MainLayout from "../layouts/MainLayout";

function ProductoDetalle() {
    const { slug } = useParams();

    const [producto, setProducto] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const res = await api.get(`/productos/web/productos/${slug}/`);
                setProducto(res.data);
            } catch (err) {
                console.error("Error cargando producto:", err);
                setError("No se pudo cargar el producto.");
            }
        };

        cargarDatos();
    }, [slug]);

    if (error) {
        return (
            <MainLayout>
                <div className="container py-5">
                    <div className="alert alert-danger">{error}</div>
                </div>
            </MainLayout>
        );
    }

    if (!producto) {
        return (
            <MainLayout>
                <div className="container py-5">
                    <p>Cargando producto...</p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="container py-5">
                <div className="row g-4">
                    <div className="col-md-6">
                        {producto.foto_url ? (
                            <img
                                src={producto.foto_url}
                                alt={producto.nombre}
                                className="img-fluid rounded shadow-sm"
                            />
                        ) : (
                            <div className="placeholder-box d-flex align-items-center justify-content-center">
                                Sin imagen
                            </div>
                        )}
                    </div>

                    <div className="col-md-6">
                        <h1>{producto.nombre}</h1>
                        <p className="text-muted">{producto.descripcion}</p>
                        <h3 className="mt-4">${producto.precio_venta}</h3>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

export default ProductoDetalle;