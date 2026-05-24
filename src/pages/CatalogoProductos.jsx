import { useEffect, useState } from "react";
import api from "../api/client";
import MainLayout from "../layouts/MainLayout";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../context/AuthContext";

function CatalogoProductos() {
    const { token, isAuthenticated, loadingAuth } = useAuth();

    const [productos, setProductos] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (loadingAuth) return;

        const cargarDatos = async () => {
            try {
                setLoading(true);
                setError("");

                const endpoint = isAuthenticated
                    ? "/productos/web/catalogo/mercaderia-cliente/"
                    : "/productos/web/catalogo/mercaderia/";

                const config = isAuthenticated
                    ? {
                        headers: {
                            Authorization: `Token ${token}`,
                        },
                    }
                    : {};

                const res = await api.get(endpoint, config);
                setProductos(res.data || []);
            } catch (err) {
                console.error("Error cargando catálogo de productos:", err);

                if (err.response?.status === 403) {
                    setError(
                        "Tu cuenta todavía no está verificada. Verificá tu correo para poder ver precios y realizar pedidos."
                    );
                } else {
                    setError("No se pudo cargar el catálogo de productos.");
                }
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, [token, isAuthenticated, loadingAuth]);

    if (loadingAuth || loading) {
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
                        {isAuthenticated
                            ? "Explorá productos publicados, precios disponibles y armá tu pedido."
                            : "Explorá nuestra mercadería disponible. Ingresá para ver precios y realizar pedidos."}
                    </p>
                </div>
            </section>

            <section className="py-5">
                <div className="container">
                    {productos.length > 0 ? (
                        <div className="row g-4">
                            {productos.map((producto) => (
                                <ProductCard
                                    key={producto.id}
                                    producto={producto}
                                    mostrarPrecio={isAuthenticated}
                                />
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