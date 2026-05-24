import { createContext, useContext, useEffect, useState } from "react";

import api from "../api/client";
import { modules as fallbackModules } from "../config/modules";

const EmpresaContext = createContext();

export function EmpresaProvider({ children }) {
    const [empresa, setEmpresa] = useState(null);
    const [modulos, setModulos] = useState(fallbackModules);
    const [empresaLoading, setEmpresaLoading] = useState(true);
    const [empresaError, setEmpresaError] = useState("");

    useEffect(() => {
        const cargarEmpresa = async () => {
            try {
                const resHome = await api.get("/web/home/");
                setEmpresa(resHome.data.empresa || null);

                const resConfig = await api.get(
                    "/configuracion/configuracion/config_login/"
                );

                if (resConfig.data?.modulos) {
                    setModulos({
                        ...fallbackModules,
                        ...resConfig.data.modulos,
                    });
                }
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
                modulos,
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