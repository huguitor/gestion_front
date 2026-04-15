import { useEffect, useState } from "react";
import api from "../api/client";
import MainLayout from "../layouts/MainLayout";
import ProductCard from "../components/ProductCard";
import ServiceCard from "../components/ServiceCard";
import { Link } from "react-router-dom";
import { useEmpresa } from "../context/EmpresaContext";

function Home() {
  const { empresa, empresaLoading, empresaError } = useEmpresa();

  const [productos, setProductos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarHome = async () => {
      try {
        const res = await api.get("/web/home/");
        setProductos(res.data.productos_destacados || []);
        setServicios(res.data.servicios_destacados || []);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la información principal del sitio.");
      }
    };

    cargarHome();
  }, []);

  if (empresaLoading) {
    return (
      <MainLayout>
        <div className="container py-5">
          <p>Cargando...</p>
        </div>
      </MainLayout>
    );
  }

  if (empresaError) {
    return (
      <MainLayout>
        <div className="container py-5">
          <div className="alert alert-danger">{empresaError}</div>
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
      <section className="hero-section py-5">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <h1 className="display-5 fw-bold mb-3">
                {empresa?.nombre_fantasia || "Bienvenido"}
              </h1>
              <p className="lead text-muted mb-4">
                {empresa?.descripcion_sistema || "Soluciones profesionales para tus necesidades."}
              </p>

              <div className="d-flex flex-wrap gap-2">
                <Link to="/productos" className="btn btn-dark btn-lg">
                  Ver productos
                </Link>
                <Link to="/servicios" className="btn btn-outline-dark btn-lg">
                  Ver servicios
                </Link>
              </div>
            </div>

            <div className="col-lg-5 text-center">
              {empresa?.logo_principal_url ? (
                <img
                  src={empresa.logo_principal_url}
                  alt={empresa.nombre_fantasia}
                  className="img-fluid hero-logo"
                />
              ) : (
                <div className="hero-placeholder">Logo empresa</div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Productos destacados</h2>
            <Link to="/productos" className="btn btn-sm btn-outline-dark">
              Ver todos
            </Link>
          </div>

          <div className="row g-4">
            {productos.length > 0 ? (
              productos.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))
            ) : (
              <p>No hay productos destacados disponibles.</p>
            )}
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Servicios destacados</h2>
            <Link to="/servicios" className="btn btn-sm btn-outline-dark">
              Ver todos
            </Link>
          </div>

          <div className="row g-4">
            {servicios.length > 0 ? (
              servicios.map((servicio) => (
                <ServiceCard key={servicio.id} servicio={servicio} />
              ))
            ) : (
              <p>No hay servicios destacados disponibles.</p>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default Home;