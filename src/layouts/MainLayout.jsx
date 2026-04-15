import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEmpresa } from "../context/EmpresaContext";

function MainLayout({ children }) {
    const { empresa } = useEmpresa();

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header empresa={empresa} />
            <main className="flex-grow-1">{children}</main>
            <Footer empresa={empresa} />
        </div>
    );
}

export default MainLayout;