import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";
import MainLayout from "../layouts/MainLayout";

function ServicioDetalle() {
    const { slug } = useParams();

    const [servicio, setServicio] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const res = await api.get(`/productos/web/servicios/${slug}/`);
                setServicio(res.data);
            } catch (err) {
                console.error("Error cargando servicio:", err);
                setError("No se pudo cargar el servicio.");
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

    if (!servicio) {
        return (
            <MainLayout>
                <div className="container py-5">
                    <p>Cargando servicio...</p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="container py-5">
                <div className="row g-4">
                    <div className="col-md-6">
                        {servicio.imagen_url ? (
                            <img
                                src={servicio.imagen_url}
                                alt={servicio.nombre}
                                className="img-fluid rounded shadow-sm"
                            />
                        ) : (
                            <div className="placeholder-box d-flex align-items-center justify-content-center">
                                Sin imagen
                            </div>
                        )}
                    </div>

                    <div className="col-md-6">
                        <h1>{servicio.nombre}</h1>
                        <p className="text-muted">{servicio.descripcion}</p>
                        <h3 className="mt-4">${servicio.precio_base}</h3>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

export default ServicioDetalle;