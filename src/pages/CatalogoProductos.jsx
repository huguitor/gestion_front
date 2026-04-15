import { useEffect, useState } from "react";
import api from "../api/client";
import MainLayout from "../layouts/MainLayout";
import ProductCard from "../components/ProductCard";

function CatalogoProductos() {
    const [productos, setProductos] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const res = await api.get("/productos/web/catalogo/mercaderia/");
                setProductos(res.data || []);
            } catch (err) {
                console.error("Error cargando catálogo de productos:", err);
                setError("No se pudo cargar el catálogo de productos.");
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
                    <p>Cargando catálogo de productos...</p>
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
                    <h1 className="mb-3">Catálogo de productos</h1>
                    <p className="text-muted mb-0">
                        Explorá nuestra mercadería disponible y consultá el detalle de cada producto.
                    </p>
                </div>
            </section>

            <section className="py-5">
                <div className="container">
                    {productos.length > 0 ? (
                        <div className="row g-4">
                            {productos.map((producto) => (
                                <ProductCard key={producto.id} producto={producto} />
                            ))}
                        </div>
                    ) : (
                        <div className="alert alert-secondary mb-0">
                            No hay productos publicados en este momento.
                        </div>
                    )}
                </div>
            </section>
        </MainLayout>
    );
}

export default CatalogoProductos;