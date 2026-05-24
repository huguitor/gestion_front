import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { modules } from "../config/modules";

function Header({ empresa }) {
    const navigate = useNavigate();

    const {
        isAuthenticated,
        user,
        logout,
        loadingAuth,
    } = useAuth();

    const { totalItems } = useCart();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const mostrarCarrito =
        modules.carrito &&
        modules.pedidos;

    return (
        <header className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
            <div className="container">
                <Link
                    className="navbar-brand d-flex align-items-center gap-2"
                    to="/"
                >
                    {empresa?.logo_principal_url ? (
                        <img
                            src={empresa.logo_principal_url}
                            alt={empresa.nombre_fantasia || "Logo"}
                            style={{
                                width: "40px",
                                height: "40px",
                                objectFit: "cover",
                                borderRadius: "8px",
                            }}
                        />
                    ) : null}

                    <span>
                        {empresa?.nombre_fantasia || "Gestión Front"}
                    </span>
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#mainNavbar"
                    aria-controls="mainNavbar"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div
                    className="collapse navbar-collapse"
                    id="mainNavbar"
                >
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to="/"
                            >
                                Inicio
                            </Link>
                        </li>

                        {modules.productos && (
                            <li className="nav-item">
                                <Link
                                    className="nav-link"
                                    to="/productos"
                                >
                                    Productos
                                </Link>
                            </li>
                        )}

                        {modules.productos && (
                            <li className="nav-item">
                                <Link
                                    className="nav-link"
                                    to="/servicios"
                                >
                                    Servicios
                                </Link>
                            </li>
                        )}

                        {loadingAuth ? (
                            <li className="nav-item">
                                <span className="nav-link disabled">
                                    Cargando...
                                </span>
                            </li>
                        ) : !isAuthenticated ? (
                            <>
                                <li className="nav-item">
                                    <Link
                                        className="nav-link"
                                        to="/login"
                                    >
                                        Ingresar
                                    </Link>
                                </li>

                                {modules.registro && (
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
                        ) : (
                            <>
                                {mostrarCarrito && (
                                    <li className="nav-item">
                                        <Link
                                            className="nav-link position-relative"
                                            to="/carrito"
                                        >
                                            🛒 Carrito

                                            {totalItems > 0 && (
                                                <span className="badge rounded-pill bg-success ms-1">
                                                    {totalItems}
                                                </span>
                                            )}
                                        </Link>
                                    </li>
                                )}

                                <li className="nav-item">
                                    <span className="nav-link text-light">
                                        Hola, {user?.nombre || user?.email || "usuario"}
                                    </span>
                                </li>

                                <li className="nav-item">
                                    <Link
                                        className="nav-link"
                                        to="/mi-perfil"
                                    >
                                        Mi perfil
                                    </Link>
                                </li>

                                {modules.pedidos && (
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
                                    <button
                                        type="button"
                                        className="btn btn-outline-light btn-sm ms-lg-2"
                                        onClick={handleLogout}
                                    >
                                        Cerrar sesión
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