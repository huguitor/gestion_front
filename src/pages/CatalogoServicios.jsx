import { useEffect, useState } from "react";
import api from "../api/client";
import MainLayout from "../layouts/MainLayout";
import ServiceCard from "../components/ServiceCard";
import { useAuth } from "../context/AuthContext";

function CatalogoServicios() {
    const { isAuthenticated, loadingAuth } = useAuth();

    const [servicios, setServicios] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (loadingAuth) return;

        const cargarDatos = async () => {
            try {
                setLoading(true);
                setError("");

                const endpoint = isAuthenticated
                    ? "/productos/web/catalogo/servicios-cliente/"
                    : "/productos/web/catalogo/servicios/";

                const res = await api.get(endpoint);

                setServicios(res.data || []);
            } catch (err) {
                console.error("Error cargando catálogo de servicios:", err);
                setError("No se pudo cargar el catálogo de servicios.");
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, [isAuthenticated, loadingAuth]);

    if (loadingAuth || loading) {
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
                        {isAuthenticated
                            ? "Explorá servicios disponibles y consultá precios."
                            : "Explorá los servicios disponibles. Ingresá para ver precios y realizar pedidos."}
                    </p>
                </div>
            </section>

            <section className="py-5">
                <div className="container">
                    {servicios.length > 0 ? (
                        <div className="row g-4">
                            {servicios.map((servicio) => (
                                <ServiceCard
                                    key={servicio.id}
                                    servicio={servicio}
                                    mostrarPrecio={isAuthenticated}
                                />
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