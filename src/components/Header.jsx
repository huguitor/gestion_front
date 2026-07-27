import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useEmpresa } from "../context/EmpresaContext";

function Header({ empresa }) {
    const navigate = useNavigate();

    const {
        isAuthenticated,
        logout,
        loadingAuth,
    } = useAuth();

    const { totalItems } = useCart();

    const {
        modulos = {},
    } = useEmpresa();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const mostrarCarrito =
        modulos.carrito &&
        modulos.pedidos;

    const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL ||
        "https://api-gestion.panozosistemas.com.ar";

    const logoSrc = empresa?.logo_url
        ? empresa.logo_url.startsWith("http")
            ? empresa.logo_url
            : `${API_BASE_URL}${empresa.logo_url}`
        : null;

    return (
        <header className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
            <div className="container">

                <Link
                    className="navbar-brand d-flex align-items-center gap-2"
                    to="/"
                >

                    {logoSrc && (
                        <img
                            src={logoSrc}
                            alt="logo"
                            style={{
                                width: "40px",
                                height: "40px",
                                objectFit: "contain",
                                borderRadius: "8px",
                                backgroundColor: "white",
                            }}
                        />
                    )}

                    {empresa?.nombre_fantasia && (
                        <span>{empresa.nombre_fantasia}</span>
                    )}

                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#mainNavbar"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div
                    className="collapse navbar-collapse"
                    id="mainNavbar"
                >

                    <ul className="navbar-nav ms-auto">

                        <li className="nav-item">
                            <Link className="nav-link" to="/">
                                Inicio
                            </Link>
                        </li>

                        {modulos.productos && (
                            <>
                                <li className="nav-item">
                                    <Link
                                        className="nav-link"
                                        to="/productos"
                                    >
                                        Productos
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link
                                        className="nav-link"
                                        to="/servicios"
                                    >
                                        Servicios
                                    </Link>
                                </li>
                            </>
                        )}

                        {!loadingAuth &&
                            !isAuthenticated && (
                                <>
                                    <li className="nav-item">
                                        <Link
                                            className="nav-link"
                                            to="/login"
                                        >
                                            Ingresar
                                        </Link>
                                    </li>

                                    {modulos.registro && (
                                        <li className="nav-item">
                                            <Link
                                                className="nav-link"
                                                to="/registro"
                                            >
                                                Registro
                                            </Link>
                                        </li>
                                    )}
                                </>
                            )}

                        {!loadingAuth &&
                            isAuthenticated && (
                                <>
                                    {mostrarCarrito && (
                                        <li className="nav-item">
                                            <Link
                                                className="nav-link"
                                                to="/carrito"
                                            >
                                                🛒 {totalItems}
                                            </Link>
                                        </li>
                                    )}

                                    {modulos.pedidos && (
                                        <li className="nav-item">
                                            <Link
                                                className="nav-link"
                                                to="/mis-pedidos"
                                            >
                                                Mis pedidos
                                            </Link>
                                        </li>
                                    )}

                                    <li className="nav-item">
                                        <Link
                                            className="nav-link"
                                            to="/mi-perfil"
                                        >
                                            Mi perfil
                                        </Link>
                                    </li>

                                    <li className="nav-item">
                                        <button
                                            className="btn btn-outline-light btn-sm"
                                            onClick={handleLogout}
                                        >
                                            Salir
                                        </button>
                                    </li>
                                </>
                            )}

                    </ul>

                </div>

            </div>
        </header>
    );
}

export default Header;