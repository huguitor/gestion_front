function Footer({ empresa }) {
    return (
        <footer className="bg-light border-top mt-5">
            <div className="container py-4 text-center">
                <p className="mb-1 fw-semibold">
                    {empresa?.nombre_empresa || "Panozo Sistemas"}
                </p>
                {empresa?.direccion ? <p className="mb-1 text-muted">{empresa.direccion}</p> : null}
                {empresa?.telefono ? <p className="mb-1 text-muted">Tel: {empresa.telefono}</p> : null}
                {empresa?.email ? <p className="mb-1 text-muted">{empresa.email}</p> : null}
                <p className="mb-0 text-muted small">
                    © {new Date().getFullYear()} - Derechos reservados
                </p>
            </div>
        </footer>
    );
}

export default Footer;