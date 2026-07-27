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
                const empresaHome = resHome.data.empresa || {};

                const resConfig = await api.get(
                    "/configuracion/configuracion/config_login/"
                );

                const configLogin = resConfig.data || {};

                setEmpresa({
                    ...empresaHome,
                    nombre_fantasia:
                        configLogin.nombre_fantasia ||
                        empresaHome.nombre_fantasia,
                    descripcion_sistema:
                        configLogin.descripcion_sistema ||
                        empresaHome.descripcion_sistema,
                    logo_url:
                        configLogin.logo_url ||
                        empresaHome.logo_url ||
                        empresaHome.logo_principal_url,
                    logo_absolute_url:
                        configLogin.logo_absolute_url ||
                        empresaHome.logo_absolute_url ||
                        empresaHome.logo_principal_absolute_url,
                });

                if (configLogin.modulos) {
                    setModulos({
                        ...fallbackModules,
                        ...configLogin.modulos,
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