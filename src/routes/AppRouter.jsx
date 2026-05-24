import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import CatalogoProductos from "../pages/CatalogoProductos";
import CatalogoServicios from "../pages/CatalogoServicios";
import ProductoDetalle from "../pages/ProductoDetalle";
import ServicioDetalle from "../pages/ServicioDetalle";
import Login from "../pages/Login";
import Registro from "../pages/Registro";
import MiPerfil from "../pages/MiPerfil";
import Carrito from "../pages/Carrito";
import MisPedidos from "../pages/MisPedidos";
import MiPedidoDetalle from "../pages/MiPedidoDetalle";

import { useEmpresa } from "../context/EmpresaContext";

function AppRoutes() {
    const { modulos = {} } = useEmpresa();

    return (
        <Routes>
            <Route path="/" element={<Home />} />

            {modulos.productos && (
                <>
                    <Route path="/productos" element={<CatalogoProductos />} />
                    <Route path="/servicios" element={<CatalogoServicios />} />
                    <Route path="/productos/:slug" element={<ProductoDetalle />} />
                    <Route path="/servicios/:slug" element={<ServicioDetalle />} />
                </>
            )}

            <Route path="/login" element={<Login />} />

            {modulos.registro && (
                <Route path="/registro" element={<Registro />} />
            )}

            <Route path="/mi-perfil" element={<MiPerfil />} />

            {modulos.carrito && modulos.pedidos && (
                <Route path="/carrito" element={<Carrito />} />
            )}

            {modulos.pedidos && (
                <>
                    <Route path="/mis-pedidos" element={<MisPedidos />} />
                    <Route path="/mis-pedidos/:id" element={<MiPedidoDetalle />} />
                </>
            )}

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

function AppRouter() {
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
}

export default AppRouter;