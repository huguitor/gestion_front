import { useEffect, useMemo, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

function MiPerfil() {
    const { user, loadingAuth, isAuthenticated, refreshUser } = useAuth();

    const [form, setForm] = useState({
        nombre: "",
        apellido: "",
        telefono: "",
    });

    const [loadingSave, setLoadingSave] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (user) {
            setForm({
                nombre: user.nombre || "",
                apellido: user.apellido || "",
                telefono: user.telefono || "",
            });
        }
    }, [user]);

    const fechaAltaFormateada = useMemo(() => {
        if (!user?.fecha_alta) return "-";

        const fecha = new Date(user.fecha_alta);
        if (Number.isNaN(fecha.getTime())) return user.fecha_alta;

        return fecha.toLocaleString("es-AR");
    }, [user]);

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoadingSave(true);

        try {
            const payload = {
                nombre: form.nombre.trim(),
                apellido: form.apellido.trim(),
                telefono: form.telefono.trim(),
            };

            await api.patch("/web-clientes/mi-perfil/", payload);
            await refreshUser();

            setSuccess("Perfil actualizado correctamente.");
        } catch (err) {
            console.error("Error actualizando perfil:", err);

            if (err.response?.data) {
                const data = err.response.data;

                if (typeof data === "string") {
                    setError(data);
                } else if (data.detail) {
                    setError(data.detail);
                } else {
                    const mensajes = Object.entries(data)
                        .map(([campo, errores]) => {
                            const texto = Array.isArray(errores)
                                ? errores.join(" ")
                                : String(errores);
                            return `${campo}: ${texto}`;
                        })
                        .join(" | ");

                    setError(mensajes || "No se pudo actualizar el perfil.");
                }
            } else {
                setError("No se pudo actualizar el perfil.");
            }
        } finally {
            setLoadingSave(false);
        }
    };

    if (loadingAuth) {
        return (
            <MainLayout>
                <div className="container py-5">
                    <p>Cargando perfil...</p>
                </div>
            </MainLayout>
        );
    }

    if (!isAuthenticated || !user) {
        return (
            <MainLayout>
                <div className="container py-5">
                    <div className="alert alert-warning">
                        Debés iniciar sesión para ver tu perfil.
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="card shadow-sm border-0">
                            <div className="card-body p-4">
                                <h1 className="h3 mb-4">Mi perfil</h1>

                                {error ? <div className="alert alert-danger">{error}</div> : null}
                                {success ? <div className="alert alert-success">{success}</div> : null}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Nombre</label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            className="form-control"
                                            value={form.nombre}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Apellido</label>
                                        <input
                                            type="text"
                                            name="apellido"
                                            className="form-control"
                                            value={form.apellido}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Correo electrónico</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={user.email || ""}
                                            disabled
                                        />
                                        <div className="form-text">
                                            Por ahora el correo electrónico no es editable.
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Teléfono</label>
                                        <input
                                            type="text"
                                            name="telefono"
                                            className="form-control"
                                            value={form.telefono}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Email verificado</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={user.email_verificado ? "Sí" : "No"}
                                            disabled
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Activo</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={user.activo ? "Sí" : "No"}
                                            disabled
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label">Fecha de alta</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={fechaAltaFormateada}
                                            disabled
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-dark w-100"
                                        disabled={loadingSave}
                                    >
                                        {loadingSave ? "Guardando..." : "Guardar cambios"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

export default MiPerfil;