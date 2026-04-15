import AppRouter from "./routes/AppRouter";
import { EmpresaProvider } from "./context/EmpresaContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <EmpresaProvider>
        <AppRouter />
      </EmpresaProvider>
    </AuthProvider>
  );
}

export default App;