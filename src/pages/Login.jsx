import { useEffect, useRef, useState } from "react";
import { useNavigate, Link, useSearchParams, } from "react-router-dom";
import api from "../api/client";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext";

function Login() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useAuth();

    const googleButtonRef = useRef(null);

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    const handleGoogleCredential = async (response) => {
        setError("");
        setSuccess("");
        setGoogleLoading(true);

        try {
            if (!response?.credential) {
                throw new Error("Google no devolvió credential.");
            }

            const res = await api.post("/web-clientes/google-login/", {
                credential: response.credential,
            });

            const token = res.data.token;
            if (!token) {
                throw new Error("No se recibió token del servidor.");
            }

            await login(token);

            setSuccess("Ingresaste correctamente con Google.");

            setTimeout(() => {
                navigate("/");
            }, 800);
        } catch (err) {
            console.error("Error Google Login:", err);

            if (err.response?.data?.non_field_errors) {
                setError(err.response.data.non_field_errors.join(" "));
            } else if (err.response?.data?.credential) {
                setError(err.response.data.credential.join(" "));
            } else if (err.response?.data?.detail) {
                setError(err.response.data.detail);
            } else {
                setError("No se pudo ingresar con Google.");
            }
        } finally {
            setGoogleLoading(false);
        }
    };

    useEffect(() => {
        if (!googleClientId) {
            console.warn("Falta VITE_GOOGLE_CLIENT_ID en el frontend.");
            return;
        }

        if (!window.google || !googleButtonRef.current) {
            return;
        }

        window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleGoogleCredential,
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: "outline",
            size: "large",
            width: 320,
            text: "signin_with",
        });
    }, [googleClientId]);

    useEffect(() => {
        const verified = searchParams.get("verified");
        const errorCode = searchParams.get("error");

        if (verified === "1") {
            setSuccess(
                "Correo verificado correctamente. Ya podés ver precios y realizar pedidos."
            );
        }

        if (errorCode === "token_expirado") {
            setError(
                "El enlace de verificación venció. Solicitá uno nuevo."
            );
        }

        if (errorCode === "token_invalido") {
            setError(
                "El enlace de verificación no es válido."
            );
        }

        if (errorCode === "cliente_no_existe") {
            setError(
                "No encontramos la cuenta asociada."
            );
        }
    }, [searchParams]);

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

                                <div className="d-flex justify-content-center mb-3">
                                    <div ref={googleButtonRef}></div>
                                </div>

                                {googleLoading ? (
                                    <p className="text-center text-muted small">
                                        Validando cuenta de Google...
                                    </p>
                                ) : null}

                                <div className="d-flex align-items-center my-3">
                                    <hr className="flex-grow-1" />
                                    <span className="px-2 text-muted small">o ingresá con email</span>
                                    <hr className="flex-grow-1" />
                                </div>

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
                                        disabled={loading || googleLoading}
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