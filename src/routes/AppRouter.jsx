import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import CatalogoProductos from "../pages/CatalogoProductos";
import CatalogoServicios from "../pages/CatalogoServicios";
import ProductoDetalle from "../pages/ProductoDetalle";
import ServicioDetalle from "../pages/ServicioDetalle";
import Login from "../pages/Login";
import Registro from "../pages/Registro";
import MiPerfil from "../pages/MiPerfil";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/productos" element={<CatalogoProductos />} />
                <Route path="/servicios" element={<CatalogoServicios />} />
                <Route path="/productos/:slug" element={<ProductoDetalle />} />
                <Route path="/servicios/:slug" element={<ServicioDetalle />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/mi-perfil" element={<MiPerfil />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;