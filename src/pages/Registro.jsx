import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import MainLayout from "../layouts/MainLayout";

function Registro() {

    const [form, setForm] = useState({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        password2: "",
        telefono: "",
        acepta_terminos: false,
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (form.password !== form.password2) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        if (!form.acepta_terminos) {
            setError("Debés aceptar los términos.");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                nombre: form.nombre.trim(),
                apellido: form.apellido.trim(),
                email: form.email.trim().toLowerCase(),
                password: form.password,
                telefono: form.telefono.trim(),
                acepta_terminos: form.acepta_terminos,
            };

            await api.post("/web-clientes/registro/", payload);

            setSuccess(
                "Cuenta creada correctamente. Te enviamos un correo de verificación. Revisá tu bandeja de entrada para activar la cuenta. Hasta verificar el correo no vas a poder ver precios ni realizar pedidos."
            );

            // limpiar formulario
            setForm({
                nombre: "",
                apellido: "",
                email: "",
                password: "",
                password2: "",
                telefono: "",
                acepta_terminos: false,
            });
        } catch (err) {
            console.error("Error registro:", err);

            if (err.response?.data) {
                const data = err.response.data;

                if (typeof data === "string") {
                    setError(data);
                } else {
                    const mensajes = Object.entries(data)
                        .map(([campo, errores]) => {
                            const texto = Array.isArray(errores) ? errores.join(" ") : String(errores);
                            return `${campo}: ${texto}`;
                        })
                        .join(" | ");

                    setError(mensajes || "No se pudo completar el registro.");
                }
            } else {
                setError("No se pudo completar el registro.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="card shadow-sm border-0">
                            <div className="card-body p-4">
                                <h1 className="h3 mb-4 text-center">Registro</h1>

                                {error ? <div className="alert alert-danger">{error}</div> : null}
                                {success ? (
                                    <div className="alert alert-success">
                                        <h5 className="mb-2">
                                            ✔ Registro completado
                                        </h5>

                                        <div>{success}</div>

                                        <hr />

                                        <Link
                                            to="/login"
                                            className="btn btn-success btn-sm"
                                        >
                                            Ir a iniciar sesión
                                        </Link>
                                    </div>
                                ) : null}

                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
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

                                        <div className="col-md-6 mb-3">
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
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Correo electrónico</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            value={form.email}
                                            onChange={handleChange}
                                            required
                                        />
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
                                        <label className="form-label">Contraseña</label>
                                        <input
                                            type="password"
                                            name="password"
                                            className="form-control"
                                            value={form.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Repetir contraseña</label>
                                        <input
                                            type="password"
                                            name="password2"
                                            className="form-control"
                                            value={form.password2}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-check mb-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="acepta_terminos"
                                            id="acepta_terminos"
                                            checked={form.acepta_terminos}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label" htmlFor="acepta_terminos">
                                            Acepto los términos y condiciones
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-dark w-100"
                                        disabled={loading}
                                    >
                                        {loading ? "Registrando..." : "Crear cuenta"}
                                    </button>
                                </form>

                                <p className="mt-3 mb-0 text-center text-muted">
                                    ¿Ya tenés cuenta? <Link to="/login">Ingresá</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

export default Registro;