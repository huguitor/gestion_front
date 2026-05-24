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

import { modules } from "../config/modules";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />

                {modules.productos && (
                    <>
                        <Route path="/productos" element={<CatalogoProductos />} />
                        <Route path="/servicios" element={<CatalogoServicios />} />
                        <Route path="/productos/:slug" element={<ProductoDetalle />} />
                        <Route path="/servicios/:slug" element={<ServicioDetalle />} />
                    </>
                )}

                <Route path="/login" element={<Login />} />

                {modules.registro && (
                    <Route path="/registro" element={<Registro />} />
                )}

                <Route path="/mi-perfil" element={<MiPerfil />} />

                {modules.carrito && modules.pedidos && (
                    <Route path="/carrito" element={<Carrito />} />
                )}

                {modules.pedidos && (
                    <>
                        <Route path="/mis-pedidos" element={<MisPedidos />} />
                        <Route path="/mis-pedidos/:id" element={<MiPedidoDetalle />} />
                    </>
                )}

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;