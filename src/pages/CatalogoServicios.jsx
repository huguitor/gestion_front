import { useEffect, useState } from "react";
import api from "../api/client";
import MainLayout from "../layouts/MainLayout";
import ServiceCard from "../components/ServiceCard";

function CatalogoServicios() {
    const [servicios, setServicios] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const res = await api.get("/productos/web/catalogo/servicios/");
                setServicios(res.data || []);
            } catch (err) {
                console.error("Error cargando catálogo de servicios:", err);
                setError("No se pudo cargar el catálogo de servicios.");
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, []);

    if (loading) {
        return (
            <MainLayout>
                <div className="container py-5">
                    <p>Cargando catálogo de servicios...</p>
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
            <section className="py-5 bg-light border-bottom">
                <div className="container">
                    <h1 className="mb-3">Catálogo de servicios</h1>
                    <p className="text-muted mb-0">
                        Explorá los servicios disponibles y conocé más detalles.
                    </p>
                </div>
            </section>

            <section className="py-5">
                <div className="container">
                    {servicios.length > 0 ? (
                        <div className="row g-4">
                            {servicios.map((servicio) => (
                                <ServiceCard key={servicio.id} servicio={servicio} />
                            ))}
                        </div>
                    ) : (
                        <div className="alert alert-secondary mb-0">
                            No hay servicios publicados en este momento.
                        </div>
                    )}
                </div>
            </section>
        </MainLayout>
    );
}

export default CatalogoServicios;