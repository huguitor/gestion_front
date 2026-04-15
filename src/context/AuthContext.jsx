import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true);

    const isAuthenticated = !!token;

    const clearSession = () => {
        localStorage.removeItem("token");
        setToken("");
        setUser(null);
    };

    const fetchProfile = async (authToken) => {
        if (!authToken) {
            setUser(null);
            return null;
        }

        try {
            const res = await api.get("/web-clientes/mi-perfil/", {
                headers: {
                    Authorization: `Token ${authToken}`,
                },
            });

            setUser(res.data);
            return res.data;
        } catch (error) {
            console.error("Error obteniendo perfil:", error);
            clearSession();
            return null;
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            const savedToken = localStorage.getItem("token") || "";

            if (savedToken) {
                setToken(savedToken);
                await fetchProfile(savedToken);
            } else {
                setUser(null);
            }

            setLoadingAuth(false);
        };

        initAuth();
    }, []);

    const login = async (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        await fetchProfile(newToken);
    };

    const refreshUser = async () => {
        if (!token) return null;
        return await fetchProfile(token);
    };

    const logout = () => {
        clearSession();
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                isAuthenticated,
                loadingAuth,
                login,
                refreshUser,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}