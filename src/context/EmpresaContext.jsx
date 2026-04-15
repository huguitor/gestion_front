import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";

const EmpresaContext = createContext();

export function EmpresaProvider({ children }) {
    const [empresa, setEmpresa] = useState(null);
    const [empresaLoading, setEmpresaLoading] = useState(true);
    const [empresaError, setEmpresaError] = useState("");

    useEffect(() => {
        const cargarEmpresa = async () => {
            try {
                const res = await api.get("/web/home/");
                setEmpresa(res.data.empresa || null);
            } catch (error) {
                console.error("Error cargando empresa:", error);
                setEmpresaError("No se pudo cargar la información de la empresa.");
            } finally {
                setEmpresaLoading(false);
            }
        };

        cargarEmpresa();
    }, []);

    return (
        <EmpresaContext.Provider
            value={{
                empresa,
                empresaLoading,
                empresaError,
            }}
        >
            {children}
        </EmpresaContext.Provider>
    );
}

export function useEmpresa() {
    return useContext(EmpresaContext);
}