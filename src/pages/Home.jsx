import { useEffect, useState } from "react";
import api from "../api/client";
import MainLayout from "../layouts/MainLayout";
import ProductCard from "../components/ProductCard";
import ServiceCard from "../components/ServiceCard";
import { Link } from "react-router-dom";
import { useEmpresa } from "../context/EmpresaContext";

function Home() {
  const { empresa, empresaLoading, empresaError } = useEmpresa();

  const [ofertas, setOfertas] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarHome = async () => {
      try {
        const res = await api.get("/web/home/");

        setOfertas(res.data.ofertas || []);
        setProductosSeleccionados(
          res.data.productos_seleccionados || []
        );
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

  if (empresaError || error) {
    return (
      <MainLayout>
        <div className="container py-5">
          <div className="alert alert-danger">
            {empresaError || error}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>

      {/* OFERTAS */}
      <section className="py-4 bg-light border-bottom">
        <div className="container">

          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
            <div>
              <h1 className="h3 fw-bold mb-1">
                Ofertas destacadas
              </h1>

              <p className="text-muted mb-0">
                Productos destacados con precios promocionales.
              </p>
            </div>

            <Link to="/productos" className="btn btn-dark">
              Ver catálogo
            </Link>
          </div>

          <div className="row g-4">
            {ofertas.length > 0 ? (
              ofertas.map((producto) => (
                <ProductCard
                  key={producto.id}
                  producto={producto}
                  mostrarPrecio={true}
                />
              ))
            ) : (
              <div className="col-12">
                <div className="alert alert-secondary mb-0">
                  No hay ofertas disponibles.
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* PRODUCTOS SELECCIONADOS */}
      <section className="py-4">
        <div className="container">

          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
            <div>
              <h2 className="h4 fw-bold mb-1">
                Productos seleccionados
              </h2>

              <p className="text-muted mb-0">
                Equipos y productos destacados del catálogo.
              </p>
            </div>
          </div>

          <div className="row g-4">
            {productosSeleccionados.length > 0 ? (
              productosSeleccionados.map((producto) => (
                <ProductCard
                  key={producto.id}
                  producto={producto}
                  mostrarPrecio={false}
                />
              ))
            ) : (
              <div className="col-12">
                <div className="alert alert-secondary mb-0">
                  No hay productos seleccionados disponibles.
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* PRESENTACIÓN EMPRESA */}
      <section className="home-intro-section py-4">
        <div className="container">

          <div className="row align-items-center g-4">

            <div className="col-lg-8">

              <h2 className="h4 fw-bold mb-2">
                {empresa?.nombre_fantasia || "Panozo Sistemas"}
              </h2>

              <p className="text-muted mb-3">
                {empresa?.descripcion_sistema ||
                  "Soluciones profesionales, productos y servicios para clientes."}
              </p>

              <div className="d-flex flex-wrap gap-2">

                <Link
                  to="/productos"
                  className="btn btn-outline-dark btn-sm"
                >
                  Productos
                </Link>

                <Link
                  to="/servicios"
                  className="btn btn-outline-dark btn-sm"
                >
                  Servicios
                </Link>

              </div>

            </div>

            <div className="col-lg-4 text-center">

              {empresa?.logo_principal_url ? (
                <img
                  src={empresa.logo_principal_url}
                  alt={empresa.nombre_fantasia || "Logo empresa"}
                  className="img-fluid home-intro-logo"
                />
              ) : (
                <div className="home-intro-placeholder">
                  Logo empresa
                </div>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* SERVICIOS */}
      <section className="py-4">
        <div className="container">

          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">

            <div>
              <h2 className="h4 fw-bold mb-1">
                Servicios destacados
              </h2>

              <p className="text-muted mb-0">
                Servicios disponibles para solicitar o consultar.
              </p>
            </div>

            <Link
              to="/servicios"
              className="btn btn-sm btn-outline-dark"
            >
              Ver todos
            </Link>

          </div>

          <div className="row g-4">

            {servicios.length > 0 ? (
              servicios.map((servicio) => (
                <ServiceCard
                  key={servicio.id}
                  servicio={servicio}
                />
              ))
            ) : (
              <div className="col-12">
                <div className="alert alert-secondary mb-0">
                  No hay servicios destacados disponibles.
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

    </MainLayout>
  );
}

export default Home;