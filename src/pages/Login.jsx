import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/client";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const payload = {
                email: form.email.trim().toLowerCase(),
                password: form.password,
            };

            const res = await api.post("/web-clientes/login/", payload);

            const token = res.data.token;
            if (!token) {
                throw new Error("No se recibió token del servidor.");
            }

            await login(token);

            setSuccess("Te logueaste satisfactoriamente.");

            setTimeout(() => {
                navigate("/");
            }, 1000);
        } catch (err) {
            console.error("Error login:", err);

            if (err.response?.data?.non_field_errors) {
                setError(err.response.data.non_field_errors.join(" "));
            } else if (err.response?.data?.detail) {
                setError(err.response.data.detail);
            } else {
                setError("Correo o contraseña incorrectos.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5">
                        <div className="card shadow-sm border-0">
                            <div className="card-body p-4">
                                <h1 className="h3 mb-4 text-center">Ingresar</h1>

                                {error ? <div className="alert alert-danger">{error}</div> : null}
                                {success ? <div className="alert alert-success">{success}</div> : null}

                                <form onSubmit={handleSubmit}>
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

                                    <button
                                        type="submit"
                                        className="btn btn-dark w-100"
                                        disabled={loading}
                                    >
                                        {loading ? "Ingresando..." : "Ingresar"}
                                    </button>
                                </form>

                                <p className="mt-3 mb-0 text-center text-muted">
                                    ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

export default Login;